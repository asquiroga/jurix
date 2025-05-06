<?php
// app/Helpers/TextHelper.php
namespace App;

use DateTime;

class Helpers
{
    public static function quitarAcentos(string $cadena): string
    {
        return Helpers::solo_letras(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $cadena));
    }

    public static function solo_letras(string $cadena): string
    {
        // Esto elimina todo lo que no sea letra
        return preg_replace('/[^a-zA-Z]/', '', $cadena);
    }

    public static function esFechaValida($fecha)
    {
        $d = DateTime::createFromFormat('d/m/Y', $fecha);
        return $d && $d->format('d/m/Y') === $fecha;
    }
}
