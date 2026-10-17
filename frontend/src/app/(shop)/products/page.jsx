import { Suspense } from "react";
import BookCatalog from "@/components/shop/book/BookCatalog";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center text-nau-dam/50">Đang tải...</p>}>
      <BookCatalog />
    </Suspense>
  );
}
