<?php

namespace App\Http\Controllers\Bots;

use App\Helpers\PjnBotHelper;
use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\DomCrawler\Crawler;

class PjnBotController extends Controller
{
    public function getNotifications(Request $request)
    {
        $fromFecha = PjnBotHelper::getFechaFromRequest($request);
        [$client, $response, $cookieJar] = PjnBotHelper::pjnLogin();
        [$response] = PjnBotHelper::listarPorFecha($client, $cookieJar);

        $crawler = new Crawler($response->getBody()->getContents());

        $table = $crawler->filter("form > table");

        $thIndex = PjnBotHelper::getColumnUltActIndex($table);
        $thIndex++;

        $table = $crawler->filter("form > table");
        $result = [];
        $crawler->filter("form > table tbody tr")->each(function (Crawler $tr, $trIndex) use ($thIndex, $fromFecha, &$result) {
            $td = $tr->filter("td:nth-child($thIndex)");
            $fechaString = DateTime::createFromFormat('d/m/Y', $td->text())->format("Ymd");

            if ($fechaString >= $fromFecha) {
                $thLabels = ["expediente", "dependencia", "caratula", "situacion", "ultimaActualizacion"];
                $current = ["faces_position" => $trIndex];
                $tr->filter("td")->each(function ($td, $i) use (&$current, &$thLabels) {
                    if ($i < 5)
                        $current[$thLabels[$i]] = $td->text();
                });
                array_push($result, $current);
            }
        });
        return $result;
    }

    public function getExpediente(Request $request)
    {
        $fromFecha = PjnBotHelper::getFechaFromRequest($request);
        $position = PjnBotHelper::getPositionFromRequest($request);
        $client = PjnBotHelper::regenerateClientFromSession();
        $facesState = Session::get("faces.viewstate");

        $positionKey = "tablaConsultaLista:tablaConsultaForm:j_idt179:dataTable:{$position}:j_idt230";
        $response = $client->post(config("bot.pjn.listar"), [
            'form_params' => [
                'javax.faces.ViewState' => $facesState,
                'tablaConsultaLista:tablaConsultaForm' => 'tablaConsultaLista:tablaConsultaForm',
                $positionKey => $positionKey
            ]
        ]);

        $crawler = new Crawler($response->getBody()->getContents());
        $title = strtolower($crawler->filter("head title")->text());

        $relogged = false;
        if (str_contains(strtolower($title), "inicie sesi")) {
            //Relogin!
            [$client, $response, $cookieJar] = PjnBotHelper::pjnLogin();
            [$response, $facesState] = PjnBotHelper::listarPorFecha($client, $cookieJar);
            $response = $client->post(config("bot.pjn.listar"), [
                'form_params' => [
                    'javax.faces.ViewState' => $facesState,
                    'tablaConsultaLista:tablaConsultaForm' => 'tablaConsultaLista:tablaConsultaForm',
                    $positionKey => $positionKey
                ]
            ]);
            $crawler = new Crawler($response->getBody()->getContents());
            $relogged = true;
        }

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

        if ($relogged)
            return response()->json($result)->header('X-Jurix-Bot-Relogin', 'true');
        return response()->json($result);
    }
}
