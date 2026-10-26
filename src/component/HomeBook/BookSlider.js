import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { books, readProgress } from "../../data/books";

export default function BookSlider({ category }) {
  const sliderRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const visibleBooks = category ? books.filter((book) => book.category === category) : books;

  const scroll = (distance) => sliderRef.current?.scrollBy({ left: distance, behavior: "smooth" });

  return (
    <div className="relative">
      <button type="button" onClick={() => scroll(-560)} aria-label="Xem sách phía trước" className="absolute z-20 top-[37%] left-0 -translate-x-1/2 w-11 h-11 rounded-full bg-[#252729] text-white hover:bg-primary hover:text-black">
        <i className="fa-solid fa-chevron-left" />
      </button>
      <div ref={sliderRef} className="flex gap-7 overflow-x-auto hide-scrollbar px-2 py-5 scroll-smooth">
        {visibleBooks.map((book) => {
          const progress = readProgress(book.id);
          return (
            <div key={book.id} className="relative shrink-0 w-44 sm:w-52 xl:w-56 2xl:w-[265px]" onMouseEnter={() => setHoveredId(book.id)} onMouseLeave={() => setHoveredId(null)}>
              <Link to={"/detail/" + book.id} className="block" aria-label={"Xem chi tiết " + book.title}>
                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#252729]">
                  <img src={book.image} alt={"Bìa " + book.title} className="w-full h-full object-cover" loading="lazy" />
                  <span className="absolute right-0 top-0 px-3 py-1.5 bg-cyan-to-lightblue text-black text-xs font-bold rounded-bl-xl">Miễn phí</span>
                </div>
                <h3 className="mt-4 text-white font-bold text-base leading-snug line-clamp-2 hover:text-primary">{book.title}</h3>
                <p className="mt-1 text-gray-400 text-sm">{book.author}</p>
                {progress?.percent > 0 && <p className="mt-2 text-primary text-xs">Đã đọc {progress.percent}%</p>}
              </Link>
              {hoveredId === book.id && <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[min(560px,70vw)] rounded-xl border border-primary bg-[#16191bf2] p-5 shadow-2xl">
                <div className="flex gap-5">
                  <img src={book.image} alt="" className="w-36 aspect-[2/3] object-cover rounded-lg" />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-primary text-xs font-semibold">{book.category} · {book.year}</span>
                    <Link to={"/detail/" + book.id} className="text-white text-xl font-bold mt-2 leading-tight hover:text-primary">{book.title}</Link>
                    <p className="text-gray-300 mt-1 text-sm">{book.author}</p>
                    <p className="text-gray-300 mt-4 text-sm leading-relaxed line-clamp-4">{book.description}</p>
                    <Link to={"/read/" + book.id} className="mt-auto inline-flex items-center gap-2 text-black bg-primary rounded-full px-4 py-2 w-max font-bold text-sm hover:bg-white"><i className="fa-solid fa-book-open-reader" />Đọc sách</Link>
                  </div>
                </div>
              </div>}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => scroll(560)} aria-label="Xem sách tiếp theo" className="absolute z-20 top-[37%] right-0 translate-x-1/2 w-11 h-11 rounded-full bg-[#252729] text-white hover:bg-primary hover:text-black">
        <i className="fa-solid fa-chevron-right" />
      </button>
    </div>
  );
}
