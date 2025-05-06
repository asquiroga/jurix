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
        if ($request->has('fecha')) {
            $fecha = $request->query('fecha');
        } else {
            $fecha = date('d/m/Y');
        }

        $loginPayload = [
            'domicilioElectronico' => env("SCBA_USER"),
            'pass' => env("SCBA_PASS"),
            'url' => '?url=/InterfazBootstrap/novedades.aspx',
        ];

        // Ajax a /VerificarPass
        $response = Http::withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])
            ->post('https://notificaciones.scba.gov.ar/InterfazBootstrap/Login.aspx/VerificarPass', $loginPayload);


        // Verificás si fue exitoso
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
                ->post('https://notificaciones.scba.gov.ar/InterfazBootstrap/notificaciones.aspx/listarNotificaciones', $searchPayload);

            $crazyResponse = json_decode($response->json()["d"]);
            $notif = $crazyResponse->notificaciones;
            $crawler = new Crawler($notif);

            $notificaciones = [];

            $crawler->filter('div.col-md-12 > table')->each(function ($node)  use (&$notificaciones) {
                $currentNotif = [];
                $node->filter("td")->filterXPath('//td[label]')->each(function ($td) use (&$currentNotif) {
                    $key = Helpers::quitarAcentos($td->filter("label")->text());
                    $currentNotif[$key] = $td->text();
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
}
