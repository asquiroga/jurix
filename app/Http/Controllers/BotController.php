<?php

namespace App\Http\Controllers;

use App\Helpers;
use App\Helpers\PjnBotHelper;
use App\Helpers\ScbaBotHelper;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Session;

use function PHPUnit\Framework\stringContains;

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

        [$client, $response, $cookieJar] = PjnBotHelper::pjnLogin();
        [$response] = PjnBotHelper::listarPorFecha($client, $cookieJar);

        $crawler = new Crawler($response->getBody()->getContents());

        $table = $crawler->filter("form > table");

        $thIndex = PjnBotHelper::getColumnUltActIndex($table);
        $thIndex++;

        $table = $crawler->filter("form > table");
        $result = [];
        $crawler->filter("form > table tbody tr")->each(function (Crawler $tr) use ($thIndex, $fromFecha, &$result) {
            $td = $tr->filter("td:nth-child($thIndex)");
            $fechaString = DateTime::createFromFormat('d/m/Y', $td->text())->format("Ymd");

            if ($fechaString >= $fromFecha) {
                $thLabels = ["expediente", "dependencia", "caratula", "situacion", "ultimaActualizacion"];
                $current = [];
                $tr->filter("td")->each(function ($td, $i) use (&$current, &$thLabels) {
                    if ($i < 5)
                        $current[$thLabels[$i]] = $td->text();
                });
                array_push($result, $current);
            }
        });
        return $result;
    }

    public function pjnExpediente(Request $request)
    {
        $fromFecha = PjnBotHelper::getFechaFromRequest($request);
        $client = PjnBotHelper::regenerateClientFromSession();
        $facesState = Session::get("faces.viewstate");

        $response = $client->post(config("bot.pjn.listar"), [
            'form_params' => [
                'javax.faces.ViewState' => $facesState,
                'tablaConsultaLista:tablaConsultaForm' => 'tablaConsultaLista:tablaConsultaForm',
                'tablaConsultaLista:tablaConsultaForm:j_idt179:dataTable:0:j_idt230' => 'tablaConsultaLista:tablaConsultaForm:j_idt179:dataTable:0:j_idt230'
            ]
        ]);

        $history = $response->getHeader('X-Guzzle-Redirect-History');
        $last = end($history);
        if (str_contains($last, "homePrivado.seam")) {
            // re-login
            die("re-login");
        }


        $crawler = new Crawler($response->getBody()->getContents());

        $headers = ["Acciones", "Oficina", "Fecha", "Tipo", "Descripcion", "AFS"];

        $result = [];
        $crawler->filter('[id="expediente:action-table"] tbody tr')
            ->each(function ($tr) use ($headers, &$result, $fromFecha) {
                $current = [];
                $fechaTd = $tr->filter("td:nth-child(3) span:nth-child(2)");
                $fechaString = DateTime::createFromFormat('d/m/Y', $fechaTd->text())->format("Ymd");
                if ($fechaString < $fromFecha)
                    return;

                $tr->filter("td")->each(function ($td, $i) use ($headers, &$current) {
                    if ($i >= 1 && $i <= 4) {
                        $current[$headers[$i]] = $td->filter("span:last-of-type")->text();
                    } else {
                        if ($i == 0) {
                            $anchors = $td->filter("a");
                            if ($anchors->count() > 0) {
                                $current["link"] = "https://scw.pjn.gov.ar/" . $anchors->first()->attr('href');
                            }
                        } else {

                            $current[$headers[$i]] = $td->text();
                        }
                    }
                });
                array_push($result, $current);
            });

        return $result;
    }
}
