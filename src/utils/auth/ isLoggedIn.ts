import * as jose from 'jose'
import type {AstroCookies} from 'astro'
// JWT_SECRET
const jwtSecret = import.meta.env.JWT_SECRET;

export async function isLoggedIn(cookies: AstroCookies) {
    const hasToken = cookies.get('access_token');

    if(!hasToken) return false
    const secret = new TextEncoder().encode(jwtSecret);
    try {
        const { payload } = await jose.jwtVerify(hasToken.value || '', secret);
        if (payload){
            return payload;
        }
    } catch (error) {
        return false;
    }
}
