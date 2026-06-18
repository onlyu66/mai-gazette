import { motion } from 'framer-motion';

export default function MarqueeTicker() {
  return (
    <div className="bg-[#F43F5E] text-white text-xs uppercase tracking-[0.2em] py-2.5 overflow-hidden font-medium border-b border-rose-600 select-none">
      <div className="flex w-max flex-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          className="flex space-x-16 pr-16 items-center flex-nowrap whitespace-nowrap"
        >
          <span>✦ TIN NÓNG: Phan Ngọc Mai chính thức nhận bằng Cử nhân Báo chí xuất sắc!</span>
          <span>✦ TẬP SAN KỶ NIỆM: Nơi lưu giữ những nét mực thanh xuân của bạn bè gửi về Tòa soạn</span>
          <span>✦ CẬP NHẬT: Đã tích hợp chuỗi chuyển động Motion cuộn vô tận mượt mà!</span>
          <span>✦ TIN NÓNG: Phan Ngọc Mai chính thức nhận bằng Cử nhân Báo chí xuất sắc!</span>
          <span>✦ TẬP SAN KỶ NIỆM: Nơi lưu giữ những nét mực thanh xuân của bạn bè gửi về Tòa soạn</span>
          <span>✦ CẬP NHẬT: Đã tích hợp chuỗi chuyển động Motion cuộn vô tận mượt mà!</span>
        </motion.div>
      </div>
    </div>
  );
}