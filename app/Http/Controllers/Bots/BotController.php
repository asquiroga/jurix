<?php

namespace App\Http\Controllers\Bots;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Crypt;

class BotController extends Controller
{
    public function test()
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

        dd($response->getHeader('X-Guzzle-Redirect-History'));
    }

    public function testCrypt()
    {
        $wtf = "eyJpdiI6ImRobEJxd1NaazI4RUppQ01sWUVDMGc9PSIsInZhbHVlIjoiN0dCTi9NMGdaOUJGUCt2MzU1R3FTUT09IiwibWFjIjoiYjY5ZWY5MWZhYzI5ZDkwZjk1M2JlOGRhNzliNGFjNTNjYzM5NDI0OTZmMThhMjc5ZTQxMjcwM2FiMTdhNTg2NCIsInRhZyI6IiJ9";
        echo Crypt::decryptString($wtf);
    }
}
