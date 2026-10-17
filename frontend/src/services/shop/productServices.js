import axiosClient from "@/lib/axiosClient";

export async function getProducts() {
  const res = await axiosClient.get("/sanpham");
  return res.data;
}

export async function getProductByDuongDan(duong_dan) {
  const res = await axiosClient.get(`/sanpham/duong-dan/${duong_dan}`);
  return res.data; 
}

export async function getProductById(id) {
  const res = await axiosClient.get(`/sanpham/${id}`);
  return res.data;
}

export async function createProduct(data) {
  const res = await axiosClient.post("/sanpham", data);
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await axiosClient.put(`/sanpham/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axiosClient.delete(`/sanpham/${id}`);
  return res.data;
}