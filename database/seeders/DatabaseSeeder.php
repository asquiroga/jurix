<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(FueroSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(MateriaSeeder::class);
        $this->call(JuzgadoSeeder::class);
        $this->call(GlobalKeySeeder::class);
    }
}
