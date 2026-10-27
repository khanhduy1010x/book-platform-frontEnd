import { Link } from "react-router-dom";
import Logo from "../../../assets/image/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#121214] border-t border-white/20 text-gray-400">
      <div className="mx-auto w-full max-w-screen-xl px-5 md:px-10 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="Về thư viện">
              <img src={Logo} className="h-8" alt="Book4.0" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6">Đọc sách điện tử miễn phí và tiếp tục từ vị trí đã lưu trên trình duyệt này.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Liên kết cuối trang">
            <Link to="/" className="hover:text-white">Thư viện</Link>
            <Link to="/search" className="hover:text-white">Tìm sách</Link>
            <a href="https://www.gutenberg.org/" target="_blank" rel="noreferrer" className="hover:text-white">Nguồn sách: Project Gutenberg</a>
            <a href="https://standardebooks.org/" target="_blank" rel="noreferrer" className="hover:text-white">Standard Ebooks</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
