const base = "/dashboard/student"

const studentMenu = [
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
  },
  {
    href: `${base}/logros`,
    icon: "solar:medal-star-bold-duotone",
    text: "logros",
  }
];

if(import.meta.env.DEV) {
  studentMenu.push({
    ...studentMenu[0],
    href: "/dashboard"
  })
}

export { studentMenu }
