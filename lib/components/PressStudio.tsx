import React from 'react';

interface PressStudioProps {
  tenThe: string;
  setTenThe: (val: string) => void;
  anhChupThe: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  theCardRef: React.RefObject<HTMLDivElement | null>;
  moCamera: () => Promise<void>;
  chupAnh: () => void;
  taiThePhongVien: () => void;
}

export default function PressStudio({
  tenThe, setTenThe, anhChupThe, videoRef, canvasRef, theCardRef, moCamera, chupAnh, taiThePhongVien
}: PressStudioProps) {
  return (
    <section id="studio-anh" className="py-20 bg-rose-50/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-rose-600 block">● PRESS ACCREDITATION BOOTH</span>
          <h2 className="font-bao-chi text-4xl font-extrabold tracking-tight">Studio Cấp Thẻ Tác Nghiệp Báo Chí</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">Tạo lập thẻ nhà báo đặc phái cao cấp với độ nét chuẩn in ấn để làm quà lưu niệm độc quyền.</p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="w-full aspect-video bg-[#13111C] rounded-2xl overflow-hidden shadow-2xl relative border-2 border-rose-200/20 p-1">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl"></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-[10px] text-white/80 font-mono px-3 py-1 rounded-full uppercase tracking-wider">● Live Camera Feed</div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">Họ tên in lên thẻ nhà báo</label>
                <input type="text" value={tenThe} onChange={(e) => setTenThe(e.target.value)} placeholder="Nhập tên đầy đủ của bạn..." className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 text-center shadow-inner" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={moCamera} className="bg-slate-900 text-white text-xs font-extrabold uppercase py-4 rounded-xl tracking-wider hover:bg-slate-800 transition active:scale-95 shadow-md">1. Bật Camera</button>
                <button onClick={chupAnh} className="bg-rose-600 text-white text-xs font-extrabold uppercase py-4 rounded-xl tracking-wider hover:bg-rose-700 transition active:scale-95 shadow-lg">2. Chụp Hình</button>
              </div>

              <button onClick={taiThePhongVien} className="w-full bg-indigo-600 text-white text-xs font-extrabold uppercase py-4 rounded-xl tracking-widest hover:bg-indigo-700 transition active:scale-95 shadow-xl flex items-center justify-center space-x-2">
                <span>📥 3. TẢI THẺ KỶ NIỆM SẮC NÉT (PNG)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div ref={theCardRef} className="w-80 aspect-[2.5/4] bg-[#0A0E1A] text-white rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden border border-gray-800">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600"></div>
              <div className="text-center pt-2 border-b border-gray-800/60 pb-3">
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-rose-500 text-xs">◆</span>
                  <h4 className="font-bao-chi text-[15px] font-black tracking-[0.25em] text-[#FFE8BC]">MAI GAZETTE</h4>
                  <span className="text-rose-500 text-xs">◆</span>
                </div>
                <p className="text-[8px] uppercase font-mono tracking-[0.2em] font-extrabold text-slate-500 mt-1">INTERNATIONAL PRESS CREDENTIAL</p>
              </div>

              <div className="flex justify-between items-start mt-4 space-x-4">
                <div className="w-32 h-40 bg-zinc-950 border border-gray-800 rounded-xl overflow-hidden relative shadow-2xl flex-shrink-0 flex items-center justify-center">
                  {anhChupThe ? (
                    <img src={anhChupThe} alt="Kết quả chụp" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[8px] font-mono text-gray-600 text-center p-2 uppercase tracking-wide">
                      <span className="text-xl mb-1">📷</span>
                      <span>No Image<br />Captured</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between h-40 pt-1">
                  <div className="w-8 h-6 bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 rounded border border-amber-200/40 p-0.5 shadow-md flex flex-col justify-between">
                    <div className="border-b border-amber-700/20 h-[1px]"></div>
                    <div className="border-b border-amber-700/20 h-[1px]"></div>
                    <div className="border-b border-amber-700/20 h-[1px]"></div>
                  </div>
                  <div className="text-[7px] font-mono text-slate-400 space-y-1 mt-2">
                    <div><span className="text-slate-600 font-bold">DEPT:</span> NEWSROOM</div>
                    <div><span className="text-slate-600 font-bold">RANK:</span> SPECIAL ENVOY</div>
                    <div><span className="text-slate-600 font-bold">ZONE:</span> HANOI CAP.</div>
                  </div>
                  <div className="border border-rose-500/40 text-rose-400 font-mono text-[7px] font-extrabold px-1.5 py-1 rounded text-center uppercase tracking-tighter transform rotate-3 mt-auto bg-rose-950/40">
                    Verified 2026
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-0.5">
                <span className="text-[7px] uppercase font-mono tracking-widest text-slate-500 font-bold block">PRESENTER / CHỦ THỂ</span>
                <h5 className="font-bao-chi text-lg font-black tracking-wide text-[#FFF0D4] uppercase truncate">
                  {tenThe.trim() ? tenThe.toUpperCase() : 'BẠN THÂN'}
                </h5>
              </div>

              <div className="border-t border-slate-800/80 pt-3 mt-4 flex justify-between items-center">
                <div className="text-left font-mono text-[6px] text-slate-500 space-y-0.5">
                  <div>AUTH ID: #2026-NMAI-779</div>
                  <div className="text-rose-500 font-bold">STATUS: RECOGNIZED</div>
                </div>
                <div className="flex flex-col items-end space-y-0.5">
                  <div className="flex space-x-[1px] h-5 bg-white/10 p-[2px] rounded-sm items-stretch">
                    <div className="w-[1px] bg-slate-300"></div><div className="w-[2px] bg-slate-300"></div><div className="w-[1px] bg-transparent"></div><div className="w-[1px] bg-slate-300"></div><div className="w-[3px] bg-slate-300"></div>
                  </div>
                  <span className="text-[5px] font-mono text-slate-600 tracking-tighter">PRESS SECURITY CODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}