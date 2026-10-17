
"use client";

// Import các thư viện và thành phần cần thiết.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dinhDangTien } from "@/utils/format";
import {
  getDonHangs,
  capNhatTrangThaiDonHang,
} from "@/services/admin/donHangService";
import AdminTable from "@/components/admin/Table/AdminTable";
import Pagination from "@/components/common/Pagination";

// Chuyển mã trạng thái thành nội dung dễ đọc.
function dinhDangTrangThai(trangThai) {
  const danhSachTrangThai = {
    cho_xac_nhan: "Chờ xác nhận",
    da_xac_nhan: "Đã xác nhận",
    dang_giao: "Đang giao",
    da_giao: "Đã giao",
    hoan_thanh: "Hoàn thành",
    da_huy: "Đã hủy",
    cho_thanh_toan: "Chờ thanh toán",
    da_thanh_toan: "Đã thanh toán",
  };

  return danhSachTrangThai[trangThai] || trangThai || "Chưa xác định";
}

export default function DonHangPage() {
  // Danh sách đơn hàng nhận từ API.
  const [donHangs, setDonHangs] = useState([]);

  // Từ khóa tìm kiếm.
  const [tuKhoa, setTuKhoa] = useState("");

  // Trạng thái dùng để lọc danh sách đơn hàng.
  const [trangThai, setTrangThai] = useState("");

  // Thông tin phân trang.
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Trạng thái tải dữ liệu và thông báo lỗi.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lưu ID đơn hàng đang được cập nhật trạng thái.
  const [dangCapNhat, setDangCapNhat] = useState(null);

  // Thay đổi giá trị này để yêu cầu tải lại danh sách.
  const [lanTaiLai, setLanTaiLai] = useState(0);

  // Dùng để chuyển đến trang chi tiết đơn hàng.
  const router = useRouter();

  // Tải danh sách đơn hàng khi các điều kiện thay đổi.
  useEffect(() => {
    let daHuy = false;

    async function taiDuLieu() {
      setLoading(true);
      setError("");

      try {
        // Gọi API lấy danh sách theo trang, từ khóa và trạng thái.
        const ketQua = await getDonHangs(
          page,
          tuKhoa.trim(),
          trangThai
        );

        // Hỗ trợ phản hồi phân trang Laravel và dữ liệu dạng mảng.
        const duLieu = ketQua?.data ?? ketQua;

        const danhSach = Array.isArray(duLieu)
          ? duLieu
          : Array.isArray(duLieu?.data)
            ? duLieu.data
            : [];

        // Chỉ cập nhật dữ liệu khi trang chưa bị hủy.
        if (!daHuy) {
          setDonHangs(danhSach);

          // Lấy tổng số trang từ phản hồi Laravel.
          const tongTrang =
            duLieu?.last_page ??
            ketQua?.last_page ??
            1;

          const soTrang = Math.max(1, Number(tongTrang) || 1);

          setLastPage(soTrang);

          // Nếu trang hiện tại vượt quá tổng số trang, quay về trang cuối.
          if (page > soTrang) {
            setPage(soTrang);
          }
        }
      } catch (loi) {
        console.error("Lỗi tải đơn hàng:", loi);

        if (!daHuy) {
          setDonHangs([]);
          setLastPage(1);
          setError("Không thể tải danh sách đơn hàng.");
        }
      } finally {
        if (!daHuy) {
          setLoading(false);
        }
      }
    }

    taiDuLieu();

    // Ngăn cập nhật state khi effect cũ không còn hiệu lực.
    return () => {
      daHuy = true;
    };
  }, [page, tuKhoa, trangThai, lanTaiLai]);

  // Xử lý khi gửi form tìm kiếm.
  function xuLyTimKiem(e) {
    e.preventDefault();
    setPage(1);
    setLanTaiLai((lanTruoc) => lanTruoc + 1);
  }

  // Xử lý khi thay đổi bộ lọc trạng thái.
  function xuLyLocTrangThai(e) {
    setTrangThai(e.target.value);
    setPage(1);
  }

  // Mở trang chi tiết của một đơn hàng.
  function xemChiTiet(donHang) {
    if (!donHang?.id) {
      alert("Không tìm thấy mã đơn hàng.");
      return;
    }

    router.push(`/admin/donhang/${donHang.id}`);
  }

  // Cập nhật trạng thái đơn hàng thông qua API.
  async function xuLyCapNhatTrangThai(id, trangThaiMoi) {
    // Không thực hiện nếu ID không hợp lệ.
    if (!id || !trangThaiMoi) {
      return;
    }

    try {
      // Khóa ô chọn của đơn hàng đang được cập nhật.
      setDangCapNhat(id);

      // Gọi API cập nhật trạng thái đơn hàng.
      await capNhatTrangThaiDonHang(id, trangThaiMoi);

      alert("Cập nhật trạng thái đơn hàng thành công!");

      // Tải lại danh sách để hiển thị trạng thái mới.
      setLanTaiLai((lanTruoc) => lanTruoc + 1);
    } catch (loi) {
      console.error("Lỗi cập nhật trạng thái:", loi);

      // Hiển thị thông báo do API trả về nếu có.
      alert(
        loi?.response?.data?.message ||
        "Không thể cập nhật trạng thái đơn hàng."
      );

      // Tải lại dữ liệu để hiển thị trạng thái thực tế từ máy chủ.
      setLanTaiLai((lanTruoc) => lanTruoc + 1);
    } finally {
      // Mở lại ô chọn sau khi hoàn tất.
      setDangCapNhat(null);
    }
  }

  // Các cột hiển thị trong bảng quản lý đơn hàng.
  const columns = [
    {
      key: "id",
      label: "Mã đơn",
      render: (donHang) => (
        <span className="font-semibold text-blue-600">
          #{donHang.id}
        </span>
      ),
    },
    {
      key: "ten_nguoi_nhan",
      label: "Người nhận",
      render: (donHang) =>
        donHang.ten_nguoi_nhan ||
        donHang.nguoi_nhan ||
        donHang.ten_khach_hang ||
        donHang.nguoi_dung?.ho_ten ||
        "-",
    },
    {
      key: "so_dien_thoai",
      label: "Số điện thoại",
      render: (donHang) =>
        donHang.so_dien_thoai ||
        donHang.sdt_nguoi_nhan ||
        donHang.so_dien_thoai_nguoi_nhan ||
        donHang.dien_thoai ||
        donHang.sdt ||
        donHang.nguoi_dung?.so_dien_thoai ||
        donHang.nguoi_nhan?.so_dien_thoai ||
        "-",
    },
    {
      key: "tong_tien",
      label: "Tổng tiền",
      render: (donHang) => (
        <span className="font-medium">
          {dinhDangTien(
            donHang.tong_tien_hang ??
            donHang.thanh_tien ??
            0
          )}
        </span>
      ),
    },
    {
      key: "trang_thai",
      label: "Trạng thái",
      render: (donHang) => {
        // Lấy trạng thái hiện tại của đơn hàng.
        const trangThaiHienTai = donHang.trang_thai || "cho_xac_nhan";

        // Chọn màu theo trạng thái.
        const mauTrangThai = {
          cho_xac_nhan: "bg-yellow-100 text-yellow-800",
          da_xac_nhan: "bg-blue-100 text-blue-800",
          dang_giao: "bg-purple-100 text-purple-800",
          da_giao: "bg-indigo-100 text-indigo-800",
          hoan_thanh: "bg-green-100 text-green-800",
          da_huy: "bg-red-100 text-red-800",
          cho_thanh_toan: "bg-orange-100 text-orange-800",
          da_thanh_toan: "bg-green-100 text-green-800",
        };

        return (
          <div className="min-w-40 space-y-2">
            {/* Hiển thị trạng thái hiện tại bằng nhãn màu. */}
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                mauTrangThai[trangThaiHienTai] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {dinhDangTrangThai(trangThaiHienTai)}
            </span>

            {/* Chọn trạng thái mới ngay trên dòng đơn hàng. */}
            <select
              value={trangThaiHienTai}
              disabled={
                dangCapNhat === donHang.id ||
                ["hoan_thanh", "da_huy"].includes(trangThaiHienTai)
              }
              onChange={(e) =>
                xuLyCapNhatTrangThai(donHang.id, e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
            >
              <option value="cho_xac_nhan">Chờ xác nhận</option>
              <option value="da_xac_nhan">Đã xác nhận</option>
              <option value="dang_giao">Đang giao</option>
              <option value="da_giao">Đã giao</option>
              <option value="hoan_thanh">Hoàn thành</option>
              <option value="da_huy">Đã hủy</option>
              <option value="cho_thanh_toan">Chờ thanh toán</option>
              <option value="da_thanh_toan">Đã thanh toán</option>
            </select>

            {/* Báo cho người dùng biết khi đang lưu thay đổi. */}
            {dangCapNhat === donHang.id && (
              <p className="text-xs text-blue-600">
                Đang cập nhật...
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "ngay_tao",
      label: "Ngày đặt",
      render: (donHang) => {
        // Lấy ngày tạo theo dữ liệu API.
        const ngay = donHang.ngay_dat || donHang.created_at;

        // Không định dạng nếu ngày không hợp lệ.
        if (!ngay || Number.isNaN(Date.parse(ngay))) {
          return "-";
        }

        return new Date(ngay).toLocaleDateString("vi-VN");
      },
    },
    {
      key: "thao_tac",
      label: "Thao tác",
      render: (donHang) => (
        <button
          type="button"
          onClick={() => xemChiTiet(donHang)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-5 p-4 md:p-6">
      {/* Tiêu đề trang quản lý đơn hàng. */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý đơn hàng
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Tìm kiếm, lọc trạng thái và xem chi tiết đơn hàng.
        </p>
      </div>

      {/* Form tìm kiếm và lọc danh sách đơn hàng. */}
      <form
        onSubmit={xuLyTimKiem}
        className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-4 md:grid-cols-3"
      >
        {/* Nhập mã đơn hoặc tên người nhận. */}
        <input
          type="text"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="Nhập mã đơn hoặc tên người nhận..."
          className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500"
        />

        {/* Lọc đơn hàng theo trạng thái. */}
        <select
          value={trangThai}
          onChange={xuLyLocTrangThai}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="cho_xac_nhan">Chờ xác nhận</option>
          <option value="da_xac_nhan">Đã xác nhận</option>
          <option value="dang_giao">Đang giao</option>
          <option value="da_giao">Đã giao</option>
          <option value="hoan_thanh">Hoàn thành</option>
          <option value="da_huy">Đã hủy</option>
          <option value="cho_thanh_toan">Chờ thanh toán</option>
          <option value="da_thanh_toan">Đã thanh toán</option>
        </select>

        {/* Nút gửi yêu cầu tìm kiếm. */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Hiển thị lỗi nếu không tải được dữ liệu. */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              setLanTaiLai((lanTruoc) => lanTruoc + 1)
            }
            className="mt-2 font-medium underline"
          >
            Thử tải lại
          </button>
        </div>
      )}

      {/* Hiển thị bảng đơn hàng dùng chung. */}
      {loading ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          Đang tải danh sách đơn hàng...
        </div>
      ) : (
        <AdminTable columns={columns} data={donHangs} />
      )}

      {/* Hiển thị phân trang khi có nhiều hơn một trang. */}
      {!loading && lastPage > 1 && (
        <Pagination
          currentPage={page}
          pageCount={lastPage}
          onPageChange={(trangMoi) => {
            if (trangMoi >= 1 && trangMoi <= lastPage) {
              setPage(trangMoi);
            }
          }}
        />
      )}

      {/* Hiển thị số trang hiện tại. */}
      <p className="text-right text-sm text-gray-500">
        Trang {page} / {lastPage}
      </p>
    </div>
  );
}