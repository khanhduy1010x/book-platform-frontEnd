export default function CategoryHoverDialog({ title, items }) {
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
                          <a
                            href="/hieu-soi/hien-dai.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Trinh thám - Kinh dị
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/co-dai.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Marketing - Bán hàng
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/huyen-huyen.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Quản trị - Lãnh đạo
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/huyen-huyen.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Quản trị - Lãnh đạo
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/huyen-huyen.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Quản trị - Lãnh đạo
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/huyen-huyen.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Quản trị - Lãnh đạo
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/huyen-huyen.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Quản trị - Lãnh đạo
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/trinh-tham.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Doanh nhân - Bài học kinh doanh
                            </p>
                          </a>
                          <a
                            href="/hieu-soi/dam-my.html"
                            className="rounded-xl hover:bg-background-white py-2 px-3 cursor-pointer"
                          >
                            <p
                              className="font-normal"
                              style={{ fontSize: "15px" }}
                            >
                              Chứng khoán - Bất động sản - Đầu tư
                            </p>
                          </a>
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
  