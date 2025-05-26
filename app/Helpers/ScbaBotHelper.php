<?php

namespace App\Helpers;

use App\Helpers;
use DateTime;
use Illuminate\Http\Request;
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
        return $fecha->format("d/m/Y");
    }

    public static function notificationsPayload($fecha)
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
