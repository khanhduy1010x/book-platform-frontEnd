import { useEffect, useState } from "react";
import BookSlider from "../HomeBook/BookSlider";
import { Link, useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";

export default function DetailBook() {
  const { getDetailBook, memberMapper,formatNumber} = useAPI();
  const [showMore, setShowMore] = useState(false);
  const [isComment, setIsComment] = useState(true);
  const { id } = useParams();
  
  const [book, setBook] = useState({});
  useEffect(() => {
    const fetchBookDetails = async () => {
      const bookData = await getDetailBook(id);
      setBook(bookData);
    };
    fetchBookDetails();
  }, [id]);
  const StarRating = ({ stars, percentage }) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-yellow-400">
          <span className="invisible">{"★".repeat(5 - stars)}</span>

          {"★".repeat(stars)}
        </div>{" "}
        <div className="w-40 bg-gray-700 h-2 rounded-full">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const Review = ({ avatar, name, date, review, rating }) => {
    return (
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            <span className="text-white font-bold">{name}</span>
          </div>
          <span className="text-gray-400 text-sm">{date}</span>
        </div>
        <p className="text-gray-300 mb-2">{review}</p>
        <div className="flex items-center">
          <div className="text-yellow-400">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="pt-[72px] px-[64px] bg-black w-full">
      <div className="min-h-screen w-full relative pb-[32px]">
        <div className="flex">
          <div className="blur-layer-1 absolute top-[206px] right-1/2 z-0"></div>
          <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
          <div className="flex justify-beetwen mt-3 relative w-[100%]">
            <div className="relative">
              <div className="sticky top-[10%] w-[400px] z-20 mr-15">
                <div className="relative w-full">
                  <div className="pt-[150%] relative rounded-xl overflow-hidden mb-10">
                    <img
                      alt="Nguyện cùng em đi qua gió sương"
                      src={book?.coverImage}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>{" "}
                  <div className="book-border w-full top-0 left-0 absolute h-full"></div>{" "}
                </div>
              </div>
            </div>
            <div className="px-[32px] text-white font-oswald">
              <h2 className="text-white font-bold text-[32px]">
                {book.bookName}
              </h2>
              <div className="flex mt-4">
                <div className="flex items-center mr-6 font-bold">
                  <span className="text-white-50 block mr-1">5.0</span>{" "}
                  <div className="flex items-center justify-center">
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />
                    <img
                      src="https://waka.vn/svgs/icon-star.svg"
                      alt="icon-star"
                      className="cursor-pointer w-4 h-6"
                    />{" "}
                  </div>
                </div>{" "}
                <p className="text-white-50">
                  <span className="text-white-400">・</span>8 đánh giá
                </p>
              </div>
              <div className="font-rubik">
                <a
                  href="/bang-xep-hang?rank_type=week&amp;content_type=book_all"
                  className="bg-pink-950 flex items-center max-w-fit p-2 rounded-full mt-4 mb-2"
                >
                  {" "}
                  <div className="w-12 h-7-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <p className="text-14-14 font-medium text-white-50">#23</p>
                  </div>{" "}
                  <p className="text-pink-500 mx-1 text-14-14">
                    trong Top xu hướng Sách điện tử
                  </p>{" "}
                  <img
                    src="https://waka.vn/svgs/icon-right-pink.svg"
                    alt="icon-right-pink"
                    className="cursor-pointer w-4 h-4"
                  />
                </a>

                <div className="mt-4 z-30 relative ">
                  <div className="">
                    <p className="text-gray-400 text-16-16">Tác giả</p>{" "}
                    <a href="/author/nardia-le-rXL1" className="">
                      <p className="text-white-500 font-bold text-[16px] cursor-pointer mt-[2px]">
                        {book?.author?.name}
                      </p>
                    </a>{" "}
                  </div>{" "}
                  <div className="mt-[16px]">
                    <p className="text-gray-400 text-16">Thể loại</p>{" "}
                    <a
                      href="/ebook/phat-trien-ca-nhan-gGn8W.html"
                      className="max-w-[230px] block"
                    >
                      <p className="text-white-50 text-16-16 cursor-pointer font-bold">
                        {book?.category?.cateName}
                      </p>
                    </a>
                  </div>{" "}
                  <div className="mt-[16px]">
                    <p className="text-gray-400 text-16-16">Kiểu sách</p>{" "}
                    <p className="text-white-50 text-[16px] font-bold">
                     {book.bookType === "EBOOK" ? "Sách điện tử" : "Sách giấy"}
                    </p>
                  </div>{" "}
                  {book?.memberType != "NONE" && book?.bookType === "EBOOK" && (
                    <div className="mt-[16px]">
                      <p className="text-gray-400 text-16-16 ">Gói cước</p>{" "}
                      <p className="text-white-50 text-16-16 font-bold">
                        {memberMapper(`${book?.memberType}`)}
                      </p>
                    </div>
                  )}
                      {book?.memberType === "NONE" && (
                    <div className="mt-[16px]">
                      <p className="text-gray-400 text-16-16 ">{book.bookType === "EBOOK" ? "Giá đọc sách" : "Giá mua sách"}</p>{" "}
                      <p className="text-white-50 text-16-16 font-bold">
                        {book.price > 0 ? formatNumber(book.price) + "đ" : "Miễn phí" }
                      </p>
                    </div>
                  )}
                  
                </div>

                <div className="border-[1px] mt-[24px] border-gray-400 "></div>
              </div>
              <div className="flex justify-around">
            {book.bookType === "EBOOK" ?  ( 

<Link
to={`/epubread/${book.id}`}
className="bg-primary w-[200px] justify-center items-center font-bold hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200 px-2 py-4 text-[20px] mt-[16px] flex rounded-full cursor-pointer">
<i className="fa-duotone mr-2 fa-solid fa-book-open-reader"></i>{" "}
<span>Đọc sách</span>
</Link>
            ) : 
            <div className="bg-primary w-[200px] justify-center items-center font-bold hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200 px-2 py-4 text-[20px] mt-[16px] flex rounded-full cursor-pointer">
            <i className="fa-duotone mr-2 fa-solid fa-book-open-reader"></i>{" "}
            <span>Thêm vào giỏ hàng</span>
          </div>}
               
            
                <div className="flex justify-center mt-[16px] items-center cursor-pointer ">
                  <i className="fa-regular fa-heart-circle-plus text-[32px] bg-gray-500 p-2 rounded-full hover:text-primary  hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200"></i>
                </div>
                <div className="flex justify-center mt-[16px] items-center cursor-pointer ">
                  <i className="fa-duotone fa-solid fa-copy text-[32px] bg-gray-500 p-2 rounded-full hover:text-primary  hover:bg-white hover:text-primary hover:scale-110 transition-scale ease-in-out duration-200"></i>
                </div>
              </div>
              <div className="mt-3 rounded-lg">
                {/* <div className="mb-4">
                  <label className="text-gray-300 font-semibold mb-2 block">
                    Chọn loại sách
                  </label>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md">
                      Sách điện tử
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Sách nói
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Sách giấy
                    </button>
                  </div>
                </div> */}
                {/* <div>
                  <label className="text-gray-300 font-semibold mb-2 block">
                    Chọn nội dung
                  </label>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md">
                      Đầy đủ
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                      Tóm tắt
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="mt-4 text-[24px] font-bold">
                Tóm tắt nội dung
                </div>
              <div
                className={`w-[420px] mt-4${showMore ? "" : " line-clamp-3"}`}
              >
               
               {book?.description}
              </div>
              <span
                className="text-primary cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {!showMore ? "Xem thêm" : "Rút gọn"}
              </span>

              <div className="mt-3 text-[24px]">
                Độc giả nói gì về “Nguyện cùng em đi qua gió sương”
              </div>
              <div className="p-4 bg-gray-900 rounded-lg mt-2 w-[550px]">
                <div>
                  <div className="flex space-x-4 text-green-400 mb-4">
                    <button
                      className={`${
                        isComment
                          ? "border-b-2 border-primary"
                          : "text-gray-400"
                      }`}
                      onClick={() => setIsComment(!isComment)}
                    >
                      Bình luận (5)
                    </button>
                    <button
                      className={`${
                        !isComment
                          ? "border-b-2 border-primary"
                          : "text-gray-400"
                      }`}
                      onClick={() => setIsComment(!isComment)}
                    >
                      Đánh giá & nhận xét (1)
                    </button>
                  </div>
                  {isComment ? (
                    <>
                      <div className="space-y-4">
                        <div className="bg-gray-800 p-4 rounded-lg flex space-x-4">
                          <img
                            src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-white font-bold">
                                chikt***
                              </span>
                              <span className="text-gray-400 text-sm ml-3">
                                2 tuần trước
                              </span>
                            </div>
                            <p className="text-gray-300">
                              Tình cảm cũng bị mù. Chắc phải bỏ ngang quá!
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg flex space-x-4">
                          <img
                            src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-white font-bold">
                                chikt***
                              </span>
                              <span className="text-gray-400 text-sm ml-3">
                                2 tuần trước
                              </span>
                            </div>
                            <p className="text-gray-300">
                              Tình cảm cũng bị mù. Chắc phải bỏ ngang quá!
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg flex space-x-4">
                          <img
                            src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-white font-bold">
                                chikt***
                              </span>
                              <span className="text-gray-400 text-sm ml-3">
                                2 tuần trước
                              </span>
                            </div>
                            <p className="text-gray-300">
                              Tình cảm cũng bị mù. Chắc phải bỏ ngang quá!
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <button className="mt-4 text-center bg-gray-700 text-white py-2 px-6 rounded-lg">
                          Xem thêm
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="text-white text-5xl font-bold">
                            3.0
                          </div>
                          <div>
                            <span className="text-gray-400">1 đánh giá</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <StarRating stars={5} percentage={0} />
                          <StarRating stars={4} percentage={0} />
                          <StarRating stars={3} percentage={100} />
                          <StarRating stars={2} percentage={0} />
                          <StarRating stars={1} percentage={0} />
                        </div>

                        <div className="mt-4">
                          <button className="flex items-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.211 2.789a2.996 2.996 0 00-4.242 0L2.586 13.172a1 1 0 00-.293.707V17a1 1 0 001 1h3.121a1 1 0 00.707-.293l10.383-10.383a2.996 2.996 0 000-4.242zM13.5 3.5a1 1 0 011.415 0l1.086 1.086a1 1 0 010 1.415l-1.793 1.793-2.5-2.5 1.793-1.793a1 1 0 011.415 0zM5.793 14.5H5v-.793l6.793-6.793 2.5 2.5-6.793 6.793z" />
                            </svg>
                            <span>Viết đánh giá</span>
                          </button>
                        </div>

                        <Review
                          avatar="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                          name="Trần Hồng Anh"
                          date="08/09/2024"
                          review="N9 là đội trưởng đội CSHS cơ mà nhỉ, sao cv cũng k ổn mấy mà tc cũng…thế"
                          rating={3}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[24px] font-bold ml-2 mt-4 text-white">
          Có thể bạn thích
        </div>
        {/* <BookSlider/> */}
      </div>
    </div>
  );
}
