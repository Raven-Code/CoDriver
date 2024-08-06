'use client';
import axios from 'axios';
import {useState} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const errorMsg = 'Sorry, something went wrong. Please try again later.'; // Error message to display when an error occurs
export default function Register() {
    // Init form data using the useState hook
    const [data, setData] = useState({
        username: '',
        mail: '',
        password: '',
        confirmPassword: '',
    });
    const [valid, setValid] = useState({
        username: false,
        email: false,
        passwordProgress: 0,
        confirmPassword: false,
        tos: false,
        captcha: false,
    });
    const updateTooltip = (e: any) => {
        const tooltip = e.target.parentNode.querySelector('.tooltip');
        tooltip.classList.toggle('hidden');
        tooltip.classList.toggle('tooltip-open');
    };
    const updateForm = (e: any) => {
        const {name, value} = e.target;
        setData(data => ({...data, [name]: value})); // Update form data
        const regex = {
            username: /^(?![0-9])[a-zA-Z][^!@#$%^&*()_+{}[]:;<>,.?~\\\/\\|]*[a-zA-Z0-9]$/,
            email: /^\w{2,}@[\w\.-]{2,}\.[a-z]{2,}$/i,
            pass: {
                length: /^.{8,30}$/,
                uppercase: /^.*[A-Z].*/,
                lowercase: /^.*[a-z].*/,
                digit: /^.*\d.*/,
                specialChar: /[!@#$%^&*()_+{}[\]:;<>,.?~\\\/\\|]/,
            },
        };
        if (name === 'username' && value !== '') {
            setValid(data => ({...data, username: regex.username.test(value)}));
        } else if (name === 'mail' && value !== '') {
            setValid(data => ({...data, email: regex.email.test(value)}));
        } else if (name === 'password') {
            const passwordTests = [
                regex.pass.length,
                regex.pass.uppercase,
                regex.pass.lowercase,
                regex.pass.digit,
                regex.pass.specialChar,
            ];
            const progress = passwordTests.reduce(
                (acc, test) => acc + (test.test(value) ? 100 / passwordTests.length : 0),
                0
            );
            const progressTarget = e.target.parentNode.querySelector('.progress');
            if (progress === 100) {
                progressTarget.classList.add('progress-success');
                progressTarget.classList.remove('progress-error');
            } else {
                progressTarget.classList.remove('progress-success');
                progressTarget.classList.add('progress-error');
            }
            setValid(data => ({...data, passwordProgress: progress}));
            setValid(data => ({...data, confirmPassword: false}));
        } else if (name === 'confirmPassword' && data.password === data.confirmPassword) {
            setValid(data => ({...data, confirmPassword: true}));
        } else if (name == 'tos') setValid(data => ({...data, tos: e.target.checked}));
        console.log(data);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (
            !(
                valid.username &&
                valid.email &&
                valid.passwordProgress === 100 &&
                valid.confirmPassword &&
                valid.tos &&
                valid.captcha
            )
        )
            return console.error('Invalid form data', JSON.stringify(valid));
        try {
            const response = await axios.post('/api/accounts/register', {
                ...data,
                email: data.mail,
                type: 'customer',
            });
        } catch (e) {
            console.error(errorMsg, e);
            window.location.href = '/';
        }
        window.location.href = '/accounts/login';
    };
    return (
        <div className='flex justify-center'>
            <form className='p-2 w-full max-w-md' noValidate>
                <h5 className='text-lg pb-2 text-center mt-6 mb-7'>Sign Up</h5>
                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='text'
                        name='username'
                        id='username'
                        onInput={updateForm}
                        onMouseLeave={updateForm}
                        onFocus={updateTooltip}
                        onBlur={updateTooltip}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                        autoComplete='off'
                    />
                    <label
                        htmlFor='username'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Username
                    </label>
                    <div
                        className='tooltip tooltip-bottom w-full hidden'
                        data-tip='Choose a unique username'
                    />
                </div>
                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='text'
                        name='mail'
                        id='mail'
                        onInput={updateForm}
                        onMouseLeave={updateForm}
                        onFocus={updateTooltip}
                        onBlur={updateTooltip}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                    />
                    <label
                        htmlFor='mail'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Mail Address
                    </label>
                    <div
                        className='tooltip tooltip-bottom w-full hidden'
                        data-tip='Enter your email address'
                    />
                </div>

                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        onInput={updateForm}
                        onMouseLeave={updateForm}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                    />
                    <label
                        htmlFor='password'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Password
                    </label>
                    <progress
                        className='progress w-full progress-error'
                        value={valid.passwordProgress.toString()}
                        max='100'
                    />
                    <p className='text-sm'>
                        Must contain at least an uppercase, lowercase, number & special character,
                        between 8-30 characters.
                    </p>
                </div>
                <div className='relative z-0 w-full mb-6 group'>
                    <input
                        type='password'
                        name='confirmPassword'
                        id='confirmPassword'
                        onInput={updateForm}
                        onMouseLeave={updateForm}
                        onFocus={updateTooltip}
                        onBlur={updateTooltip}
                        className='block py-2.5 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
                        placeholder=' '
                    />
                    <label
                        htmlFor='confirmPassword'
                        className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
                        Confirm password
                    </label>
                    <div
                        className='tooltip tooltip-bottom w-full hidden'
                        data-tip='Password must match previous password'
                    />
                </div>
                <div className='mb-2'>
                    <div className='flex items-center mb-2'>
                        <input
                            name='tos'
                            id='tos'
                            type='checkbox'
                            className='checkbox checkbox-primary me-2 w-5 h-5'
                            onChange={updateForm}
                            onMouseLeave={updateForm}
                        />
                        <label htmlFor='tos'>
                            Agree to the&nbsp;
                            <a href='/company/tos' className='link link-primary underline'>
                                Terms Of Service
                            </a>
                        </label>
                    </div>
                </div>
                <div className='mb-2'>
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ''}
                        onChange={() => setValid(data => ({...data, captcha: true}))}
                        onExpired={() => setValid(data => ({...data, captcha: false}))}
                    />
                </div>
                <button className='btn btn-primary w-full mb-2' onClick={handleSubmit}>
                    Register
                </button>
                <div className='text-center'>
                    Have a CoDriver account?&nbsp;
                    <a href='/accounts/login' className='link link-primary underline'>
                        Sign In
                    </a>
                </div>
            </form>
        </div>
    );
}
