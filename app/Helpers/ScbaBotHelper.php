<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;


class ScbaBotHelper
{
    public static function scbaLogin()
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
}
