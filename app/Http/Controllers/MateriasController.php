<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Materia::query();

        if ($request->filled('fuero')) {
            $query->where('fuero_id', '=', $request->fuero);
        } else {
            $query->where('fuero_id', '=', 1);
        }

        return Inertia::render('materias/list', ["materias" => $query->get()]);
    }

    public function new()
    {
        return Inertia::render('materias/nueva');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'fuero' => 'required',
        ]);

        Materia::create([
            "nombre" => $request->nombre,
            "codigo" => "-1",
            "fuero_id" => $request->fuero
        ]);

        return redirect()->back()->with('success', 'Usuario creado');
    }

    /**
     * Display the specified resource.
     */
    public function show(Materia $materia)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Materia $materia)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materia $materia)
    {
        //
    }
}
