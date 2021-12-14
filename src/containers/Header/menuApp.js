export const adminMenu = [
  {
    //Quan li nguoi dung
    name: "menu.admin.manager-user",
    menus: [
      {
        name: "menu.admin.crud-redux",
        link: "/system/user-redux",
      },
      {
        name: "menu.admin.crud",
        link: "/system/user-manager",
      },
      {
        name: "menu.admin.manager-doctor",
        link: "/system/manager-doctor",
      },
      {
        // name: "menu.admin.manager-admin",
        // link: "/system/user-admin",
        //Quan li ke hoach kham benh
        name: "menu.doctor.manager-schedule",
        link: "/doctor/manage-schedule",
      },
    ],
  },
  {
    //Quan li phong kham
    name: "menu.admin.clinic",
    menus: [
      {
        name: "menu.admin.manager-clinic",
        link: "/system/manager-clinic",
      },
    ],
  },
  {
    //Quan li chuyen khoa
    name: "menu.admin.specialty",
    menus: [
      {
        name: "menu.admin.manager-specialty",
        link: "/system/manager-specialty",
      },
    ],
  },
  {
    //Quan li cam nang
    name: "menu.admin.handbook",
    menus: [
      {
        name: "menu.admin.manager-handbook",
        link: "/system/manager-handbook",
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: "menu.admin.manager-user",
    menus: [
      {
        //Quan li ke hoach kham benh cua bac si
        name: "menu.doctor.manager-schedule",
        link: "/doctor/manage-schedule",
      },
      {
        //Quan li benh nhan kham benh cua bac si
        name: "menu.doctor.manager-patient",
        link: "/doctor/manage-patient",
      },
    ],
  },
];
