import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({type}: { type: string }) {
    if (type === 'customer') {
        return (
            <div className='navbar bg-base-100'>
                <div className='navbar-start'>
                    <div className='dropdown'>
                        <label tabIndex={0} className='btn btn-ghost lg:hidden'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h8m-8 6h16'
                                />
                            </svg>
                        </label>
                        <ul
                            tabIndex={0}
                            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
                            <li>
                                <a href='/customer/dashboard'>Dashboard</a>
                            </li>
                            <li>
                                <a>Bookings</a>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/customer/book'>Create A Booking</a>
                                    </li>
                                    <li>
                                        <a href='/customer/bookings'>Booking List</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a>Locations</a>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/customer/location/create'>Save Your Location</a>
                                    </li>
                                    <li>
                                        <a href='/customer/location/view'>Location List</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href='/customer/faq'>FAQs</a>
                            </li>
                        </ul>
                    </div>
                    <Link href='/dashboard' color='inherit'>
                        <Image src='/img/logo.png' alt='Logo' width={73} height={73}/>
                    </Link>
                </div>
                <div className='navbar-center hidden lg:flex'>
                    <ul className='menu menu-horizontal px-1 z-[1]'>
                        <li>
                            <a href='/customer/dashboard'>Dashboard</a>
                        </li>
                        <li tabIndex={0}>
                            <details className='w-36'>
                                <summary>Bookings</summary>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/customer/bookings/book'>Create A Booking</a>
                                    </li>
                                    <li>
                                        <a href='/customer/bookings/process'>Process Bookings</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li tabIndex={0}>
                            <details className='w-36'>
                                <summary>Locations</summary>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/customer/location/create' className='w-75'>
                                            Save Your Location
                                        </a>
                                    </li>
                                    <li>
                                        <a href='/customer/location/view'>Location List</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <a href='/customer/faq'>FAQs</a>
                        </li>
                    </ul>
                </div>
                <div className='navbar-end'>
                    <a
                        className='btn bg-secondary px-6 me-4 hover:bg-primary-focus'
                        href='/accounts/login'>
                        Logout
                    </a>
                </div>
            </div>
        );
    } else if (type === 'staff') {
        return (
            <div className='navbar bg-base-100'>
                <div className='navbar-start'>
                    <div className='dropdown'>
                        <label tabIndex={0} className='btn btn-ghost lg:hidden'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h8m-8 6h16'
                                />
                            </svg>
                        </label>
                        <ul
                            tabIndex={0}
                            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
                            <li>
                                <a href='/staff/dashboard'>Dashboard</a>
                            </li>
                            <li>
                                <a>Create Accounts</a>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/accounts/register/driver'>Driver Account</a>
                                    </li>
                                    <li>
                                        <a href='/accounts/register/driver'>Staff Account</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href='/staff/search'>Search Users</a>
                            </li>
                        </ul>
                    </div>
                    <Link href='/' color='inherit'>
                        <Image src='/img/logo.png' alt='Logo' width={73} height={73}/>
                    </Link>
                </div>
                <div className='navbar-center hidden lg:flex'>
                    <ul className='menu menu-horizontal px-1'>
                        <li>
                            <a href='/staff/dashboard'>Dashboard</a>
                        </li>
                        <li tabIndex={0}>
                            <details>
                                <summary>Create Accounts</summary>
                                <ul className='p-2'>
                                    <li>
                                        <a href='/accounts/register/driver'>Driver Account</a>
                                    </li>
                                    <li>
                                        <a href='/accounts/register/driver'>Staff Account</a>
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <a href='/staff/search'>Search Users</a>
                        </li>
                    </ul>
                </div>
                <div className='navbar-end'>
                    <a className='btn bg-secondary px-6 me-4' href='/accounts/login'>
                        Logout
                    </a>
                </div>
            </div>
        );
    }
    return (
        <div className='navbar bg-base-100'>
            <div className='navbar-start'>
                <div className='dropdown'>
                    <label tabIndex={0} className='btn btn-ghost lg:hidden'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M4 6h16M4 12h8m-8 6h16'
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
                        <li>
                            <a href='/'>Home</a>
                        </li>
                        <li>
                            <a>Company</a>
                            <ul className='p-2'>
                                <li>
                                    <a href='/company/about'>About Us</a>
                                </li>
                                <li>
                                    <a href='/company/tos'>Terms Of Service</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href='/company/faq'>FAQs</a>
                        </li>
                    </ul>
                </div>
                <Link href='/' color='inherit'>
                    <Image src='/img/logo.png' alt='Logo' width={73} height={73}/>
                </Link>
            </div>
            <div className='navbar-center hidden lg:flex'>
                <ul className='menu menu-horizontal px-1'>
                    <li>
                        <a href='/'>Home</a>
                    </li>
                    <li tabIndex={0}>
                        <details>
                            <summary>Company</summary>
                            <ul className='p-2'>
                                <li>
                                    <a href='/company/about'>About Us</a>
                                </li>
                                <li>
                                    <a href='/company/tos'>Terms Of Service</a>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a href='/company/faq'>FAQs</a>
                    </li>
                </ul>
            </div>
            <div className='navbar-end'>
                <a
                    className='btn bg-secondary px-6 me-4 hover:bg-secondary-focus text-secondary-content'
                    href='/accounts/login'>
                    Login
                </a>
            </div>
        </div>
    );
}
