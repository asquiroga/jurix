<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', []);
    }

    public function calculator()
    {
        return Inertia::render('calculator', [
            "precio_ius" => 38381,
            "today" => date('d/m/Y')
        ]);
    }
}
