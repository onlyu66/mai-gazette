import { Cinzel, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

// Cấu hình các font chữ chuẩn theo file HTML gốc của bạn
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-cinzel', // Tạo biến CSS variable để Tailwind v4 nhận diện
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata = {
  title: "Tập San Kỷ Niệm Toàn Diện — Cử Nhân Phan Ngọc Mai",
  description: "Nơi lưu giữ những nét mực thanh xuân của bạn bè gửi về Tòa soạn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      {/* Tích hợp các class font vào body */}
      <body className={`${plusJakarta.variable} ${cinzel.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}