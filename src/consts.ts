
const BASE_API_URL  =  import.meta.env.DEV ? 'http://localhost:8787' : 'https://roadmap.sofidev.top';



export const getFullUrl = (path: string) =>  new URL(path, BASE_API_URL).toString();