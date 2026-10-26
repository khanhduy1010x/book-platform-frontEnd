import { Link, useParams } from "react-router-dom";
import BookSlider from "../HomeBook/BookSlider";
import { books, readProgress } from "../../data/books";

export default function DetailBook() {
  const { id } = useParams();
  const book = books.find((item) => item.id === id) || books[0];
  const progress = readProgress(book.id);

  return (
    <main className="min-h-screen bg-[#121214] text-white pt-[110px] pb-16 px-5 sm:px-10 xl:px-[64px]">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-primary mb-8">
        <i className="fa-solid fa-arrow-left" /> Về thư viện
      </Link>
      <div className="relative max-w-[1240px] mx-auto">
        <div className="blur-layer-1 absolute top-10 right-[30%] -z-0 pointer-events-none" aria-hidden="true" />
        <div className="relative grid grid-cols-1 md:grid-cols-[minmax(220px,380px)_1fr] gap-10 lg:gap-16">
          <div className="w-full max-w-[380px] mx-auto md:mx-0">
            <img src={book.image} alt={"Bìa " + book.title} className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl" />
          </div>
          <div className="font-rubik">
            <span className="inline-flex rounded-full px-4 py-1.5 text-sm bg-[#00cec821] text-primary font-semibold">{book.category} · Miễn phí</span>
            <h1 className="font-oswald text-4xl md:text-5xl leading-tight font-bold mt-5">{book.title}</h1>
            <p className="text-gray-300 text-xl mt-3">{book.author}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 py-7 my-7 border-y border-white/20 text-sm">
              <div><span className="block text-gray-400 mb-1">Ngôn ngữ</span><strong>{book.language}</strong></div>
              <div><span className="block text-gray-400 mb-1">Xuất bản</span><strong>{book.year}</strong></div>
              <div><span className="block text-gray-400 mb-1">Thời gian đọc</span><strong>Khoảng {book.readingTime}</strong></div>
            </div>
            <h2 className="text-xl font-bold mb-3">Giới thiệu sách</h2>
            <p className="text-gray-300 leading-8 max-w-[65ch]">{book.description}</p>
            {progress?.percent > 0 && <p className="text-primary mt-6">Bạn đã đọc {progress.percent}% cuốn sách này.</p>}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link to={"/read/" + book.id} className="inline-flex items-center justify-center gap-3 bg-primary text-black rounded-full px-7 py-4 font-bold hover:bg-white transition-colors">
                <i className="fa-solid fa-book-open-reader" />{progress ? "Đọc tiếp" : "Đọc sách"}
              </Link>
              <a href={book.source} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-primary underline underline-offset-4">Xem nguồn Project Gutenberg ↗</a>
            </div>
            <p className="text-gray-500 text-sm mt-5">Tiến độ và cài đặt đọc được lưu trên trình duyệt này.</p>
          </div>
        </div>
        <section className="mt-20">
          <h2 className="text-2xl font-bold font-rubik mb-5">Có thể bạn thích</h2>
          <BookSlider />
        </section>
      </div>
    </main>
  );
}
