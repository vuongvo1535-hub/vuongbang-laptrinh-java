import axiosClient from "@/lib/axiosClient";

export async function sendContact(data) {
  const res = await axiosClient.post("/lien-he", data);
  return res.data;
}