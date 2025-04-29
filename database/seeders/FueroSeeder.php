<?php

namespace Database\Seeders;

use App\Models\Fuero;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FueroSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fuero::insert([
            ['id' => 1, 'nombre' => 'Civil y Comercial'],
            ['id' => 2, 'nombre' => 'Contencioso Administrativo'],
            ['id' => 3, 'nombre' => 'Familia'],
            ['id' => 4, 'nombre' => 'Laboral'],
            ['id' => 5, 'nombre' => 'Justicia de Paz'],
        ]);
    }
}
