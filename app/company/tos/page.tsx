export const metadata = {
    title: 'TOS | CoDriver',
};
/**
 * Renders the Terms of Service page for CoDriver's services.
 *
 * @returns {JSX.Element} The rendered Terms of Service page.
 */
export default function TOS() {
    return (
        <div className='container m-auto my-4'>
            <h1 className='text-5xl underline text-center mb-10'>Terms Of Service</h1>
            <div className='divider'/>
            <h3 className='text-4xl'>Introduction</h3>
            <p className='pt-2'>
                These terms and conditions (&#34;Terms&#34;) govern your access to and use of our services
                (&#34;Services&#34;), provided by CoDriver (&#34;Company&#34;). By accessing or using our Services,
                you agree to be bound by these Terms. If you do not agree with any part of these
                Terms, you may not access or use our Services.
            </p>
            <div className='divider'/>
            <h3 className='text-4xl'>Acceptance of Terms</h3>
            <div className='p-6'>
                <h3 className='text-3xl'>1. User Responsibilities</h3>
                <ol className='list-decimal px-5 pt-2'>
                    <li>
                        You are responsible for maintaining the confidentiality of your account
                        credentials and for all activities that occur under your account.
                    </li>
                    <li>
                        You agree not to use the Services for any illegal, unauthorized, or
                        unethical purposes.
                    </li>
                    <li>
                        You shall comply with all applicable laws and regulations while using our
                        Services.
                    </li>
                </ol>
                <div className='divider'/>
                <h3 className='text-3xl'>2. Intellectual Property</h3>
                <ol className='list-decimal px-5 pt-2'>
                    <li>
                        All content, trademarks, logos, and intellectual property rights related to
                        the Services are owned by CoDriver or its licensors.
                    </li>
                    <li>
                        We collect and process personal information as described in our&nbsp;
                        <a className='link link-secondary' href='privacy'>
                            Privacy Policy
                        </a>
                        .
                    </li>
                    <li>
                        You shall comply with all applicable laws and regulations while using our
                        Services.
                    </li>
                </ol>
                <div className='divider'/>
                <h3 className='text-3xl'>3. Privacy</h3>
                <ol className='list-decimal px-5 pt-2'>
                    <li>
                        We collect and process personal information as described in our&nbsp;
                        <a className='link link-secondary' href='privacy'>
                            Privacy Policy
                        </a>
                        .
                    </li>
                    <li>
                        By using our Services, you consent to the collection and processing of your
                        personal information in accordance with our Privacy Policy.
                    </li>
                </ol>
                <div className='divider'/>
                <h3 className='text-3xl'>4. Limitation of Liability</h3>
                <ol className='list-decimal px-5 pt-2'>
                    <li>
                        The Services are provided on an &#34;as-is&#34; and &#34;as available&#34; basis. We make no
                        warranties or representations regarding the availability, accuracy, or
                        reliability of the Services.
                    </li>
                    <li>
                        In no event shall CoDriver be liable for any indirect, consequential,
                        incidental, or punitive damages arising out of or in connection with the use
                        of our Services.
                    </li>
                </ol>
                <div className='divider'/>
                <h3 className='text-3xl'>5. Modifications to the Terms</h3>
                <p className='pt-2'>
                    CoDriver reserves the right to modify or update these Terms at any time without
                    prior notice. It is your responsibility to review the Terms periodically for any
                    changes.
                </p>
                <div className='divider'/>
                <h3 className='text-3xl'>6. Governing Law and Jurisdiction</h3>
                <p className='pt-2'>
                    These Terms shall be governed by and construed in accordance with the laws of
                    Asia/Singapore. Any disputes arising out of or relating to these Terms shall be
                    subject to the exclusive jurisdiction of the courts in Asia/Singapore. Please
                    read these Terms carefully before using our Services. If you have any questions
                    or concerns regarding these Terms, please contact us using our&nbsp;
                    <a className='link link-secondary' href='https://github.com/Emaryllis'>
                        Instagram
                    </a>
                    .
                </p>
            </div>
            <div className='divider'/>
            <h3 className='text-3xl'>Effective Date: {new Date().toLocaleDateString()}.</h3>
        </div>
    );
}
