<?php

use App\Http\Controllers\Bots\BotController;
use App\Http\Controllers\Bots\MevBotController;
use App\Http\Controllers\Bots\PjnBotController;
use App\Http\Controllers\Bots\ScbaBotController;
use App\Http\Controllers\CausasController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\System\LogController;
use App\Http\Controllers\MateriasController;
use App\Http\Controllers\UtilsController;
use App\Http\Controllers\System\WebArtisanController;
use App\Models\Juzgado;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('auth-bot', [DashboardController::class, 'getScbaNotifications']);
    Route::post('pdf', [UtilsController::class, 'generatePdf']);

    //Log
    Route::get('/system/tail-log', [LogController::class, 'showLastLines']);

    // Bots
    Route::get('/bot/scba/notifications', [ScbaBotController::class, 'getNotifications']);
    Route::get('/bot/scba/get-notification', [ScbaBotController::class, 'getNotificationBody']);

    Route::get('/bot/pjn/notifications', [PjnBotController::class, 'getNotifications']);
    Route::get('/bot/pjn/expediente', [PjnBotController::class, 'getExpediente']);

    Route::get('/bot/mev/notifications', [MevBotController::class, 'notifications']);

    Route::get('/bot/test', [BotController::class, 'test']);
    // Bots end //


    Route::get('juzgados', function () {
        return Inertia::render('juzgados', ["juzgados" => Juzgado::all()]);
    })->name('juzgados');

    Route::get('materias', [MateriasController::class, 'index'])->name("materias");
    Route::get('materias/nueva', [MateriasController::class, 'new']);
    Route::post('materias/store', [MateriasController::class, 'store']);

    Route::get('/calculadoras', [DashboardController::class, 'calculators']);

    Route::get('/documents', [DocumentsController::class, 'index']);
    Route::get('/documents/instantiate', [DocumentsController::class, 'downloadDocument']);


    Route::get('/causas', [CausasController::class, 'index']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
