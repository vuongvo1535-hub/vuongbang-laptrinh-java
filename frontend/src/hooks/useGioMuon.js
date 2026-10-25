"use client";

import { useEffect, useState } from "react";
import GioMuonService from "@/services/shop/gioMuonServices";

export default function useGioMuon() {
    const [gio, setGio] = useState([]);

    useEffect(() => {
        const tai = () => setGio(GioMuonService.layGio());
        tai();
        window.addEventListener(GioMuonService.SU_KIEN, tai); // cùng tab
        window.addEventListener("storage", tai);              // giữa các tab
        return () => {
            window.removeEventListener(GioMuonService.SU_KIEN, tai);
            window.removeEventListener("storage", tai);
        };
    }, []);

    return { gio, soLuong: gio.length };
}
