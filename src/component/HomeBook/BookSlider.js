import { useState, useRef, useEffect } from "react";
import freeIcon from "../../assets/image/free.png";
import payIncon from "../../assets/image/paidIcon.png";
import memberIcon from "../../assets/image/meberIcon.png";
import { Link } from "react-router-dom";
export default function BookSlider({scale}) {
  const [translateX, setTranslateX] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isRightHalf, setIsRightHalf] = useState(false);
  const [maxTranslateX, setMaxTranslateX] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const sliderRef = useRef(null);
  const numbers = [];
  for (let i = 1; i <= 10; i++) {
    numbers.push(i);
  }
  useEffect(() => {
    const sliderWidth = sliderRef.current.scrollWidth;
    const containerWidth = sliderRef.current.offsetWidth;
    const maxScrollWidth = sliderWidth - containerWidth;
    setMaxTranslateX(-Math.max(maxScrollWidth, 0));
    const handleScroll = () => {
      const currentScroll = sliderRef.current.scrollLeft;
      if (currentScroll <= 0) {
        setIsAtStart(true);
      } else {
        setIsAtStart(false);
      }
      if (currentScroll + containerWidth >= sliderWidth) {
        setIsAtEnd(true);
      } else {
        setIsAtEnd(false);
      }
    };

    sliderRef.current.addEventListener("scroll", handleScroll);

    return () => {
      if (sliderRef.current) {
        sliderRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [numbers]);
  const handleLeftClick = () => {
    if (sliderRef.current.scrollLeft > 0) {
      sliderRef.current.scrollBy({ left: -600, behavior: "smooth" });
      const newScrollLeft = sliderRef.current.scrollLeft - 600;
      setTranslateX(newScrollLeft);
    }
  };

  const handleRightClick = () => {
    const slider = sliderRef.current;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    if (slider.scrollLeft < maxScrollLeft) {
      slider.scrollBy({ left: 600, behavior: "smooth" });
      const newScrollLeft = slider.scrollLeft + 600;
      setTranslateX(newScrollLeft);
    }
  };

  const handleMouseEnter = (index, event) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    if (rect.left + rect.width / 2 > screenWidth / 2) {
      setIsRightHalf(true);
    } else {
      setIsRightHalf(false);
    }
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const aTagContent = (url) => (
    <Link href="/" className="relative lg:w-48 xl:w-50 2xl:w-60">
      <img
        src={url}
        alt="Đập nồi bán sắt đi học"
        className="object-cover w-full h-full rounded-xl"
      />
    </Link>
  );

  return (
    <div className="relative">
      {!isAtStart && (
        <div
          className="flex justify-center text-center items-center p-[25px] w-[30px] h-[30px] bg-custom-modal-dark-III backdrop-blur hover:bg-custom-modal-dark absolute top-[40%] -left-7 z-[100] cursor-pointer text-[24px] rounded-full"
          onClick={handleLeftClick}
        >
          <i className="fa-solid text-white fa-chevron-left"></i>
        </div>
      )}
      {!isAtEnd && (
        <div
          className="flex justify-center text-center items-center p-[25px] w-[30px] h-[30px] bg-custom-modal-dark-III backdrop-blur hover:bg-custom-modal-dark absolute top-[40%] -right-7 z-[2] cursor-pointer text-[24px] rounded-full"
          onClick={handleRightClick}
        >
          <i className="fa-solid text-white fa-chevron-right"></i>
        </div>
      )}

      <div
        className="w-[100%] hide-scrollbar relative overflow-x-auto "
        ref={sliderRef}
      >
        <div className="w-full max-w-full list-carousel-item  hide-scrollbar transition-transform ease-in-out">
          <div className="w-max flex hide-scrollbar pt-4 px-2">
            {numbers.map((_, index) => (
              <div
                key={index}
                className={`inline-block relative lg:w-52 group xl:w-56 group 2xl:w-[265px] cursor-pointer float-left mr-[42px] last:mr-[0px] ${'scale-' + scale}`}
                onMouseEnter={(event) => handleMouseEnter(index, event)}
                onMouseLeave={handleMouseLeave}
              >
                <div>
                  <div className="relative w-full">
                    <img
                      src={memberIcon}
                      className="w-[50px] group-hover:opacity-0 absolute transition-opacity darution-500 ease-in-out z-20 -left-2 -top-2"
                    />
                    <div className="relative w-full overflow-hidden pt-[150%] grid-center rounded-xl">
                      <img
                        src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49435.jpg?v=1&amp;w=350&amp;h=510"
                        alt="Đập nồi bán sắt đi học"
                        className="absolute top-0 left-0 object-cover w-full h-full"
                      />
                    </div>
                    {/* <div className="absolute top-0 flex right-0 p-2 bg-primary text-white rounded-tr-xl rounded-bl-xl ">
                    <p className="text-sm font-bold uppercase ">Miễn phí</p>
                  </div> */}
                    <div className="absolute top-0 flex right-0 p-2 bg-cyan-to-lightblue text-white rounded-tr-xl rounded-bl-xl ">
                      <p className="text-sm font-oswald px-1 font-bold uppercase ">
                        29.000đ
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-[41px]">
                    <Link
                      to="/detail"
                      className="text-white text-base-16-20 font-bold t-ellipsis-2 hover:text-primary"
                    >
                      Đập nồi bán sắt đi học
                    </Link>
                  </div>
                </div>
                {hoveredIndex === index && (
                  <div
                    className={`absolute h-[87.5%] effect animate 
                  transition-opacity duration-500 ease-in-out bg-dark-gradient border-0.1 border-primary text-white backdrop-blur rounded-xl top-0 z-50 p-4 min-w-[732px] book-content ${
                    isRightHalf ? "right-0" : "left-0"
                  }`}
                  >
                    <div className="flex justify-between w-full h-full">
                      {!isRightHalf &&
                        aTagContent(
                          "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49435.jpg?v=1&amp;w=350&amp;h=510"
                        )}

                      <div className="w-[63%]">
                        <Link
                          to={"/detail"}
                          className="font-bold text-white-default text-2xl t-ellipsis-2"
                        >
                          Đập nồi bán sắt đi học
                        </Link>
                        <div>
                          <Link to="/detail">
                            <h2 className="mt-4 font-bold text-white-default text-base">
                              Hồng Thứ Bắc
                            </h2>
                          </Link>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <p className="font-bold text-primary text-base">
                              Miễn phí
                            </p>
                          </div>
                          <div className="flex">
                            <div className="flex items-center px-4 py-3 mr-2 rounded-full bg-primary hover:bg-f79">
                              <img
                                src="https://waka.vn/svgs/icon-read-book.svg"
                                alt="icon-read-book"
                                className="cursor-pointer"
                              />
                              <p className="ml-2 text-white-default text-base">
                                Đọc sách
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-background-white text-primary hover:bg-hover-white border-white">
                              <img
                                src="https://waka.vn/svgs/icon-heart.svg"
                                alt="icon-heart"
                                className="cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="max-h-[400px] overflow-hidden">
                          <div className="my-4 text-white font-bold text-sm line-clamp-4">
                            <p>
                              Trong giai đoạn huấn luyện chuẩn bị cho một giải
                              đấu nào đó, cánh truyền thông lần lượt đến phỏng
                              vấn chiến sĩ của các trường. Chương trình được
                              phát sóng trực tiếp trên tinh võng nên khán giả có
                              thể thấy được toàn cảnh tất cả mọi người đang ra
                              sức huấn luyện, tăng cường trọng lực, đánh giáp lá
                              cà, đánh gần rồi cả đánh tầm xa…
                            </p>
                          </div>
                          <a
                            href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                            className="text-primary mt-4 font-bold text-lg"
                          >
                            Chi tiết
                          </a>
                        </div>
                      </div>
                      {isRightHalf &&
                        aTagContent(
                          "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49435.jpg?v=1&amp;w=350&amp;h=510"
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
