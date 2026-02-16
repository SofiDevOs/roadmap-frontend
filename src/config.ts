export const { 
  RESEND_API_KEY, 
  JWT_SECRET 
} = import.meta.env;

export const USER_ROLES = {
  admin: {
    path: "/dashboard/",
  },
  student: {
    path: "/dashboard/student",
  },
  teacher: {
    path: "/dashboard/teacher",
  },
};

export const 
  PRIVATE_PATHS = ["/settings", "/dashboard"],
  PRIVATE_PARAMS = ["leccion"];
