import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { books, categories } from "../../data/books";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "Tất cả");
  const query = (params.get("q") || "").trim().toLocaleLowerCase();
  const results = books.filter((book) =>
    (category === "Tất cả" || book.category === category) &&
    (!query || (book.title + " " + book.author).toLocaleLowerCase().includes(query))
  );

  return (
    <main className="pt-[110px] min-h-screen bg-[#121214] text-white px-5 sm:px-10 xl:px-[64px] pb-20">
      <div className="max-w-[1250px] mx-auto">
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-magnifying-glass text-primary text-2xl" />
          <div><h1 className="font-rubik font-bold text-2xl sm:text-3xl">{query ? 'Kết quả tìm kiếm' : 'Khám phá sách'}</h1><p className="text-gray-400 mt-1">{results.length} cuốn sách phù hợp</p></div>
        </div>
        <form className="flex max-w-xl mt-8" onSubmit={(event) => { event.preventDefault(); setParams(input ? { q: input } : {}); }}>
          <label htmlFor="book-search" className="sr-only">Tên sách hoặc tác giả</label>
          <input id="book-search" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tên sách hoặc tác giả" className="w-full bg-[#252729] text-white rounded-l-xl px-4 py-3 border border-[#41484a] focus:border-primary" />
          <button type="submit" className="bg-primary text-black font-bold px-5 rounded-r-xl hover:bg-white">Tìm</button>
        </form>
        <div className="flex flex-wrap gap-3 mt-8" role="group" aria-label="Lọc thể loại">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={"px-4 py-2 rounded-full border text-sm " + (category === item ? "border-primary bg-primary text-black" : "border-[#41484a] text-gray-300 hover:border-primary")}>{item}</button>)}
        </div>
        {results.length ? <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-9">
          {results.map((book) => <Link key={book.id} to={"/detail/" + book.id} className="group">
            <img src={book.image} alt={"Bìa " + book.title} className="w-full aspect-[2/3] object-cover rounded-xl" loading="lazy" />
            <h2 className="mt-3 font-bold text-base group-hover:text-primary line-clamp-2">{book.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{book.author}</p>
          </Link>)}
        </div> : <div className="py-24 text-center"><p className="text-xl font-bold">Chưa tìm thấy sách</p><p className="text-gray-400 mt-2">Thử từ khóa hoặc thể loại khác.</p></div>}
      </div>
    </main>
  );
}
