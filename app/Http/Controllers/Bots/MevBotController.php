<?php

namespace App\Http\Controllers\Bots;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\Request;
use Symfony\Component\DomCrawler\Crawler;

class MevBotController extends Controller
{
    public function test(Request $request)
    {
        [$client, $cookieJar] = $this->login();

        $response = $client->post("https://mev.scba.gov.ar/POSLoguin.asp", [
            'form_params' => [
                "TipoDto" => "CC",
                "DtoJudElegido" => "6",
                "Aceptar" => "Aceptar"
            ],
        ]);

        $response = $client->get("https://mev.scba.gov.ar/Busqueda.asp");


        // Busqueda en un SET (nidset)
        $response = $client->get("https://mev.scba.gov.ar/resultados.asp?nidset=1876963&sfechadesde=27/5/2025&sfechahasta=29/5/2025&pOrden=xCa&pOrdenAD=Asc");

        $crawler = new Crawler($response->getBody()->getContents());

        $rows = $crawler->filter("form > table")->eq(2)->filter("tr");

        $allResults = [];

        for ($i = 0; $i < $rows->count(); $i += 2) {
            $current = [];
            $mainRow = $rows->eq($i);
            $detailRow = $rows->eq($i + 1);

            $row1 = $mainRow->filter('.AnchoFijoCaratula a');
            if ($row1->count() > 0) {
                $current["Caratula"] = trim($row1->text());
            }

            $detailRow->filter('td')->each(function ($td, $i) use (&$current) {
                //echo $i . " . " . $td->text() . '<br/>';
                $text = trim(str_replace("\u{A0}", '', $td->text()));
                if ($i === 0) $current["Estado"] = $text;
                if ($i === 1) $current["NroReceptoria"] = $text;
                if ($i === 2) $current["IdExpediente"] = $text;
                if ($i === 3) $current["Fecha"] = $text;
                if ($i === 4) $current["PasoConFecha"] = $text;
            });
            $allResults[] = $current;
        }
        dd($allResults);
        $crawler = new Crawler($response->getBody()->getContents());

        $organismos = [];
        $crawler->filter("#JuzgadoElegido option")->each(function (Crawler $option) use (&$organismos) {
            $organismos[] = trim($option->attr("value"));
        });

        $optionSelected = trim($crawler->filter("#JuzgadoElegido option:selected")->attr("value"));
        if ($optionSelected) {
            $clave = array_search($optionSelected, $organismos);

            if ($clave !== false) {
                unset($organismos[$clave]);
            }
        }


        /* en $organismos estan todos los que tenemos que hacer fetch */

        //siguiente fetch por POST
        $response = $client->post("https://mev.scba.gov.ar/resultados.asp?sFechaDesde=27/5/2025&sFechaHasta=29/5/2025", [
            'form_params' => [
                "JuzgadoElegido" => "GAM239",
                "Consultar" => "Consultar"
            ]
        ]);

        echo $response->getBody()->getContents();
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
                'usuario' => 'lucasacarr',
                'clave' => 'lxv30ESTUDIO!31',
                'DeptoRegistrado' => 'LP'
            ],
        ]);

        $r = $response->getHeader('X-Guzzle-Redirect-History');
        if (!str_contains($r[0], "POSLoguin.asp")) {
            abort(401, "Credenciales invalidas");
        };

        return [$client, $cookieJar];
    }
}
