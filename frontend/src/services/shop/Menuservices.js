import axiosClient from "@/lib/axiosClient";

function toMenuItem(menu) {
  return {
    id: menu.id,
    label: menu.ten_menu,
    href: menu.duong_dan_lien_ket,
    children: (menu.menu_con || []).map(toMenuItem),
  };
}

// Lay menu hien thi tren header
export async function getMenus() {
  const res = await axiosClient.get("/menu");
  return (res.data.data || []).map(toMenuItem);
}