import * as jose from 'jose'
import type {AstroCookies} from 'astro'

const jwtSecret = import.meta.env.JWT_SECRET;

export async function isLoggedIn(cookies: AstroCookies) {
    const hasToken = cookies.get('access_token');
    if (!hasToken) return false;

    const secret = new TextEncoder().encode(jwtSecret);
    try {
        const { payload } = await jose.jwtVerify(hasToken.value || '', secret);
        if (!payload) throw new Error('Invalid token payload');
        return payload;

    } catch (error) {
        console.error('JWT verification error:', error);
        cookies.delete('access_token');
        return false;
    }
}

