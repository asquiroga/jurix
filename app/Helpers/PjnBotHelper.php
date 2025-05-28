<?php

namespace App\Helpers;

use App\Helpers;
use DateTime;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\DomCrawler\Crawler;

class PjnBotHelper
{

    public static function pjnLogin()
    {
        $cookieJar = new CookieJar();

        $client = new Client([
            'cookies' => $cookieJar,
            'allow_redirects' => [
                'max'             => 10,
                'strict'          => false,
                'referer'         => false,
                'protocols'       => ['http', 'https'],
                'track_redirects' => false
            ],
            'timeout' => 8.0,
        ]);

        $response = self::pjnLoginWithClient($client);

        return [$client, $response, $cookieJar];
    }

    public static function pjnLoginWithClient($client)
    {
        $response = $client->get(config("bot.pjn.loginUrl"));

        $crawler = new Crawler($response->getBody()->getContents());

        $postUrl = $crawler->filter("form#kc-form-login")->attr('action');

        $response = $client->post($postUrl, [
            'form_params' => [
                'username' => env("PJN_USER"),
                'password' => env("PJN_PASS"),
            ],
        ]);

        return $response;
    }

    public static function listarPorFecha($client, $cookieJar)
    {
        $response = $client->get(config("bot.pjn.listar"));
        $response = $client->get(config("bot.pjn.listar"));

        $crawler = new Crawler($response->getBody()->getContents());
        $input = $crawler->filter('input[name="javax.faces.ViewState"]');

        $facesState = $input->attr('value');
        Session::put("faces.viewstate", $facesState);
        Session::put("bot-pjn-cookies", serialize($cookieJar));

        $response = $client->post(config("bot.pjn.listar"), [
            'form_params' => [
                'j_idt150:order_by_form' => 'j_idt150:order_by_form',
                'j_idt150:order_by_form:camara' => 'FECHA',
                'javax.faces.ViewState' => $facesState,
                'j_idt150:order_by_form:j_idt165' => 'j_idt150:order_by_form:j_idt165'
            ]
        ]);

        return [$response, $facesState];
    }

    public static function getColumnUltActIndex($table)
    {
        $thIndex = 0;  // el nth-hijo del TH "Ult. Act."
        $table->filter("thead th")->each(function ($th, $i) use (&$thIndex) {
            if (str_contains($th->html(), "Act.")) {
                $thIndex = $i;
            }
        });

        return $thIndex;
    }

    public static function getFechaFromRequest(Request $request)
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
        return $fecha->format("Ymd");
    }

    public static function getPositionFromRequest(Request $request)
    {
        if (!$request->has('position')) {
            abort(response()->json([
                'message' => 'Falta el parámetro nombre'
            ], 422));
        }

        return $request->query("position");
    }

    public static function pjnCookies()
    {
        return unserialize(Session::get('bot-pjn-cookies'));
    }

    public static function regenerateClientFromSession()
    {
        // Crear el cliente con el jar
        return new Client([
            'cookies' => self::pjnCookies(),
            'allow_redirects' => [
                'max'             => 10,
                'strict'          => false,
                'referer'         => false,
                'protocols'       => ['http', 'https'],
                'track_redirects' => true
            ],
        ]);
    }
}
