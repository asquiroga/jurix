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
        return Inertia::render('calculator', ["precio_ius" => 38381]);
    }

    public function generatePdf(Request $request)
    {
        $r = $request->json()->all();
        $data = [
            'titulo' => 'JURIX - ' . $r["title"],
            'body' => $r["body"],
            'head' => $request->has("head") ? $r["head"] : ""
        ];
        $pdf = Pdf::loadView('pdf.template', $data);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="jurix.pdf"');
    }
}
