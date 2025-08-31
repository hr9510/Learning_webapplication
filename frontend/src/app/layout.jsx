import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

export const metadata = {
  title: "LEARNING APP",
  description: "Learning app using Nextjs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
