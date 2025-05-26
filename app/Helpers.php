<?php
// app/Helpers/TextHelper.php
namespace App;

class Helpers
{
    public static function quitarAcentos(string $cadena): string
    {
        $sin = transliterator_transliterate('Any-Latin; Latin-ASCII', $cadena);
        return Helpers::solo_letras($sin);
    }

    public static function solo_letras(string $cadena): string
    {
        // Esto elimina todo lo que no sea letra
        return preg_replace('/[^a-zA-Z]/', '', $cadena);
    }

    public static function esFechaValida($fecha)
    {
        // Validamos que el patrón sea d/m/Y con o sin ceros
        if (!preg_match('/^\d{1,2}\/\d{1,2}\/\d{4}$/', $fecha)) {
            return false;
        }

        // Separar y validar con checkdate
        [$dia, $mes, $anio] = explode('/', $fecha);
        return checkdate((int)$mes, (int)$dia, (int)$anio);
    }
}
