import { Cormorant_Garamond, Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import { GrainOverlay } from '@/lib/components/GrainOverlay';
import { ProgressBar } from '@/lib/components/ProgressBar';
import { ScrollToTop } from '@/lib/components/ScrollToTop';
import "./globals.css";

// Cormorant Garamond — tiêu đề editorial sang trọng, hỗ trợ Vietnamese
const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cinzel', // giữ tên biến cũ để không phải đổi class
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

// Be Vietnam Pro — body text hiện đại, thiết kế cho tiếng Việt
const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta', // giữ tên biến cũ
});

export const metadata = {
  title: "Tập San Kỷ Niệm Toàn Diện — Cử Nhân Phan Ngọc Mai",
  description: "Nơi lưu giữ những nét mực thanh xuân của bạn bè gửi về Tòa soạn",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      {/* Tích hợp các class font vào body */}
      <body className={`${beVietnam.variable} ${cormorant.variable} ${playfair.variable}`}>
        <ProgressBar />
        <GrainOverlay />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}