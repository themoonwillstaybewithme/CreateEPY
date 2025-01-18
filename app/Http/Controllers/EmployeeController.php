<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $query = $request->input('search', '');  //หาข้อตวามได้ทั้งชื่อและนามสกุล

        $employees = DB::table('employees')
        ->where('first_name', 'like', '%'.$query.'%')
        ->orWhere('last_name', 'like', '%'.$query.'%')
        ->orderBy('emp_no', 'desc')
        ->paginate(20);

        //Log::info($employees);

        return Inertia::render('Employee/Index',[
            'employees' => $employees,
            'query' => $query,

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //select departments จากตาราง departments
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get();

        //Inertia จะส่งข้อมูล derpartments ไปที่หน้า Create ในรูปแบบของ JSON
        return Inertia::render('Employee/Create',[
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // show all input data
        Log::info($request->all());

        try{
        //ตรวจสอบข้อมูลที่รับมาจากฟอร์ม
        $validated = $request->validate([
            'birth_date' => 'required|date',
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required|in:M,F', // เพิ่มการตรวจสอบ gender
            'hire_date' => 'nullable|date', // เพิ่มการตรวจสอบ hire_date
            'dept_no' => 'required', // เพิ่มการตรวจสอบ dept_no
            'img' => 'required',
        ]);

        DB::transaction(function() use ($validated){
            //หาค่า emp_no ล่าสุด
            $latestEmpNo = DB::table('employees')->max('emp_no')?? 0;//ถ้าไม่มีข้อมูลให้เป็น 0
            $newEmpNo = $latestEmpNo + 1; //ค่าล่าสุด + 1

            Log::info($newEmpNo);

            //บันทึกข้อมูลลงในตาราง employees
            DB::table('employees')->insert([
                'emp_no' => $newEmpNo,
                'birth_date' => $validated['birth_date'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'gender' => $validated['gender'],
                'hire_date' => $validated['hire_date'] ?? now(),
                'img' => $validated['img'],
            ]);

            //บันทึกข้อมูลลงในตาราง dept_emp
            DB::table('dept_emp')->insert([
                'emp_no' => $newEmpNo,
                'dept_no' => $validated['dept_no'],
                'from_date' => now(),
                'to_date' => '9999-01-01',
            ]);

        });

        return redirect()->route('employee.index')->with('success', 'Employee created successfully.');
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());
            //จะreturn กลับไปที่หน้าเดิมพร้อมกับข้อความ error
            return back()->with('error', 'An error occurred while creating employee. Please try again.');
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
