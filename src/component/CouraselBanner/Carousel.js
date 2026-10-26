import Slider from "react-slick";
import { Link } from "react-router-dom";
import { books } from "../../data/books";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 550,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
  };
  return (
    <div className="w-full overflow-hidden relative bg-[#121214]">
      <Slider {...settings}>
        {books.slice(0, 3).map((book) => (
          <div key={book.id}>
            <div className="min-h-[460px] sm:min-h-[550px] bg-gradient-to-r from-[#102422] via-[#162a29] to-[#121214] px-6 sm:px-[64px] pt-[115px] pb-14 flex items-center">
              <div className="w-full max-w-[1250px] mx-auto grid grid-cols-[1fr_130px] sm:grid-cols-[1fr_260px] lg:grid-cols-[1fr_340px] gap-6 sm:gap-12 items-center">
                <div className="max-w-[680px]">
                  <span className="text-primary text-sm font-semibold">Sách điện tử miễn phí · {book.category}</span>
                  <h1 className="text-white font-oswald font-bold text-3xl sm:text-5xl lg:text-6xl leading-tight mt-5">{book.title}</h1>
                  <p className="text-gray-300 mt-3 text-base sm:text-lg">{book.author}</p>
                  <p className="text-gray-300 mt-5 leading-relaxed hidden sm:block">{book.description}</p>
                  <Link to={"/detail/" + book.id} className="mt-7 inline-flex items-center gap-3 bg-primary text-black rounded-full px-6 py-3 font-bold hover:bg-white transition-colors"><i className="fa-solid fa-book-open" />Khám phá sách</Link>
                </div>
                <Link to={"/detail/" + book.id} className="block max-w-[340px] shadow-2xl rounded-xl overflow-hidden">
                  <img src={book.image} alt={"Bìa " + book.title} className="w-full aspect-[2/3] object-cover" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <div className="absolute !bg-home-banner h-[7.5rem] w-full bottom-0 left-0 pointer-events-none" />
    </div>
  );
}
