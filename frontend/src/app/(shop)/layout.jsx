import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function ShopLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-trang-kem text-nau-dam">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-24 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}