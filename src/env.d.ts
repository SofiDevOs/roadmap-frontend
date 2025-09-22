/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        user: {
            username: string
            fullname: string
            id: string,
            email: string,
            email_verified: boolean,
            role: string
        }
    }
}
