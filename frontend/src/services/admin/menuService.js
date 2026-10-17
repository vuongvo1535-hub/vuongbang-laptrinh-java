import API_CONFIG from "@/config/api";

const API_URL = `${API_CONFIG.BASE_URL}/menu`;

// Lay danh sach menu
export async function getMenus(page = 1) {
    const response = await fetch(
        `${API_URL}?page=${page}&per_page=5`
    );

    if (!response.ok) {
        throw new Error("Khong the lay danh sach menu");
    }

    return response.json();
}

// Them menu
export async function createMenu(data) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Khong the them menu"
        );
    }

    return result;
}

// Sua menu
export async function updateMenu(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Khong the sua menu"
        );
    }

    return result;
}

// Xoa menu
export async function deleteMenu(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Khong the xoa menu"
        );
    }

    return result;
}