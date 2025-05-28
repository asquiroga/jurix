<?php

namespace App\Http\Controllers\Bots;

use App\Helpers;
use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

class ScbaBotController extends Controller
{
    public function getNotifications(Request $request)
    {
        $fecha = $this::getFechaFromRequest($request);
        $response = $this::scbaLogin();

        if ($response->successful()) {
            $cookies = $response->cookies();
            $cookieJar = $cookies;

            $cookieArray = [];
            foreach ($cookieJar->toArray() as $cookie) {
                $cookieArray[$cookie['Name']] = $cookie['Value'];
            }

            // Pegarle por AJAX al listado de notificaciones
            $searchPayload = $this::notificationsPayload($fecha);

            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
                ->withCookies($cookieArray, 'notificaciones.scba.gov.ar')
                ->post(config('bot.scba.notificationsUrl'), $searchPayload);

            $crazyResponse = json_decode($response->json()["d"]);
            $notif = $crazyResponse->notificaciones;
            $crawler = new Crawler($notif);

            $notificaciones = [];

            $crawler->filter('div.col-md-12 > table')->each(function ($node)  use (&$notificaciones) {
                $currentNotif = [];
                $node->filter("td")->filterXPath('//td[label]')->each(function ($td) use (&$currentNotif) {
                    $key = Helpers::quitarAcentos($td->filter("label")->text());
                    $text = "";
                    foreach ($td->getNode(0)->childNodes as $child) {
                        if ($child->nodeType === XML_TEXT_NODE) {
                            $text .= trim($child->textContent);
                        }
                    }
                    $currentNotif[$key] = $text;
                });
                $node->filter("td")->filterXPath('//td[label and a]')->each(function ($td) use (&$currentNotif) {
                    $key = Helpers::quitarAcentos($td->filter("label")->text());
                    $anchor = $td->filter("a");
                    $currentNotif[$key] = [
                        "link" => $anchor->attr('href'),
                        "text" => $anchor->text()
                    ];
                });

                array_push($notificaciones, $currentNotif);
            });

            return $notificaciones;
        } else {
            dd('Login fallido', $response->status(), $response->body());
        }
    }

    public function getNotificationBody(Request $request)
    {
        $response = $this::scbaLogin();
        if ($response->successful()) {
            $cookies = $response->cookies();
            $cookieJar = $cookies;

            $cookieArray = [];
            foreach ($cookieJar->toArray() as $cookie) {
                $cookieArray[$cookie['Name']] = $cookie['Value'];
            }

            $response = Http::withCookies($cookieArray, 'notificaciones.scba.gov.ar')
                ->get(config('bot.scba.baseUrl') . $request->query('url'));

            $crawler = new Crawler($response->body());

            $crawler->filter("#bTexto p")->each(function ($paragraph) {
                echo $paragraph->html();
                echo "<br/>";
            });

            $divsQr = $crawler->filter(".mostrarImpr .panel-body > div");
            echo "<div class=\"scba-qr-wrapper\">\n";
            echo $divsQr->eq(0)->outerHtml();
            echo $divsQr->eq(1)->outerHtml();
            echo "\n</div>";

            die();
        }
    }

    private static function scbaLogin()
    {
        $loginPayload = [
            'domicilioElectronico' => env("SCBA_USER"),
            'pass' => env("SCBA_PASS"),
            'url' => '',
        ];

        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])
            ->post(config("bot.scba.loginUrl"), $loginPayload);

        return $response;
    }

    private static function getFechaFromRequest(Request $request)
    {
        if ($request->has('fecha') && Helpers::esFechaValida($request->query('fecha'))) {
            $fecha = DateTime::createFromFormat("d/m/Y", $request->query('fecha'));
        } else {
            $fecha = new DateTime();
        }

        if ($fecha->format('N') == 1) { // si es Lunes, incluimos el viernes
            $fecha->modify('-3 days');
        } else {
            $fecha->modify('-1 days');
        }
        return $fecha->format("d/m/Y");
    }

    private static function notificationsPayload($fecha)
    {
        return [
            'codigoBarras' => '',
            'caratula' => '',
            'tramites' => 'null',
            'Desde' => $fecha,
            'Hasta' => '',
            'domicilio' => "-1",
            'departamento' => "-1",
            'org' => "",
            'texto' => "",
            'procesada' => "0",
            'descripDep' => "Todos",
            'OrganismoDescrip' => "",
            'descripTramites' => "",
            'descripDom' => "Todos",
            'descripProcesada' => "No Procesadas",
            'pagina' => "1",
            'orden' => "FECHANOTIFICACION"
        ];
    }
}
