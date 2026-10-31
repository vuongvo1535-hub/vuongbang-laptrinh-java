import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";
import ChatbotAssistant from "@/components/shop/ChatbotAssistant";

export default function ShopLayout({ children }) {
    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ChatbotAssistant />
        </>
    );
}
