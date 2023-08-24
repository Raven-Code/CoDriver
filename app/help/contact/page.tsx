import ContactForm from './form';
export const metadata = {
	title: 'Contact | CoDriver',
};
/**
 * Renders the main content of the contact page.
 *
 * @returns {JSX.Element} The main content of the contact page.
 */
export default function ContactPage(): JSX.Element {
	return (
		<main className='mt-16 mx-auto max-w-4xl'>
			<ContactForm />
		</main>
	);
}
