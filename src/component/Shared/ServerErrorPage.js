import { useState, useEffect } from "react";

export default function ServerErrorPage({ onRetry }) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      if (onRetry) onRetry();
      else window.location.reload();
    }, 800);
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4">

      {/* Card chính */}
      <div className="w-full max-w-xl rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 overflow-hidden">

        {/* Header đỏ */}
        <div className="bg-red-600/10 border-b border-red-600/20 px-8 py-5 flex items-center gap-3">
          <i className="fa-solid fa-triangle-exclamation text-red-400 text-xl" />
          <div>
            <p className="text-red-400 text-xs font-semibold uppercase tracking-widest">503 — Service Unavailable</p>
            <p className="text-gray-400 text-xs mt-0.5">Không thể kết nối đến máy chủ</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>

        {/* Nội dung */}
        <div className="px-8 py-10 text-center">
          <i className="fa-solid fa-server text-gray-600 text-5xl mb-6" />

          <h1 className="font-oswald text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Máy chủ đang <span className="text-primary">tạm thời</span> gián đoạn
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
            Hệ thống không thể kết nối đến máy chủ lúc này. Vui lòng thử lại sau vài phút.
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gray-700 mb-8" />

          {/* Gợi ý */}
          <div className="grid grid-cols-3 gap-3 mb-8 text-left">
            {[
              { icon: "fa-wifi", label: "Kiểm tra kết nối mạng của bạn" },
              { icon: "fa-clock-rotate-left", label: "Chờ vài phút rồi thử lại" },
              { icon: "fa-headset", label: "Liên hệ hỗ trợ nếu lỗi kéo dài" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                <i className={`fa-solid ${item.icon} text-primary text-lg`} />
                <p className="text-gray-300 text-[12px] leading-snug">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Nút */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
              {retrying ? (
                <><i className="fa-solid fa-spinner fa-spin" /> Đang thử lại...</>
              ) : (
                <><i className="fa-solid fa-rotate-right" /> Thử lại</>
              )}
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm transition-colors border border-gray-600"
            >
              <i className="fa-solid fa-house" /> Trang chủ
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-8 py-3 flex items-center justify-between">
          <span className="text-gray-600 text-xs font-oswald tracking-widest uppercase">TheBook Platform</span>
          <span className="text-gray-600 text-xs">v1.0</span>
        </div>
      </div>
    </div>
  );
}
