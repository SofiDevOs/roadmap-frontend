import { appendFileToFormData } from "./utils.ts";

export async function uploadFile(file : File, form: HTMLFormElement) {
    const formData = appendFileToFormData(file, form);
    const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        credentials: "include",
    });
    if(!res.ok) throw new Error("File upload failed");
  }

