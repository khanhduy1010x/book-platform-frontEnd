import BookSlider from "./BookSlider";

export default function BookHome() {
  return (
    <section className="bg-[#121214] w-full container-block pt-[60px] pb-[70px] px-5 sm:px-10 xl:px-[60px]" id="book-library">
      <div className="flex items-end justify-between gap-5 mb-6">
        <div>
          <h2 className="text-white text-[1.625rem] font-rubik font-bold">Sách điện tử miễn phí</h2>
          <p className="text-gray-400 mt-2">Tác phẩm kinh điển với tệp EPUB đọc trực tiếp trên trình duyệt.</p>
        </div>
        <span className="text-primary text-sm whitespace-nowrap">5 cuốn sách</span>
      </div>
      <BookSlider />
    </section>
  );
}
