<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;




//function สำหรับบันทึกข้อมูลพนักงาน
Route::post('/employee', [EmployeeController::class, 'store'])->name('employee.store');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
    //หน้าแบบฟอร์มสำหรับเพิ่มข้อมูลพนักงาน
    Route::get('/employee/create', [EmployeeController::class, 'create'])->name('employee.create');
});

require __DIR__.'/auth.php';
