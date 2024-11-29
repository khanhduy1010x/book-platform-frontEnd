import React, { useEffect, useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";

const SearchableDropdown = ({
    options,
    selectedValue,
    setSelectedValue,
    placeholder,
    labelKey, // Prop bổ sung để xác định thuộc tính hiển thị
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const filteredOptions =
      options.length > 0
        ? options.filter((option) =>
            option?.[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];
  
    const handleSelect = (value) => {
      setSelectedValue(value);
      setShowDropdown(false);
      setSearchTerm("");
    };
  
    return (
      <div className="relative">
        <div
          className="border rounded-lg p-2 w-full bg-white cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedValue?.[labelKey] || placeholder || "Chọn..."}
        </div>
        {showDropdown && (
          <div className="absolute bg-white border rounded-lg mt-1 max-h-60 w-full overflow-y-auto z-10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-full border-b outline-none"
              placeholder="Tìm kiếm..."
            />
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    selectedValue?.[labelKey] === option[labelKey]
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {option[labelKey]}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </div>
    );
  };
  

const UpdateModal = ({setShowModalUpdate, book,setUpdateSs}) => {
    const {getAllCate,getAllAuthor,updateBook} = useAPI();
  const [bookType, setBookType] = useState(book.bookType);
  const [memberType, setMemberType] = useState(book.memberType);
  const [category, setCategory] = useState(book.category);
  const [newCategory, setNewCategory] = useState(false);
  const [author, setAuthor] = useState(book.author);
  const [newAuthor, setNewAuthor] = useState(false);
  const [price, setPrice] = useState(book.price);
  const [bookName, setBookName] = useState(book.bookName);
  const [description, setDescription] = useState(book.description);
  const [coverImage, setCoverImage] = useState(book.coverImage);
  const [url, setUrl] = useState(book.url);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isVisible, setIsVisible] = useState(book.isVisible);
  console.log(isVisible)
    useEffect(() => {
     const fetch = async() => {
        const resp = await getAllCate();
        setCategories(resp);
        const resp2 = await getAllAuthor();
        setAuthors(resp2);
     }
     fetch()
    },[])
  const isPriceRequired =
    bookType === "PAPERBACK" ||
    (bookType === "EBOOK" && memberType === "NONE" && price !== "0");

  

    const handleSave = async () => {
        const formData = new FormData();
      
        formData.append("id", book.id);
        formData.append("bookName", bookName);
        formData.append("bookType", bookType);
        formData.append("memberType", bookType === "EBOOK" ? memberType : "NONE");
        console.log(price)
        const validPrice = price ? parseFloat(price) : 0;
        formData.append("price", validPrice);     
        formData.append("cateName", newCategory ? category : category?.cateName);
        formData.append("author", newAuthor ? author : author?.name);
        formData.append("description", description);
        formData.append("isVisible", isVisible ? "true" : "false");
        if(coverImage !== book.coverImage) {
            formData.append("coverImage", coverImage);


        }
        if (bookType === "EBOOK" && url != book.url) {
          formData.append("url", url);
        }
       await updateBook(formData);
       setShowModalUpdate(false);
       setUpdateSs(true);
      };
      const fileInputRef = useRef(null);
      const inputURLRef= useRef(null);
      const handleButtonClick = () => {
        fileInputRef.current.click(); 
      };
      const handleButtonClickUrlBook =() => {
        inputURLRef.current.click(); 

      }
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-h-calc-30px overflow-y-auto shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Cập nhật sách</h2>

        <div className="mb-4">
          <label className="block font-medium">Tên sách</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Loại sách</label>
          <select
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            className="border rounded-lg p-2 w-full"
          >
            <option value="PAPERBACK">Sách giấy</option>
            <option value="EBOOK">Sách điện tử</option>
          </select>
        </div>
        {bookType === "EBOOK" && (
          <div className="mb-4">
            <label className="block font-medium">Kiểu thành viên</label>
            <select
              value={memberType}
              onChange={(e) => setMemberType(e.target.value)}
              className="border rounded-lg p-2 w-full"
            >
              <option value="NONE">Không kiểu thành viên</option>
              <option value="BASIC">Thành viên bạc</option>
              <option value="ADVANCE">Thành viên vàng</option>
              <option value="PREMIUM">Thành viên kim cương</option>
            </select>
          </div>
        )}
        {isPriceRequired && (
         <div className="mb-4">
         <label className="block font-medium">Giá</label>
         <input
           type="text"
           value={new Intl.NumberFormat("vi-VN").format(price || 0)} 
           onChange={(e) => {
             const rawValue = e.target.value.replace(/[^0-9]/g, ""); 
             setPrice(rawValue); 
           }}
           className="border rounded-lg p-2 w-full"
         />
       </div>
        )}

     

        <div className="mb-4 relative z-10">
          <label className="block font-medium">Danh mục</label>
          {newCategory ? (
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg p-2 w-full"
              placeholder="Nhập danh mục mới"
            />
          ) : (
            <SearchableDropdown
              options={categories}
              selectedValue={category}
              setSelectedValue={setCategory}
              placeholder="Chọn danh mục..."
              labelKey="cateName"
            />
          )}
          <button
            onClick={() => setNewCategory(!newCategory)}
            className="text-blue-500 mt-2"
          >
            {newCategory ? "Chọn danh mục có sẵn" : "Thêm danh mục mới"}
          </button>
        </div>

        <div className="mb-4 relative z-5">
          <label className="block font-medium">Tác giả</label>
          {newAuthor ? (
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border rounded-lg p-2 w-full"
              placeholder="Nhập tác giả mới"
            />
          ) : (
            <SearchableDropdown
              options={authors}
              selectedValue={author}
              setSelectedValue={setAuthor}
              placeholder="Chọn tác giả..."
              labelKey="name"

            />
          )}
          <button
            onClick={() => setNewAuthor(!newAuthor)}
            className="text-blue-500 mt-2"
          >
            {newAuthor ? "Chọn tác giả có sẵn" : "Thêm tác giả mới"}
          </button>
        </div>

        <div className="flex items-center gap-4">
        <div className="mb-4 ">
        <label className="block font-medium">Ảnh bìa</label>
<div className="w-[90px] h-[60px] flex items-center">
        <button
          type="button"
          onClick={handleButtonClick}
          className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary hover:border hover:border-primary"
        >
          Thêm ảnh
        </button>
        </div>  
        <input
          type="file"
          accept=".jpg, .jpeg, .png" 
          ref={fileInputRef}
          onChange={(e) => setCoverImage(e.target.files[0])}
          className="hidden"
        />
      </div>

      {coverImage && (
        <div className="mt-4">
          <img
            src={book.coverImage  === coverImage ? book.coverImage :  URL.createObjectURL(coverImage)}
            alt="Preview"
            className="w-16 h-22 object-cover rounded-md shadow-md"
          />
        </div>
      )}
              

      </div>

        { bookType === "EBOOK" &&  <div className="mb-4">
          <label className="block font-medium">File sách</label>
          <div className="w-[120px] h-[60px] flex items-center">

          <button
          type="button"
          onClick={handleButtonClickUrlBook}
          className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary hover:border hover:border-primary"
        >
          Thêm file sách
        </button>
        </div>
        <div>File : {url === book.url ? url : url.name} </div>
          <input
          ref={inputURLRef}
            type="file"
            accept=".epub" 
            onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                
                  setUrl(e.target.files[0]); 
                } else {
                  console.log("Không có file nào được chọn.");
                }
              }}            className="border hidden rounded-lg p-2 w-full"
            placeholder="Nhập URL ảnh bìa"
          />
        </div>}
        <div className="mb-4">
  <label className="block font-medium">Hiển thị sách</label>
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={isVisible}
      onChange={(e) => setIsVisible(e.target.checked)}
      className="mr-2"
    />
    <span>{isVisible ? "Hiển thị" : "Ẩn"}</span>
  </div>
</div>
        <div className="mb-4">
          <label className="block font-medium">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg focus:outline-none p-2 w-full"
            rows="4"
          />
        </div>

        <div className="flex justify-end">
          <div className="flex-1">
          <button
            onClick={() => setShowModalUpdate(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Hủy
          </button>
          </div>
          <div>
          <button
            onClick={handleSave}
            disabled={!(bookName && bookType && category && author && coverImage&& description && (bookType === "EBOOK"  ? memberType : true) &&(bookType === "EBOOK"  ? url : true) )}

            className="bg-primary disabled:hover:bg-primary disabled:hover:opacity-80 hover:border hover:border-primary  disabled:hover:scale-[100%] disabled:hover:text-white disabled:bg-opacity-80 text-white rounded-xl p-2 disabled: transition-all px-4 duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
            >
            Lưu
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
