import type { APIRoute } from "astro";
import { User, userRepository } from "backend/repositories/userRepository";

export const POST: APIRoute = async ({ request, cookies }) => {
    const formData = await request.formData();

    const [ username, fullname, email, password ] = [
        formData.get("username")?.toString().trim() ?? "", // 0
        formData.get("fullname")?.toString().trim() ?? "", // 1
        formData.get("email")?.toString().trim() ?? "", // 2
        formData.get("password")?.toString().trim() ?? "" // 3
    ]
    const user = new User( username, fullname, email, password);
    user.fullname = "patata";
    userRepository.add(user);
    const allUsers = userRepository.all();
    return new Response(JSON.stringify(allUsers), {
        status: 201,
        headers: {
        "content-type": "application/json"
        }
    });
}