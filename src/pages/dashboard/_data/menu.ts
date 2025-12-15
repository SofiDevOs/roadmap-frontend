import { teacherMenu } from "./teacherMenu";
import { adminMenu } from "./adminMenu";

export const getMenuByRole = (role: "admin" | "teacher") => {
  if(role === "teacher") return teacherMenu;
  if(role === "admin") return adminMenu;
}
