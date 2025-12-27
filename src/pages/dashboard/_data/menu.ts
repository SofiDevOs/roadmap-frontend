import { teacherMenu } from "./teacherMenu";
import { adminMenu } from "./adminMenu";

const MENU_BY_ROLE = {
  admin: adminMenu,
  teacher: teacherMenu,
  student: [],
}

export const getMenuByRole = (role: "admin" | "teacher" | "student") => {
  return MENU_BY_ROLE[role]; 
}
