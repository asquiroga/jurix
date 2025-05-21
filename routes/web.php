<?php

use App\Http\Controllers\BotController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MateriasController;
use App\Http\Controllers\WebArtisanController;
use App\Jobs\IusPriceExtractor;
use App\Models\Juzgado;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

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


Route::get('/probar-bot', function () {
    IusPriceExtractor::dispatch();
    return 'Job lanzado';
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('auth-bot', [DashboardController::class, 'getScbaNotifications']);
    Route::post('pdf', [DashboardController::class, 'generatePdf']);

    // Bots
    Route::get('/bot/scba-notifications', [BotController::class, 'getScbaNotifications']);
    Route::get('/bot/scba-get-notification', [BotController::class, 'getScbaNotificationBody']);
    Route::get('/bot/pjn-notifications', [BotController::class, 'pjn']);
    Route::get('/bot/pjn-expediente', [BotController::class, 'pjnExpediente']);

    Route::get('/bot/test', [BotController::class, 'test']);

    Route::get('juzgados', function () {
        return Inertia::render('juzgados', ["juzgados" => Juzgado::all()]);
    })->name('juzgados');

    Route::get('materias', [MateriasController::class, 'index'])->name("materias");
    Route::get('materias/nueva', [MateriasController::class, 'new']);
    Route::post('materias/store', [MateriasController::class, 'store']);

    Route::get('calculadora', [DashboardController::class, 'calculator']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
