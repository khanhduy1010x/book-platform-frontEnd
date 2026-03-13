import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAPI } from "../Service/APIContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function calculateAverageStars(bookRates) {
  if (!bookRates || bookRates.length === 0) return 0;
  const rateMap = { ONE_STAR: 1, TWO_STAR: 2, THREE_STAR: 3, FOUR_STAR: 4, FIVE_STAR: 5 };
  const total = bookRates.reduce((sum, item) => sum + (rateMap[item.rate] || 0), 0);
  return Math.round((total / bookRates.length) * 10) / 10;
}

function getBestReview(bookRates) {
  if (!bookRates || bookRates.length === 0) return null;
  const priority = ["FIVE_STAR", "FOUR_STAR"];
  for (const star of priority) {
    const found = bookRates.find((r) => r.rate === star && r.comment?.trim());
    if (found) return found;
  }
  return null;
}

function StarRating({ score }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`fa-star text-[16px] ${
            s <= Math.floor(score)
              ? "fa-solid text-yellow-400"
              : s - score < 1 && s - score > 0
              ? "fa-regular text-yellow-400"
              : "fa-regular text-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

function Carousel() {
  const {getListBanner,listBanner} = useAPI();
  const [activeIndex, setActiveIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: () => setTextVisible(false),
    afterChange: (index) => {
      setActiveIndex(index);
      setTextVisible(true);
    },
  };
  useEffect(() => {
    getListBanner();
  },[])
  return (
    <div className="h-[550px] w-full overflow-hidden relative">
      <Slider {...settings}>
        {
          listBanner.map((item,index) => (
            <div
              key={index}
              className={`h-full w-full relative ${item.book ? 'cursor-pointer' : ''}`}
              onClick={() => item.book && navigate(`/detail/${item.book.id}`)}
            >
              <img
                className="h-[550px] w-full object-fit"
                src={item.imageURL}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))
        }
      </Slider>
      <div className="absolute !bg-home-banner h-[7.5rem] w-full bottom-0 left-0 pointer-events-none"></div>
      {/* Book info overlay - bottom center, follows active slide */}
      {listBanner.length > 0 && listBanner[activeIndex]?.book && (
        <div className={`absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1 z-10 pointer-events-none transition-opacity duration-700 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white font-bold text-[22px] md:text-[28px] font-oswald drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wide line-clamp-1 px-4 text-center">
            {listBanner[activeIndex]?.book?.bookName}
          </span>
          <span className="text-gray-300 text-[14px] md:text-[16px] font-oswald drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] tracking-wider uppercase">
            {listBanner[activeIndex]?.book?.author?.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <StarRating score={calculateAverageStars(listBanner[activeIndex]?.book?.bookRates)} />
            <span className="text-yellow-400 font-bold text-[15px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {calculateAverageStars(listBanner[activeIndex]?.book?.bookRates) || "—"}
            </span>
            <span className="text-gray-300 text-[13px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              ({listBanner[activeIndex]?.book?.bookRates?.length ?? 0} đánh giá)
            </span>
          </div>
          {(() => {
            const review = getBestReview(listBanner[activeIndex]?.book?.bookRates);
            if (!review) return null;
            return (
              <div className="flex items-center gap-2 mt-2 max-w-[600px] px-4">
                <i className="fa-solid fa-quote-left text-yellow-400 text-[12px] shrink-0"></i>
                <span className="text-gray-200 text-[13px] italic drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-1">
                  {review.comment}
                </span>
                <i className="fa-solid fa-quote-right text-yellow-400 text-[12px] shrink-0"></i>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default Carousel;
