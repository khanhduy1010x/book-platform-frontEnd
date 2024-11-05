import { useDebugValue, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";

export default function CategoryHoverDialog({ title, items,listCate,listBookByCateAndBookType}) {
  
    return (
        <div
                    className="w-[620px] absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 ease-in-out backdrop-blur transition-opacity duration-500 text-white bg-background-book rounded-xl"
                    style={{ zIndex: 2188 }}
                  >
                    <div className="popover-body rounded-xl overflow-hidden py-4 pl-4 pr-2">
                      <div
                        className="popover-content"
                        style={{ maxHeight: "66vh", paddingRight: "2px" }}
                      >
                        <p className="font-medium" style={{ fontSize: "19px" }}>
                          {title}
                        </p>
                        <div
                          className="grid grid-cols-4 gap-x-6 pt-2"
                          style={{ maxHeight: "38vh", overflowY: "auto" }}
                        >
                          {listCate && listCate.map((item,index) => (
  <Link
  to={`/type/${title === "Sách điện tử" ? 'EBOOK' : 'PAPERBACK'}/${item.id}`}
  key={index}
  className="rounded-xl flex justify-center hover:bg-background-white py-2 px-3 cursor-pointer"
>
  <p
    className="font-normal"
    style={{ fontSize: "15px" }}
  >
{
  item.cateName
}  </p>
</Link>

                          ))}
                        
                         
                     
                         
                        </div>
                        <div className="w-full border-t my-4"></div>
                        <p className="font-medium" style={{ fontSize: "19px" }}>
                          Khám phá ngay
                        </p>
                        <div className="grid grid-cols-4 gap-x-5 gap-y-2 pt-2 overflow-y-auto">
                          <a
                            href="/moi-nhat"
                            className="rounded-xl p-3 bg-background-white flex gap-3 items-center cursor-pointer"
                          >
                            <img
                              src="https://waka.vn/svgs/icon-sparkles.svg"
                              alt="icon-sparkles"
                              className="min-w-6"
                            />
                            <p
                              className="font-normal"
                              style={{ fontSize: "13px" }}
                            >
                              Sách mới nhất
                            </p>
                          </a>
                          <a
                            href="/sach-mien-phi"
                            className="rounded-xl p-3 bg-background-white flex gap-3 items-center cursor-pointer"
                          >
                            <img
                              src="https://waka.vn/svgs/icon-coin.svg"
                              alt="icon-coin"
                              className="min-w-6"
                            />
                            <p
                              className="font-normal"
                              style={{ fontSize: "13px" }}
                            >
                              Sách miễn phí
                            </p>
                          </a>
                          <a
                            href="/sach-da-hoan"
                            className="rounded-xl p-3 flex bg-background-white gap-3 items-center cursor-pointer"
                          >
                            <img
                              src="https://waka.vn/svgs/icon-oak-inactive.svg"
                              alt="icon-oak-inactive"
                              className="min-w-6"
                            />
                            <p
                              className="font-normal"
                              style={{ fontSize: "13px" }}
                            >
                              Sách đã hoàn
                            </p>
                          </a>
                          <a
                            href="/sach-doc-nhieu"
                            className="rounded-xl p-3 flex bg-background-white gap-3 items-center cursor-pointer"
                          >
                            <img
                              src="https://waka.vn/svgs/icon-open-book.svg"
                              alt="icon-open-book"
                              className="min-w-4"
                            />
                            <p
                              className="font-normal"
                              style={{ fontSize: "13px" }}
                            >
                              Sách đọc nhiều
                            </p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
    );
  }
  