'use client';
import axios from 'axios';
import React, {useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

/**
 * Login component handles user login functionality.
 *
 * @returns The rendered Login page.
 */
export default function Login() {
    // Initialize the form data using the useState hook
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rmbMe: 'off',
        captcha: false,
    });
    // Update the form data when the user types
    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    // Called when the user submits the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {username, password, rmbMe} = formData; // Destructure form data
        try {
            const response = await axios.post('/api/accounts/login', {
                username,
                password,
            });
            if (rmbMe && response.data.token) {
                localStorage.setItem('token', response.data.token);
            } else {
                console.error('Unable to login: No token received.');
            }
            window.location.href = '/customer/dashboard';
        } catch (err) {
            console.error('Unable to login: ', err);
        }
    };
    return (
        <div className='flex justify-center'>
            <form className='p-2 w-full max-w-md' onSubmit={handleSubmit} noValidate>
                <h5 className='text-lg pb-2 text-center mt-6 mb-7'>Sign In</h5>
                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        onChange={updateForm}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        autoComplete='off'
                    />
                    <label
                        htmlFor='username'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Username
                    </label>
                </div>
                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        onChange={updateForm}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                    />
                    <label
                        htmlFor='password'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Password
                    </label>
                </div>
                <div className='mb-2'>
                    <div className='flex items-center mb-2'>
                        <input
                            name='rmbMe'
                            id='rmbMe'
                            type='checkbox'
                            className='checkbox checkbox-primary me-2 w-5 h-5'
                            onChange={updateForm}
                        />
                        <label htmlFor='rmbMe'>Remember Me for 30 days</label>
                    </div>
                </div>
                <div className='mb-2'>
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}
                        onChange={() => setFormData({...formData, captcha: true})}
                        onExpired={() => setFormData({...formData, captcha: false})}
                    />
                </div>
                <div className='my-2'>
                    Forgot your password?&nbsp;
                    <a href='/accounts/resetpass' className='link link-primary underline'>
                        Reset Here
                    </a>
                </div>
                <button className='btn btn-primary w-full' type='submit'>
                    Login
                </button>
                <div className='text-center'>
                    New to CoDriver?&nbsp;
                    <a href='/accounts/register' className='link link-primary underline'>
                        Sign Up
                    </a>
                </div>
            </form>
        </div>
    );
}
