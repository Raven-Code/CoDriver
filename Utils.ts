import axios from 'axios';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
/**
 * Returns the current date and time in the format specified by the 'en-GB' locale and the 'Asia/Singapore' timezone.
 *
 * @returns The formatted date and time.
 */
export function getDate(): string {
	return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Singapore' });
}
/**
 * Returns the current time in 24 hour format and the 'Asia/Singapore' timezone.
 *
 * @returns The formatted time.
 */
export function getTime() {
	return new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: false });
}
/**
 * Encrypts a plain text string using bcrypt hashing algorithm.
 * @param plain - The plain text string to be encrypted.
 * @returns A promise that resolves with the encrypted version of the input string.
 */
export async function encrypt(plain: string): Promise<string> {
	return bcrypt.hashSync(plain, parseInt(process.env.SALT_ROUNDS || '15'));
}
/**
 * Compares a plain text string with an encrypted string.
 * @param plain - The plain text string to compare.
 * @param enc - The encrypted string to compare.
 * @returns A boolean value indicating whether the two strings match or not.
 */
export async function checkEnc(plain: string, enc: string): Promise<boolean> {
	return bcrypt.compareSync(plain, enc);
}
/**
 * Sends a notification to a Discord webhook.
 *
 * @param title - The title of the notification.
 * @param description - The description of the notification.
 * @returns promise that resolves with a NextResponse object containing the response data and status code.
 */
export async function sendNotification(title: string, description: string): Promise<NextResponse> {
	try {
		const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
		const payload = { embeds: [{ title, description }] };
		const response = await axios.post(webhookUrl, JSON.stringify(payload), {
			headers: { 'content-type': 'application/json' },
		});
		return new NextResponse(response.data, { status: 200 });
	} catch (error) {
		console.error('Error parsing request body:', error);
		return new NextResponse('Unable to send Discord Notification.', { status: 400 });
	}
}
export async function captalize(data: string) {
	return data.charAt(0).toUpperCase() + data.slice(1);
}
const privateKey = fs.readFileSync('private.key');
const options: SignOptions = {
	algorithm: 'RS256',
	audience: 'urn:CoDriver',
	issuer: 'urn:CoDriver',
	jwtid: 'CoDriver',
	subject: 'CoDriver',
};
/**
 * Generate a JSON Web Token (JWT) using a private key.
 * @param data - The data to include in the token payload.
 * @returns A promise that resolves with the generated token.
 */
export async function jwtSign(data: Object): Promise<string> {
	try {
		return jwt.sign(data, privateKey, { ...options, expiresIn: '30d' });
	} catch (e) {
		console.error(e);
		return `Error: ${e}`;
	}
}
/**
 * Verifies a JSON Web Token (JWT) using a private key and options.
 *
 * @param token The JWT to be verified.
 * @returns The decoded token if it is valid, otherwise an error message.
 */
export async function jwtVerify(token: string): Promise<JwtPayload | string> {
	try {
		return jwt.verify(token, privateKey, options);
	} catch (err) {
		console.error(err);
		return `Error: ${err}`;
	}
}
const IS_SERVER = typeof window === 'undefined';
export default function getURL(path: string) {
	const baseURL = IS_SERVER ? process.env.NEXT_PUBLIC_SITE_URL! : window.location.origin;
	return new URL(path, baseURL).toString();
}
