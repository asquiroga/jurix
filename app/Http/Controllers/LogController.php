<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function showLastLines()
    {
        $logPath = storage_path('logs/laravel.log');

        if (!File::exists($logPath)) {
            return response()->json(['error' => 'Log file not found'], 404);
        }

        $lines = $this->tailCustom($logPath, 50);

        return response($lines, 200)->header('Content-Type', 'text/plain');
    }

    protected function tailCustom($file, $lines = 50)
    {
        $buffer = '';
        $f = fopen($file, 'r');
        fseek($f, -1, SEEK_END);
        $pos = ftell($f);
        $count = 0;

        while ($pos > 0 && $count < $lines) {
            $char = fgetc($f);
            if ($char === "\n") {
                $count++;
                if ($count >= $lines) break;
            }
            $buffer = $char . $buffer;
            fseek($f, --$pos);
        }

        fclose($f);
        return $buffer;
    }
}
