<?php

namespace App\Jobs;

use App\Models\GlobalKey;
use DOMDocument;
use DOMXPath;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class IusPriceExtractor implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Iniciado Ius extractor!');

        // Iniciar cURL
        $ch = curl_init(config("bot.ius.url"));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Ejecutar la solicitud
        $html = curl_exec($ch);
        curl_close($ch);

        // Cargar el HTML en DOMDocument
        $doc = new DOMDocument();
        libxml_use_internal_errors(true); // Evita errores por HTML malformado
        $doc->loadHTML($html);
        libxml_clear_errors();

        $xpath = new DOMXPath($doc);
        $nodes = $xpath->query(config('bot.ius.xpath'));
        // Obtener el contenido de la etiqueta <title>

        // Mostrar el resultado
        if ($nodes->length > 0) {
            $value = $nodes->item(0)->textContent;
            $ius = preg_replace('/\D+/', '', $value);

            if (is_numeric($ius)) {
                GlobalKey::updateOrCreate(
                    ['key' => 'precio-ius'],
                    [
                        'value' => $ius,
                    ]
                );
                Log::info("Ius actualizado al valor: " . $ius);
            } else {
                Log::error("Hubo un problema en el parseo, IusExtractor");
            }
        }
    }
}
