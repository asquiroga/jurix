<?php

namespace App\Http\Controllers;

use App\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Inertia\Inertia;
use Symfony\Component\DomCrawler\Crawler;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', ["precio_ius" => 38381]);
    }

    public function getScbaNotifications(Request $request)
    {
        $fecha = "";
        if ($request->has('fecha') && Helpers::esFechaValida($request->query('fecha'))) {
            $fecha = $request->query('fecha');
        } else {
            $fecha = date('d/m/Y');
        }

        $response = Helpers::scbaLogin();

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
                'Hasta' => $fecha,
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

    public function getNotificationBody(Request $request)
    {
        // https://notificaciones.scba.gov.ar/InterfazBootstrap/textonotificacion.aspx?idnot=115331705&fecha=2

        $response = Helpers::scbaLogin();
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

            $result = [];
            $crawler->filter("#bTexto p")->each(function ($paragraph) use (&$result) {
                $text = "";
                foreach ($paragraph->getNode(0)->childNodes as $child) {
                    if ($child->nodeType === XML_TEXT_NODE) {
                        $text .= trim($child->textContent);
                    }
                }

                $text = trim($text);

                if (is_string($text) && strlen($text) > 1)
                    array_push($result, $text);
            });

            return $result;
        }
    }
}
