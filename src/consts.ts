
const BASE_API_URL  =  import.meta.env.DEV ? 'https://api.sofidev.top' :  'http://localhost:8787'  ;



export const getFullUrl = (path: string) =>  new URL(path, BASE_API_URL).toString();