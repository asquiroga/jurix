<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class UtilsController extends Controller
{
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
