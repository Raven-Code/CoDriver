import Navbar from "@/app/partials/nav/navbar";
import Footer from "@/app/partials/footer/footer";
import React from "react";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <Navbar type='customer'/>
            {children}
            <Footer/>
        </>
    )
}