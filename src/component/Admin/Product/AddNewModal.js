import React, { useEffect, useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SuccessAddBook from "../../Shared/SuccessAddBook";

const SearchableDropdown = ({
    options,
    selectedValue,
    setSelectedValue,
    placeholder,
    labelKey, 
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const removeDiacritics = (str) => {
        return str
          .normalize("NFD") 
          .replace(/[\u0300-\u036f]/g, "") 
          .toLowerCase(); 
      };
      
      const filteredOptions =
        options.length > 0
          ? options.filter((option) => {
              const label = option?.[labelKey] || "";
              return removeDiacritics(label).includes(removeDiacritics(searchTerm.trim()));
            })
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
  

const AddNewModal = ({setShowModalAddNew,setAddSs}) => {
    const {getAllCate,getAllAuthor,addNewBook} = useAPI();
  const [bookType, setBookType] = useState("PAPERBACK");
  const [memberType, setMemberType] = useState("NONE");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState(false);
  const [author, setAuthor] = useState("");
  const [newAuthor, setNewAuthor] = useState(false);
  const [price, setPrice] = useState(0);
  const [bookName, setBookName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isVisible, setIsVisible] = useState(true);  
  const [error,setError] =useState({})
 
   
  useEffect(() => {
    setPrice(0)
  },[bookType,memberType])

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
    (bookType === "EBOOK" && memberType === "NONE" );

  
    const validation = () => {
      setError();
      let isOk = true;
      if(!bookName) {
        setError((prev) => ({
          ...prev,
          bookName: "Vui lòng không bỏ trống"
        }));        
        isOk=false
      }
      if((newCategory && !category )|| (!newCategory && !category?.cateName )){
        setError((prev) => ({
          ...prev,
          category: "Vui lòng không bỏ trống"
        }));        
        isOk=false
      }
      if((newAuthor && !author )|| (!newAuthor && !author?.cateName )){
        setError((prev) => ({
          ...prev,
          author: "Vui lòng không bỏ trống"
        }));        
        isOk=false
      }
      if(!coverImage){
        setError((prev) => ({
          ...prev,
          coverImage: "Vui lòng không bỏ trống"
        }));        
        isOk=false
      }
      if(!description){
        setError((prev) => ({
          ...prev,
          description: "Vui lòng không bỏ trống"
        }));        
        isOk=false
      }
      return isOk;

    }
    const handleSave = async () => {
      if(!validation) return;
        const formData = new FormData();
        console.log(coverImage)
        console.log(url)
        formData.append("bookName", bookName);
        formData.append("bookType", bookType);
        formData.append("memberType", bookType === "EBOOK" ? memberType : "NONE");
        console.log(price)
        let validPrice = price ? parseFloat(price) : 0
        if(memberType !== "NONE" && bookType === "EBOOK") {
            validPrice=0;
        }
        formData.append("price", validPrice);     
        formData.append("cateName", newCategory ? category : category?.cateName);
        formData.append("author", newAuthor ? author : author?.name);
        formData.append("description", description);
        formData.append("coverImage", coverImage);
        formData.append("isVisible", isVisible);
        
        if (bookType === "EBOOK") {
          formData.append("url", url);
        }
       await addNewBook(formData);
       setAddSs(true);
       setShowModalAddNew(false)
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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6  max-h-screen overflow-y-auto rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Thêm sách mới</h2>

        <div className="mb-4">
          <span className="text-red-500">{error.bookName}</span>
          <label className="block font-medium">Tên sách</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className={`relative mb-4 `}>
  <label
    className={`block font-medium`}
  >
    Loại sách
  </label>
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
        <span className="text-red-500">{error.category}</span>

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
            className="text-primary mt-2"
          >
            {newCategory ? "Chọn danh mục có sẵn" : "Thêm danh mục mới"}
          </button>
        </div>

        <div className="mb-4 relative z-5">
        <span className="text-red-500">{error.author}</span>

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
            className="text-primary mt-2"
          >
            {newAuthor ? "Chọn tác giả có sẵn" : "Thêm tác giả mới"}
          </button>
        </div>
<div className="flex items-center gap-4">
        <div className="mb-4 ">
        <label className="block font-medium">Ảnh bìa</label>
        <span className="text-red-500">{error.coverImage}</span>
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
            src={URL.createObjectURL(coverImage)}
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
        <div>File : {url.name} </div>
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
          <span className="text-red-500">{error.description}</span>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border focus:outline-none	 rounded-lg p-2 w-full"
            rows="4"
          />
        </div>

        <div className="flex justify-end ">
          <div className="flex-1">
          <button
            onClick={() => setShowModalAddNew(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Hủy
          </button>
          </div>
          <div>
          <button
            onClick={handleSave}
            disabled={!(bookName && bookType && category && author && coverImage&& description && (bookType === "EBOOK"  ? memberType : true) &&(bookType === "EBOOK"  ? url : true) )}
           className="bg-primary disabled:hover:bg-primary disabled:hover:opacity-80 hover:border hover:border-primary  disabled:hover:scale-[100%] disabled:hover:text-white disabled:bg-opacity-80 text-white rounded-xl p-2  transition-all px-4 duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
            >
            Thêm mới
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewModal;
