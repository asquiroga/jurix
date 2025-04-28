<?php

use App\Http\Controllers\WebArtisanController;
use App\Models\Juzgado;
use App\Models\Materia;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

Route::middleware('local')->group(function () {
    Route::get('/web-artisan', [WebArtisanController::class, 'index']);
    Route::post('/web-artisan/run', [WebArtisanController::class, 'run'])->name('web-artisan.run');
});

Route::get('/auth/redirect/google', function () {
    return Socialite::driver('google')->redirect();
});

Route::get('/auth/callback/google', function () {
    $googleUser = Socialite::driver('google')->stateless()->user();

    // Ejemplo: buscar o crear un usuario
    $user = \App\Models\User::firstOrCreate(
        ['email' => $googleUser->getEmail()],
        [
            'name' => $googleUser->getName(),
            'google_id' => $googleUser->getId(),
            // Podés guardar el avatar, etc.
        ]
    );

    Auth::login($user);

    return redirect('/dashboard');
});


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('juzgados', function () {
        return Inertia::render('juzgados', ["juzgados" => Juzgado::all()]);
    })->name('juzgados');

    Route::get('materias', function () {
        return Inertia::render('materias', ["materias" => Materia::all()]);
    })->name('materias');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
