<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentsController extends Controller
{
    public function index()
    {
        return Inertia::render('documents', []);
    }

    public function testOld()
    {
        $inputPath = storage_path('app/poder.docx');
        $outputPath = storage_path('app/procesado.docx');

        $this->replaceTextInDocx($inputPath, [
            '{{dias}}' => '5',
            '{{mes}}' => 'Febrero',
            '{{nombreCompleto}}' => 'Juan Perez',
            '{{nacimiento}}' => '1 de Junio del 1992',
            '{{dni}}' => '32676239',
            '{{domicilioReal}}' => 'Calle 46 num 781',
            '{{localidad}}' => 'Olavarria',
            '{{provincia}}' => 'Buenos Aires'
        ], $outputPath);

        echo "OK procesado";
    }

    public function downloadDocument(Request $request)
    {
        $validated = $request->validate([
            'template' => 'required',
        ]);


        $path = storage_path('app/' . $request->template);

        $contenido = $this->generateModifiedDocxContent($path, [
            '{{dias}}' => $request->dias,
            '{{mes}}' => $request->mes,
            '{{nombreCompleto}}' => $request->nombreCompleto,
            '{{nacimiento}}' => $request->nacimiento,
            '{{dni}}' => $request->dni,
            '{{domicilioReal}}' => $request->domicilioReal,
            '{{localidad}}' => $request->localidad,
            '{{provincia}}' => $request->provincia
        ]);

        return response($contenido)
            ->header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            ->header('Content-Disposition', 'attachment; filename="poder.docx"');
    }

    function generateModifiedDocxContent($filePath, $replacements): string
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'docx_') . '.docx';
        copy($filePath, $tempPath);

        $zip = new \ZipArchive();
        if ($zip->open($tempPath) === true) {
            $content = $zip->getFromName('word/document.xml');

            foreach ($replacements as $search => $replace) {
                $content = str_replace($search, $replace, $content);
            }

            $zip->addFromString('word/document.xml', $content);
            $zip->close();

            $binaryContent = file_get_contents($tempPath);
            unlink($tempPath); // eliminamos archivo temporal

            return $binaryContent;
        } else {
            throw new \Exception("No se pudo abrir el archivo DOCX.");
        }
    }

    function replaceTextInDocx($filePath, $replacements, $outputPath)
    {
        // Creamos una copia temporal
        $tempPath = storage_path('app/temp_' . uniqid() . '.docx');
        copy($filePath, $tempPath);

        $zip = new \ZipArchive();
        if ($zip->open($tempPath) === true) {
            $content = $zip->getFromName('word/document.xml');

            foreach ($replacements as $search => $replace) {
                $content = str_replace($search, $replace, $content);
            }

            $zip->addFromString('word/document.xml', $content);
            $zip->close();

            rename($tempPath, $outputPath); // renombramos como definitivo
        } else {
            throw new \Exception("No se pudo abrir el archivo DOCX.");
        }
    }
}
