<?php

namespace App\Http\Controllers\Bots;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\Request;

class MevBotController extends Controller
{
    public function test(Request $request)
    {
        $cookieJar = new CookieJar();

        $client = new Client([
            'cookies' => $cookieJar,
            'allow_redirects' => true,
        ]);

        $response = $client->post(config('bot.mev.loginPostUrl'), [
            'form_params' => [
                'usuario' => 'lucasacarr',
                'clave' => env("some.key"),
                'DeptoRegistrado' => 'aa'
            ],
        ]);

        echo $response->getBody()->getContents();
    }
}
