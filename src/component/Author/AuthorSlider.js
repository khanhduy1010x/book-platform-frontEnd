import { Link } from "react-router-dom";
import { books } from "../../data/books";

export default function AuthorSlider() {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar">
      <div className="flex gap-9 w-max px-2">
        {books.map((book) => (
          <Link key={book.id} to={"/detail/" + book.id} className="w-40 sm:w-52 text-center group">
            <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-[#1c3331] border border-[#376561] flex items-center justify-center mx-auto group-hover:border-primary transition-colors">
              <span className="text-6xl sm:text-7xl text-primary font-oswald" aria-hidden="true">{book.author.charAt(0)}</span>
            </div>
            <span className="block text-white font-bold mt-4 group-hover:text-primary">{book.author}</span>
            <span className="block text-gray-400 text-sm mt-1">{book.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
