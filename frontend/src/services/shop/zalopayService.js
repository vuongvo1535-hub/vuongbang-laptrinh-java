"use server";

import crypto from "crypto";

// =========================================================================
// CẤU HÌNH ZALOPAY GATEWAY SANDBOX CHUẨN DOCS.ZALOPAY.VN
// App ID 554 là cổng thử nghiệm chính thức của ZaloPay
// =========================================================================
const ZALOPAY_CONFIG = {
    app_id: 554,
    key1: "8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    query_endpoint: "https://sb-openapi.zalopay.vn/v2/query",
};

/**
 * Hàm gọi API máy chủ ZaloPay Sandbox tạo đơn hàng và lấy link Cổng thanh toán ZaloPay Gateway
 * Trả về link dạng https://qcgateway.zalopay.vn/pay/v2/qr?order=...
 */
export async function taoDonHangZaloPay(soTien, tienPhatId = 0, description = "", email = "") {
    try {
        const amount = Number(soTien || 20000);
        const transID = Math.floor(Math.random() * 1000000);

        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const yymmdd = String(now.getFullYear()).slice(-2) + pad(now.getMonth() + 1) + pad(now.getDate());
        const app_trans_id = `${yymmdd}_${transID}`;

        const redirectUrl = `http://localhost:3000/phieumuon?zalopay_success=1&tienPhatId=${tienPhatId}&app_trans_id=${app_trans_id}&amount=${amount}&email=${encodeURIComponent(email || "")}`;

        const embed_data = JSON.stringify({
            redirecturl: redirectUrl,
        });
        const items = JSON.stringify([]);

        const orderDesc = description || `Cuong Vuong - Nop phat #${tienPhatId || app_trans_id}`;

        const order = {
            app_id: ZALOPAY_CONFIG.app_id,
            app_trans_id: app_trans_id,
            app_user: "cuongvuong_user",
            app_time: Date.now(),
            item: items,
            embed_data: embed_data,
            amount: amount,
            description: orderDesc,
            bank_code: "",
        };

        // Chuỗi băm dữ liệu MAC chuẩn: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
        const data = [
            order.app_id,
            order.app_trans_id,
            order.app_user,
            order.amount,
            order.app_time,
            order.embed_data,
            order.item,
        ].join("|");

        order.mac = crypto.createHmac("sha256", ZALOPAY_CONFIG.key1).update(data).digest("hex");

        const qs = new URLSearchParams(order).toString();
        const res = await fetch(`${ZALOPAY_CONFIG.endpoint}?${qs}`, {
            method: "POST",
            cache: "no-store",
        });

        const result = await res.json();

        // Nếu ZaloPay tạo đơn thành công (return_code = 1)
        if (result.return_code === 1 && result.order_url) {
            // Chuyển link sang giao diện Desktop QR chuẩn https://qcgateway.zalopay.vn/pay/v2/qr?order=...
            const qrGatewayUrl = result.order_url.replace("/openinapp", "/pay/v2/qr");
            return {
                success: true,
                orderUrl: qrGatewayUrl,
                originalOrderUrl: result.order_url,
                appTransId: app_trans_id,
                zpTransToken: result.zp_trans_token,
            };
        }

        return {
            success: false,
            message: result.return_message || "Không thể tạo đơn hàng ZaloPay Gateway",
        };
    } catch (error) {
        console.error("Lỗi tạo đơn ZaloPay Gateway:", error);
        return {
            success: false,
            message: "Lỗi kết nối máy chủ ZaloPay Sandbox",
        };
    }
}

/**
 * Hàm tra cứu trạng thái đơn hàng ZaloPay từ máy chủ Sandbox
 */
export async function kiemTraTrangThaiZaloPay(app_trans_id) {
    try {
        if (!app_trans_id) {
            return { return_code: 2, return_message: "Thiếu mã giao dịch app_trans_id" };
        }

        const app_id = ZALOPAY_CONFIG.app_id;
        const key1 = ZALOPAY_CONFIG.key1;
        const data = `${app_id}|${app_trans_id}|${key1}`;
        const mac = crypto.createHmac("sha256", key1).update(data).digest("hex");

        const qs = new URLSearchParams({
            app_id: String(app_id),
            app_trans_id: String(app_trans_id),
            mac: mac,
        }).toString();

        const res = await fetch(`${ZALOPAY_CONFIG.query_endpoint}?${qs}`, {
            method: "POST",
            cache: "no-store",
        });

        const result = await res.json();
        return result;
    } catch (err) {
        console.error("Lỗi truy vấn trạng thái ZaloPay:", err);
        return { return_code: 2, return_message: "Không thể kết nối máy chủ ZaloPay Sandbox" };
    }
}
