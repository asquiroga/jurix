<?php

namespace App\Console\Commands;

use App\Models\GlobalKey;
use GuzzleHttp\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class IusPriceBot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:ius-price-bot';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza el valor de IUS';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Iniciado Ius extractor');
        $this->info("Iniciando...");

        $client = new Client();
        $response = $client->get(config("bot.ius.url"));

        $crawler = new Crawler($response->getBody()->getContents());
        $price = $crawler->filter("table tr:nth-child(3) td b")->text();
        $ius = preg_replace('/\D+/', '', $price);
        $this->info("Precio encontrado: " . $price . " Parseado a: " . $ius);

        if (is_numeric($ius)) {
            GlobalKey::updateOrCreate(
                ['key' => 'precio-ius'],
                [
                    'value' => $ius,
                ]
            );
            Log::info("Ius actualizado al valor: " . $ius);
        } else {
            Log::error("Hubo un problema en el parseo, IusPriceBot: " . $ius);
        }
    }
}
