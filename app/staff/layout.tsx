import Navbar from "@/app/partials/nav/navbar";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <Navbar type='staff'/>
            {children}
        </>
    )
}