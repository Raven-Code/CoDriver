import Image from 'next/image';
import Navbar from "@/app/partials/nav/navbar";
import React from "react";
import Footer from "@/app/partials/footer/footer";

/**
 * Renders the home page of the CoDriver application.
 *
 * @returns {JSX.Element} The rendered HTML code for the home page.
 */
export default function Home() {
    return (
        <>
            <Navbar type='public'/>
            <div className='hero min-h-screen bg-neutral'>
                <div className='hero-content flex-col lg:flex-row'>
                    <Image
                        src='/img/bugatti.jpeg'
                        alt='Image'
                        width={299}
                        height={168}
                        className='max-w-sm rounded-lg shadow-2xl'
                    />
                    <div>
                        <h1 className='text-5xl font-bold'>Welcome to CoDriver!</h1>
                        <p className='py-6'>Your trusted partner for safe and efficient driving.</p>
                        <a className='btn btn-primary' href='/accounts/login'>
                            Login
                        </a>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
