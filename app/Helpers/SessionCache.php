<?php

namespace App\Helpers;

use App\Models\GlobalKey;
use Illuminate\Support\Facades\Session;

class SessionCache
{

    public static function getPrecioIus()
    {
        if (Session::has("precio-ius"))
            return Session::get("precio-ius");

        $precioIus = GlobalKey::where('key', 'precio-ius')->first()->value;
        Session::put("precio-ius", $precioIus);
        return $precioIus;
    }
}
