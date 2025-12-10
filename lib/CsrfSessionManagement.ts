'use server'
import "server-only";
import { cookies } from "next/headers";

const SESSION_COOKIE = "gr_admin";

export async function getOrCreateCsrfToken() {
    const c = await cookies();
    let token = c.get(SESSION_COOKIE)?.value;
    if (!token) {
        token = crypto.randomUUID();
    }
    return token;
}

export async function verifyCsrfToken(
    formToken: string | null | undefined,
    headers?: Headers | null
): Promise<boolean> {
    const cookieStore =  await cookies();
    const csrfCookie = cookieStore.get(SESSION_COOKIE)?.value;

    
    if (!csrfCookie) return false;
    
    if (formToken) {
        return csrfCookie === formToken;
    }

    if (headers) {
        const csrfHeader = headers.get("x-csrf-token");
        if (!csrfHeader) return false;
        return csrfCookie === csrfHeader;
    }

    return false;
}


export async function setAdminSession() {
    const token = crypto.randomUUID();
    const c = await cookies();
    c.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    return token;
}


export async function clearAdminSession() {
    const c = await cookies();
    c.delete(SESSION_COOKIE);
}

export async function isAdmin() {
    const c = (await cookies()).get(SESSION_COOKIE);
    return !(c == undefined || c?.value == null || c?.value === "");
}


