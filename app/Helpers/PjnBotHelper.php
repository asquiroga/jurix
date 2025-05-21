<?php

namespace App\Helpers;

use App\Helpers;
use DateTime;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Symfony\Component\DomCrawler\Crawler;

class PjnBotHelper
{

    public static function pjnLogin()
    {
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

        $response = $client->get(config("bot.pjn.loginUrl"));

        $crawler = new Crawler($response->getBody()->getContents());

        $postUrl = $crawler->filter("form#kc-form-login")->attr('action');
        $response = $client->post($postUrl, [
            'form_params' => [
                'username' => env("PJN_USER"),
                'password' => env("PJN_PASS"),
            ],
        ]);

        return [$client, $response, $cookieJar];
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
            return DateTime::createFromFormat("d/m/Y", $request->query('fecha'))->format("Ymd");
        }

        return date('Ymd');
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

    public static function regenerateClientFromSession()
    {
        $cookieJar = unserialize(Session::get('bot-pjn-cookies'));

        // Crear el cliente con el jar
        return new Client([
            'cookies' => $cookieJar,
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
