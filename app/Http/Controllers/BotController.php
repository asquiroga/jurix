<?php

namespace App\Http\Controllers;

use App\Helpers;
use App\Helpers\ScbaBotHelper;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;

class BotController extends Controller
{

    public function getScbaNotifications(Request $request)
    {
        $fecha = "";
        if ($request->has('fecha') && Helpers::esFechaValida($request->query('fecha'))) {
            $fecha = $request->query('fecha');
        } else {
            $fecha = date('d/m/Y');
        }

        $response = ScbaBotHelper::scbaLogin();

        if ($response->successful()) {
            $cookies = $response->cookies();
            $cookieJar = $cookies;

            $cookieArray = [];
            foreach ($cookieJar->toArray() as $cookie) {
                $cookieArray[$cookie['Name']] = $cookie['Value'];
            }

            // Pegarle por AJAX al listado de notificaciones
            $searchPayload = [
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

    public function getScbaNotificationBody(Request $request)
    {
        $response = ScbaBotHelper::scbaLogin();
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

    public function pjn(Request $request)
    {
        $fromFecha = "";
        if ($request->has('fecha') && Helpers::esFechaValida($request->query('fecha'))) {
            $fromFecha = DateTime::createFromFormat("d/m/Y", $request->query('fecha'))->format("Ymd");
        } else {
            $fromFecha = date('Ymd');
        }

        // Crear un jar para almacenar cookies
        $cookieJar = new CookieJar();

        // Crear el cliente con el jar
        $client = new Client([
            'cookies' => $cookieJar,
            'allow_redirects' => [
                'max'             => 10,
                'strict'          => false,
                'referer'         => false,
                'protocols'       => ['http', 'https'],
                'track_redirects' => false
            ],
        ]);

        // Hacer el primer GET
        $url = "https://sso.pjn.gov.ar/auth/realms/pjn/protocol/openid-connect/auth?client_id=pjn-portal&redirect_uri=https%3A%2F%2Fportalpjn.pjn.gov.ar%2F&state=2a866888-ae76-40ac-86dc-ff7a7c026ae2&response_mode=fragment&response_type=code&scope=openid&nonce=3d9b2247-a081-4e56-8661-eb77cfc18c9c";
        $response = $client->get($url);

        $crawler = new Crawler($response->getBody()->getContents());

        $postUrl = $crawler->filter("form#kc-form-login")->attr('action');
        $response = $client->post($postUrl, [
            'form_params' => [
                'username' => '20377107048',
                'password' => 'Estudiopjn',
            ],
        ]);

        $url = "https://scw.pjn.gov.ar/scw/consultaListaRelacionados.seam";

        $response = $client->get($url);
        $response = $client->get($url);

        $crawler = new Crawler($response->getBody()->getContents());
        $input = $crawler->filter('input[name="javax.faces.ViewState"]');
        $facesState = $input->attr('value');

        $response = $client->post($url, [
            'form_params' => [
                'j_idt150:order_by_form' => 'j_idt150:order_by_form',
                'j_idt150:order_by_form:camara' => 'FECHA',
                'javax.faces.ViewState' => $facesState,
                'j_idt150:order_by_form:j_idt165' => 'j_idt150:order_by_form:j_idt165'
            ]
        ]);

        $crawler = new Crawler($response->getBody()->getContents());

        $table = $crawler->filter("form > table");

        $thIndex = 0;  // el nth-hijo del TH "Ult. Act."
        $table->filter("thead th")->each(function ($th, $i) use (&$thIndex) {
            if (str_contains($th->html(), "Act.")) {
                $thIndex = $i;
            }
        });

        $table = $crawler->filter("form > table");

        $thIndex++;

        $result = [];
        $crawler->filter("form > table tbody tr")->each(function (Crawler $tr) use ($thIndex, $fromFecha, &$result) {
            $td = $tr->filter("td:nth-child($thIndex)");
            $fechaString = DateTime::createFromFormat('d/m/Y', $td->text())->format("Ymd");

            if ($fechaString >= $fromFecha) {
                $thLabels = ["expediente", "dependencia", "caratula", "situacion", "ultimaActualizacion"];
                $current = [];
                $tr->filter("td")->each(function ($td, $i) use (&$current, $thLabels) {
                    if ($i < 5)
                        $current[$thLabels[$i]] = $td->text();
                });
                array_push($result, $current);
            }
        });
        return $result;
    }
}
