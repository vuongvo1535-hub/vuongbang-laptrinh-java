// File service dung de goi API gio hang tu Laravel

// Dia chi API gio hang
import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/giohang`;


// Lay danh sach gio hang

// Lay danh sach gio hang theo trang va tu khoa tim kiem
export async function getGioHangs(page = 1, search = "") {

    // Tao URL kem trang hien tai va tu khoa tim kiem
    const params = new URLSearchParams({
        page: String(page),
        search: search.trim(),
    });

    const response = await fetch(
        `${API_URL}?${params.toString()}`
    );

    // Kiem tra API co tra ve thanh cong hay khong
    if (!response.ok) {
        throw new Error("Khong the lay danh sach gio hang");
    }

    // Chuyen du lieu API sang JSON
    return response.json();
}



// Them gio hang
export async function createGioHang(data) {

    const response = await fetch(API_URL, {
        method: "POST",

        // Gui du lieu dang JSON
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },

        // Chuyen du lieu thanh chuoi JSON
        body: JSON.stringify(data),
    });

    // Chuyen ket qua API sang JSON
    const result = await response.json();

    // Kiem tra them thanh cong hay khong
    if (!response.ok) {
        throw new Error(
            result.message ||
            "Khong the them gio hang"
        );
    }

    // Tra ket qua ve cho page
    return result;
}


// Sua gio hang
export async function updateGioHang(id, data) {

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",

            // Gui du lieu dang JSON
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },

            // Chuyen du lieu thanh chuoi JSON
            body: JSON.stringify(data),
        }
    );

    // Chuyen ket qua API sang JSON
    const result = await response.json();

    // Kiem tra sua thanh cong hay khong
    if (!response.ok) {
        throw new Error(
            result.message ||
            "Khong the cap nhat gio hang"
        );
    }

    // Tra ket qua ve
    return result;
}


// Xoa gio hang
// export async function deleteGioHang(id) {

//     const response = await fetch(
//         `${API_URL}/${id}`,
//         {
//             method: "DELETE",

//             // Bao cho Laravel biet client nhan JSON
//             headers: {
//                 "Accept": "application/json",
//             },
//         }
//     );

//     // Chuyen ket qua API sang JSON
//     const result = await response.json();

//     // Kiem tra xoa thanh cong hay khong
//     if (!response.ok) {
//         throw new Error(
//             result.message ||
//             "Khong the xoa gio hang"
//         );
//     }

//     // Tra ket qua ve
//     return result;
// }

