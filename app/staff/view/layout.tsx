import {Metadata} from 'next'
import React from "react";

export const metadata: Metadata = {title: 'Staff View | CoDriver'}

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}