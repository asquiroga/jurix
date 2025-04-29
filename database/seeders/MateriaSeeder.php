<?php

namespace Database\Seeders;

use App\Models\Materia;
use Exception;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MateriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->load_csv("materias-civil-comercial", 1);
        $this->load_csv("contencioso-admin", 2);
        $this->load_csv("familia", 3);
        $this->load_csv("laboral", 4);
    }

    private function load_csv($filename, $fuero)
    {
        $path = database_path('seeders/data/' . $filename . '.csv'); // Ruta de tu CSV
        $file = fopen($path, 'r');

        if (!$file) {
            throw new Exception("No se pudo abrir el archivo: $path");
        }

        $header = fgetcsv($file); // Leer la primera línea (nombre de columnas)

        while (($row = fgetcsv($file)) !== false) {
            $data = array_combine($header, $row); // Combina 'nombre' => valor, 'codigo' => valor

            Materia::create([
                "nombre" => trim($data["Nombre"]),
                "codigo" => trim($data["Codigo"]),
                "fuero_id" => $fuero
            ]);
        }

        fclose($file);
    }
}
