<?php

namespace Database\Seeders;

use App\Models\Juzgado;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JuzgadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Juzgado::create(["nombre" => "Familia N° 1 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 2 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 3 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 4 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 5 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 6 - LP"]);
        Juzgado::create(["nombre" => "Familia N° 7 - LP"]);
    }
}
