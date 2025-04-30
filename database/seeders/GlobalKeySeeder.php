<?php

namespace Database\Seeders;

use App\Models\GlobalKey;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GlobalKeySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GlobalKey::insert([
            "key" => "precio-ius",
            "value" => "0"
        ]);
    }
}
