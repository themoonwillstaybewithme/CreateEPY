import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';
import { usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faPersonDress } from '@fortawesome/free-solid-svg-icons';

// query ค่าที่ส่งมาจาก Controller
// employees ค่าที่ส่งมาจาก Controller

export default function Index({ employees, query }) {


    // สร้าง state สำหรับการค้นหา
    const [search, setSearch] = useState(query || '');
    // ฟังก์ชันสำหรับการค้นหา
    const handleSearch = (e) => {
        e.preventDefault();
        // ส่งคำค้นหาไปยังเส้นทาง /employee
        router.get('/employee', { search });
    };
    //สร้าง state สำหรับการจัดเรียงข้อมูล
    const [sortConfig, setSortConfig] = useState({ key: 'emp_no', direction: 'ascending' });
    // ฟังก์ชันสำหรับการจัดเรียงข้อมูล
    const sortedEmployees = [...employees.data].sort((a, b) => {
        console.log("🚀 ~ sortedEmployees ~ employees:", employees)
        
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1; //ให้ a อยู่ก่อน b
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1; //ให้ b อยู่ก่อน a
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1; //b อยู่หลัง a
        }
        return 0;
    });

    // ฟังก์ชันสำหรับการขอจัดเรียงข้อมูล
    const requestSort = (key) => {
        let direction = 'ascending';
        // ถ้า key ที่ส่งมาเหมือนกับ key ที่กำหนดและ direction เป็น ascending ให้เปลี่ยนเป็น descending
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        //กำกหนดค่าใหม่เป็น direction
        setSortConfig({ key, direction });
    };



    // ฟังก์ชันสำหรับการสร้างปุ่มการแบ่งหน้า
    const renderPagination = () => {
        const currentPage = employees.current_page;
        const lastPage = employees.last_page;
        const paginationLinks = [];
        // ถ้าหน้าปัจจุบันมากกว่า 1 ให้แสดงปุ่ม Back
        if (currentPage > 1) {
            paginationLinks.push(
                <button
                    key="prev"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-black ring-1 ring-inset ring-gray-300 hover:ring-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => window.location.assign(employees.prev_page_url)}>
                    Back
                </button>
            );
        }

        // ถ้ามากกว่า3หน้าจะแสดงปุ่มหน้าที่1ขึ้นมาด้วย
        if (currentPage > 3) {
            paginationLinks.push(
                <button key="1"
                    className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    onClick={() => window.location.assign(employees.links[1].url)}>
                    1
                </button>
            );
            paginationLinks.push(
                <span key="ellipsis1"
                    className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'>...</span>);
        }


        // เริ่มลูปตั้งแต่หน้าที่ 1 หรือหน้าปัจจุบันลบ 1 (แล้วแต่ค่าไหนมากกว่า) จนถึงหน้าสุดท้ายหรือหน้าปัจจุบันบวก 1(แล้วแต่ค่าน้อยกว่า)
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(lastPage, currentPage + 1); i++) {
            // เพิ่มปุ่มสำหรับแต่ละหน้าลงในอาร์เรย์ paginationLinks
            paginationLinks.push(
                // สร้างปุ่มสำหรับแต่ละหน้า
                <button
                    key={i} // กำหนด key สำหรับแต่ละปุ่มเพื่อให้ React สามารถติดตามแต่ละปุ่มได้
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-white focus:outline-offset-0 ${i === currentPage ? 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-500 hover:bg-white focus:outline-offset-0' : ''}`} // กำหนดคลาส CSS สำหรับปุ่ม ถ้าเป็นหน้าปัจจุบันให้เพิ่มคลาส 'active'
                    onClick={() => window.location.assign(`http://127.0.0.1:8000/employee?page=${i}`)} // เมื่อคลิกปุ่ม ให้เปลี่ยนหน้าไปยัง URL ของหน้านั้น
                >
                    {i}
                </button>
            );
        }

        // ถ้าหน้าปัจจุบันน้อยกว่าหน้าสุดท้ายให้แสดง ... และหน้าสุดท้าย
        if (currentPage < lastPage - 1) {
            paginationLinks.push(<span key="ellipsis2"
                className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0'>...</span>);
            paginationLinks.push(
                <button key={lastPage} 
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-white focus:outline-offset-0" 
                    onClick={() => window.location.assign(employees.last_page_url)}>
                    {lastPage}
                </button>
            );
        }

        // ถ้าหน้าปัจจุบันน้อยกว่าหน้าสุดท้าย ให้แสดงปุ่ม Next
        if (currentPage < lastPage) {
            paginationLinks.push(
                <button
                    key="prev"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-black ring-1 ring-inset ring-gray-300 hover:ring-gray-500 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => window.location.assign(employees.prev_page_url)}>
                    Next
                </button>
                
            );
        }

        return paginationLinks;
    };

    const { flash } = usePage().props;

    return (
        <div>

            <AuthenticatedLayout

                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Employee
                    </h2>
                }>
                <Head title="Employee" />
                <FlashMessage flash={flash}/>
                <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* ฟอร์มสำหรับการค้นหา */}
                    <div className="flex justify-center mb-6">
                        <form onSubmit={handleSearch} className="flex w-full max-w-2xl">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded-lg bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 mr-6"
                            />
                            <button type="submit" className="cursor-pointer block rounded-xl bg-grey-300-600 px-3.5 py-2.5 text-center text-sm font-semibold text-blue-700 shadow-sm hover:text-white hover:bg-blue-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 border border-blue-600">
                              <label className='cursor-pointer'>Search</label> 
                            </button>
                        </form>
                    </div>

                    {/* ตารางแสดงข้อมูลพนักงาน */}
                    {sortedEmployees.length > 0 ? (
                        <div className='shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10'>
                        <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-200">
                            <tr>
                                
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-base font-bold text-black uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort('emp_no')}
                                >
                                    <div> 
                                        ID  {sortConfig.direction === 'ascending' && '↑'}
                                            {sortConfig.direction === 'descending' && '↓'}
                                    </div>  
                                    
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-basefont-medium text-black uppercase tracking-wider"
                                >
                                    FirstName
                                </th>
                                <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-basefont-medium text-black uppercase tracking-wider"
                                    >
                                        LastName
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-basefont-medium text-black uppercase tracking-wider"
                                    >
                                        Birth
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-basefont-medium text-black uppercase tracking-wider"
                                    >
                                        Gender
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-basefont-medium text-black uppercase tracking-wider"
                                    >
                                        Image
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedEmployees.map((employee) => (
                                    <tr className='hover:bg-gray-200' key={employee.emp_no}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.emp_no}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.first_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.last_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.birth_date}</td>
                                    <td className="pe-6 ps-12 py-4 whitespace-nowrap text-sm text-gray-500">
                                       {employee.gender == 'M' && <FontAwesomeIcon icon={faPerson} size="2x" className="text-sky-400" />}
                                       {employee.gender == 'F' && <FontAwesomeIcon icon={faPersonDress} size="2x" className="text-pink-400" />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.img && <img src={employee.img} className="w-10 h-10 rounded-full" />}
                                        </td>
                                    </tr>
                                ))}         
                            </tbody>
                        </table>
                        </div>
                    ) : (
                        <div>
                            <p className='text-lg font-bold flex justify-center mt-16'>Not Found.</p>
                            <div className="flex justify-center mt-10">
                                <button onClick={() => window.history.back()} className='inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-base font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10'>Back</button>
                            </div>
                        </div>
                    )}

                    {/* การแบ่งหน้า */}
                    {sortedEmployees.length > 0 && (
                        <div className="flex justify-center mt-10">
                            {renderPagination()}
                        </div>
                    )}
                </div >
            </AuthenticatedLayout>
        </div>

    );
};
