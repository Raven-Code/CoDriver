import {Facebook, Instagram, LinkedIn, Twitter} from '../icons';

/**
 * Renders a footer component for a website.
 * Displays information about the company, provides links for getting help, and displays social media links.
 * Also includes a copyright notice.
 */
export default function Footer() {
    return (
        <div className='bg-primary-content'>
            <footer className='footer p-10 text-base-content'>
                <div className='px-10'>
                    <span className='footer-title'>Company</span>
                    <a href='/company/about' className='link link-hover footerLink'>
                        About Us
                    </a>
                    <a
                        className='link link-hover footerLink'
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Design
                    </a>
                    <a
                        className='link link-hover footerLink'
                        href='#'
                        target='_blank'
                        rel='noopener noreferrer'>
                        Advertisement
                    </a>
                </div>
                <div>
                    <span className='footer-title'>Get Help</span>
                    <a className='link link-hover footerLink' href='#'>
                        FAQs
                    </a>
                    <a className='link link-hover footerLink' href='#'>
                        Get in touch
                    </a>
                    <a className='link link-hover footerLink' href='#'>
                        Chat with us
                    </a>
                </div>
                <div>
                    <span className='footer-title'>Legal</span>
                    <a className='link link-hover footerLink' href='/company/privacy'>
                        Privacy policy
                    </a>
                    <a className='link link-hover footerLink' href='/company/tos'>
                        Terms of service
                    </a>

                    <a className='link link-hover footerLink' href='#'>
                        Cookie policy
                    </a>
                </div>
                <div>
                    <span className='footer-title'>Social Links</span>
                    <div className='flex'>
                        <a
                            className='bg-base-100 rounded-full p-1.5 m-1 ms-0 hover:bg-base-200'
                            href='https://github.com/Emaryllis'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <Facebook/>
                        </a>
                        <a
                            className='bg-base-100 rounded-full p-1.5 m-1 hover:bg-base-200'
                            href='https://github.com/Emaryllis'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <Twitter/>
                        </a>
                        <a
                            className='bg-base-100 rounded-full p-1.5 m-1 hover:bg-base-200'
                            href='https://github.com/Emaryllis'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <Instagram/>
                        </a>
                        <a
                            className='bg-base-100 rounded-full p-1.5 m-1 hover:bg-base-200'
                            href='https://github.com/Emaryllis'
                            target='_blank'
                            rel='noopener noreferrer'>
                            <LinkedIn/>
                        </a>
                    </div>
                </div>
            </footer>
            <p className='text-center pb-7'>
                &copy; {new Date().getFullYear()} CoDriver. All rights reserved.
            </p>
        </div>
    );
}
