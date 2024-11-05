import Card from "./Card";
import { v4 as uuidv4 } from "uuid";
import CarouselBase from "./Carousel";
import { useScroll } from "@react-spring/web";
import { useEffect, useState } from "react";
import { list } from "@material-tailwind/react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";
export default function Carousel3d({ listBook }) {
  const {bookType} = useParams();
  let books = [];
  const [currentSlide, setCurrentSlide] = useState();
  listBook.forEach((item) => {
    item.listBook.forEach((item) => {
      books.push({ key: item.id, content: <Card book={item} />, book: item });
    })
  });
  useEffect(() => {
    setCurrentSlide(listBook[0]?.listBook[0]?.id);
  }, [listBook]);

  return (
    <div className="mt-10 flex relative z-1">
      <div className="text-white w-full">
        <span className="text-[48px] font-bold font-oswald ">{bookType === "EBOOK" ? 'Sách điện tử' : 'Sách Giấy'}</span>
        {books.map((item, index) => {
          return (
            <div className="mt-5" key={index}>
              {item.book.id === currentSlide && (
                <>
                  <h2 className="text-[28px] mb-3 text-primary font-bold ">
                    {item.book.bookName}
                  </h2>
                  <p className="line-clamp-5 font-rubik">{item.book.description}</p>
                </>
              )}
            </div>
          );
        })}

        <div className="mt-10 flex gap-10 items-center">
          <span className="px-4 py-2 bg-primary font-rubik text-[22px] rounded-full font-bold cursor-pointer hover:scale-110 hover:bg-white hover:text-primary transition-scale ease-in-out duration-200">
            Đọc sách
          </span>
          <i className="fa-regular fa-heart-circle-plus text-[32px] bg-primary p-2 mr-[2px] rounded-full cursor-pointer hover:scale-110 trasition-scale duration-200 ease-in-out hover:bg-white hover:text-primary"></i>
        </div>
      </div>
      <div className="w-full">
        <div className="">
          <CarouselBase
            cards={books}
            setCurrentSlide={setCurrentSlide}
            height="500px"
            width="75%"
            margin="0 auto"
            offset={2}
            showArrows={false}
          />
        </div>{" "}
      </div>
    </div>
  );
}
