export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function appendFileToFormData(file: File, form: HTMLFormElement) {
  const formData = new FormData(form);
  formData.append("file", file);
  formData.append("filename", `certificados/${file.name}`);
  return formData;
}

export const $ = ( el:string ) => document.querySelector(el);
