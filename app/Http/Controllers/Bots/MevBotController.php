<?php

namespace App\Http\Controllers\Bots;

use App\Helpers;
use App\Http\Controllers\Controller;
use DateTime;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class MevBotController extends Controller
{
    public function notifications(Request $request)
    {
        [$fechaFrom, $fechaHasta] = $this->getFechaFromRequest($request);
        $inicio = microtime(true);
        [$client, $cookieJar] = $this->login();

        $allResults = [];

        // Busqueda en un SET (nidset)
        $url =  "https://mev.scba.gov.ar/resultados.asp?nidset=1876963&sfechadesde={{desde}}&sfechahasta={{hasta}}&pOrden=xCa&pOrdenAD=Asc";
        $url = strtr($url, [
            "{{desde}}" => $fechaFrom,
            "{{hasta}}" => $fechaHasta,
        ]);

        $response = $client->get($url);
        $crawler = new Crawler($response->getBody()->getContents());

        [$organismos, $selected] = $this->scrapOrganismos($crawler);
        $this->scraper($crawler, $allResults, $selected["value"]);

        $keys = array_keys($organismos); // guardás las claves en orden
        $requests = function () use ($organismos, $client, $fechaFrom, $fechaHasta) {
            foreach ($organismos as $index => $value) {
                yield function () use ($index, $client, $fechaFrom, $fechaHasta) {
                    $url = 'https://mev.scba.gov.ar/resultados.asp?sFechaDesde={{desde}}&sFechaHasta={{hasta}}';
                    $url = strtr($url, [
                        "{{desde}}" => $fechaFrom,
                        "{{hasta}}" => $fechaHasta,
                    ]);
                    return $client->postAsync($url, [
                        'form_params' => [
                            'JuzgadoElegido' => $index,
                            'Consultar' => 'Consultar',
                        ],
                    ]);
                };
            }
        };

        $pool = new Pool($client, $requests(), [
            'concurrency' => 4,
            'fulfilled' => function ($response, $index) use (&$allResults, $keys) {
                $this->scraper(new Crawler($response->getBody()->getContents()), $allResults, $keys[$index]);
            },
            'rejected' => function ($reason, $index) {
                Log::error("Falló request al juzgado {$index}: " . $reason);
            },
        ]);

        $pool->promise()->wait();

        $fin = microtime(true);
        $duration = $fin - $inicio;

        $result = ["data" => $allResults, "organismos" => $organismos];
        return response()->json($result)->header('X-Jurix-Bot-Mev-Duration', $duration);
    }

    public function testSecuencial(Request $request)
    {
        $inicio = microtime(true);
        [$client, $cookieJar] = $this->login();

        $allResults = [];

        // Busqueda en un SET (nidset)
        $response = $client->get("https://mev.scba.gov.ar/resultados.asp?nidset=1876963&sfechadesde=27/5/2025&sfechahasta=29/5/2025&pOrden=xCa&pOrdenAD=Asc");
        $crawler = new Crawler($response->getBody()->getContents());

        [$organismos, $selected] = $this->scrapOrganismos($crawler);
        $this->scraper($crawler, $allResults, $selected["value"]);
        /* en $organismos estan todos los que tenemos que hacer fetch */

        //siguiente fetch por POST


        foreach ($organismos as $key => $value) {
            $response = $client->post("https://mev.scba.gov.ar/resultados.asp?sFechaDesde=27/5/2025&sFechaHasta=29/5/2025", [
                'form_params' => [
                    "JuzgadoElegido" => $key,
                    "Consultar" => "Consultar"
                ]
            ]);

            $this->scraper(new Crawler($response->getBody()->getContents()), $allResults, $key);
        }

        $fin = microtime(true);
        $duration = $fin - $inicio;

        return response()->json($allResults)->header('X-Jurix-Bot-Mev-Duration', $duration);
    }

    private function scraper(Crawler $crawler, &$results, $organismo)
    {
        $rows = $crawler->filter("form > table")->eq(2)->filter("tr");

        for ($i = 0; $i < $rows->count(); $i += 2) {
            $current = [];
            $mainRow = $rows->eq($i);
            $detailRow = $rows->eq($i + 1);

            $row1 = $mainRow->filter('.AnchoFijoCaratula a');
            if ($row1->count() > 0) {
                $current["Caratula"] = trim($row1->text());
            }

            $detailRow->filter('td')->each(function ($td, $i) use (&$current) {
                $text = trim(str_replace("\u{A0}", '', $td->text()));
                if ($i === 0) $current["Estado"] = $text;
                if ($i === 1) $current["NroReceptoria"] = $text;
                if ($i === 2) $current["IdExpediente"] = $text;
                if ($i === 3) $current["Fecha"] = $text;
                if ($i === 4) $current["PasoConFecha"] = $text;
            });
            $current["Organismo"] = $organismo;
            $results[] = $current;
        }
    }

    private function  scrapOrganismos(Crawler $crawler)
    {
        $optionSelectedObj = $crawler->filter("select#JuzgadoElegido > option[selected]");
        $optionSelected = [
            "text" => trim($optionSelectedObj->text()),
            "value" => trim($optionSelectedObj->attr("value"))
        ];
        $organismos = [];
        $crawler->filter("#JuzgadoElegido option")->each(function (Crawler $option) use (&$organismos) {
            $organismos[trim($option->attr("value"))] = trim($option->text());
        });

        if ($optionSelected["value"]) {
            if (array_key_exists($optionSelected["value"], $organismos))
                unset($organismos[$optionSelected["value"]]);
        }

        return [$organismos, $optionSelected];
    }

    private function login()
    {
        $cookieJar = new CookieJar();

        $client = new Client([
            'cookies' => $cookieJar,
            'allow_redirects' => [
                'track_redirects' => true
            ],
        ]);

        $response = $client->post(config('bot.mev.loginPostUrl'), [
            'form_params' => [
                'usuario' => env("MEV_USER"),
                'clave' => env("MEV_PASSWORD"),
                'DeptoRegistrado' => 'LP'
            ],
        ]);

        $r = $response->getHeader('X-Guzzle-Redirect-History');
        if (!str_contains($r[0], "POSLoguin.asp")) {
            abort(401, "Credenciales invalidas");
        };

        $client->post("https://mev.scba.gov.ar/POSLoguin.asp", [
            'form_params' => [
                "TipoDto" => "CC",
                "DtoJudElegido" => "6",
                "Aceptar" => "Aceptar"
            ],
        ]);

        return [$client, $cookieJar];
    }

    public static function getFechaFromRequest(Request $request)
    {
        if ($request->has('fecha') && Helpers::esFechaValida($request->query('fecha'))) {
            $fecha = DateTime::createFromFormat("d/m/Y", $request->query('fecha'));
        } else {
            $fecha = new DateTime();
        }

        $hasta = clone $fecha;
        $hasta->modify('+2 days');

        if ($fecha->format('N') == 1) { // si es Lunes, incluimos el viernes
            $fecha->modify('-3 days');
        } else {
            $fecha->modify('-1 days');
        }


        return [$fecha->format("d/m/Y"), $hasta->format("d/m/Y")];
    }
}
