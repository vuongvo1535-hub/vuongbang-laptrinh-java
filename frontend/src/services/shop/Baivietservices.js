import axiosClient from "@/lib/axiosClient";

export async function getBaiViets(page = 1, chuDeId = null) {
  let url = `/baiviet?page=${page}`;

  if (chuDeId) {
    url += `&chu_de_id=${chuDeId}`;
  }

  const res = await axiosClient.get(url);

  return res.data;
}

export async function getBaiVietByDuongDan(duongDan) {
  const res = await axiosClient.get(
    `/baiviet/${duongDan}`
  );

  return res.data;
}