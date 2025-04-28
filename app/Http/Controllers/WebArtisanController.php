<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class WebArtisanController extends Controller
{
    protected $allowedCommands = [
        'migrate:fresh' => 'Reset DB (migrate:fresh)',
        'migrate:fresh --seed' => 'Reset DB + Seed',
        'migrate' => 'Run Migrations',
        'db:seed' => 'Run Seeders',
        'cache:clear' => 'Clear Cache',
        'route:clear' => 'Clear Routes',
        'config:clear' => 'Clear Config',
        'view:clear' => 'Clear Views',
        'optimize:clear' => 'Clear Optimize'
    ];

    public function index()
    {
        return Inertia::render('WebArtisan', [
            'commands' => $this->allowedCommands,
        ]);
    }

    public function run(Request $request)
    {
        $command = $request->input('command');

        if (!array_key_exists($command, $this->allowedCommands)) {
            abort(403, 'Comando no permitido');
        }

        Artisan::call($command);

        return redirect()->back()->with('output', Artisan::output());
    }
}