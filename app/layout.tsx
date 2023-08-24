import { Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import React from 'react';
import './global.css';
import Footer from './partials/footer/footer';
import Navbar from './partials/nav/navbar';
const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
});

export const metadata = {
	title: 'Home | CoDriver',
};

/**
 * RootLayout is a React component that serves as a layout for the entire application.
 * It provides a consistent structure for all pages, including a navigation bar and a footer.
 *
 * @param props - The props object.
 * @param props.children - The content of the page.
 * @returns - The layout of the application.
 */
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
	type: string;
	host: string;
}): JSX.Element {
	const headersList = headers();
	const pathname = headersList.get('x-invoke-path') || '/';
	// Change html data-theme to see light/dark mode (light: valentine, dark: night)
	return (
		<html lang='en' data-theme='night'>
			<head>
				<meta content='width=device-width, initial-scale=1' name='viewport' />
				<meta name='description' content='' />
			</head>
			<body className={poppins.className}>
				<Navbar
					type={
						pathname.startsWith('/customer') || pathname.startsWith('/driver')
							? 'customer'
							: pathname.startsWith('/staff')
							? 'staff'
							: 'public'
					}
				/>
				{children}
				{pathname.startsWith('/staff') ? '' : <Footer />}
			</body>
		</html>
	);
}
