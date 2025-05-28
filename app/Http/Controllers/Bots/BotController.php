<?php

namespace App\Http\Controllers\Bots;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;

class BotController extends Controller
{
    public function test()
    {
        $wtf = "eyJpdiI6ImRobEJxd1NaazI4RUppQ01sWUVDMGc9PSIsInZhbHVlIjoiN0dCTi9NMGdaOUJGUCt2MzU1R3FTUT09IiwibWFjIjoiYjY5ZWY5MWZhYzI5ZDkwZjk1M2JlOGRhNzliNGFjNTNjYzM5NDI0OTZmMThhMjc5ZTQxMjcwM2FiMTdhNTg2NCIsInRhZyI6IiJ9";
        echo Crypt::decryptString($wtf);
    }
}
