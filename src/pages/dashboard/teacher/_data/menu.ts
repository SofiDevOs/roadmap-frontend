const base = "/dashboard/teacher"

const teacherMenu = [
  {
    href: "/dashboard/student",
    icon: "mage:dashboard-3-fill",
    text: "Dashboard",
  },
  {
    href: `${base}/roadmaps`,
    icon: "material-symbols:conversion-path",
    text: "Roadmaps",
  },
  {
    href: `${base}/cursos`,
    icon: "solar:layers-bold-duotone",
    text: "Cursos",
  },
  {
    href: `${base}/certificados`,
    icon: "duo-icons:certificate",
    text: "Certificados",
  }
];

if(import.meta.env.DEV) {
  teacherMenu.push({
    ...teacherMenu[0],
    href: "/dashboard"
  })
}

export { teacherMenu }
