import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import AddNewModal from "./AddNewModal";
import UpdateModal from "./UpdateModal";
import SuccessAddBook from "../../Shared/SuccessAddBook";
import SearchBar from "../../Shared/SearchBar";
import { is } from "date-fns/locale";

const TableProduct = () => {
    const {getAllBookForAdmin, formatNumber,searchBookAdmin} = useAPI();
    const [listBook,setListBook] = useState([])
    const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([])
  const [showModalAddNew, setShowModalAddNew] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentBookUpdate, setCurrentBookUpdate] = useState({})
  const [isSelectTab, setIsSelectTab] = useState("Sách giấy")
  const size = 5;
  const [addSs, setAddSs] = useState(false);
  const [updateSs, setUpdateSs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if(!isSelectTab)return;
    setSearchTerm("")

    const fetch = async () => {
      const num = isSelectTab ==="Sách giấy" ? 0 : 1 ;
        const resp = await getAllBookForAdmin(num, 0, size);
        if(!resp) return;
        setTotalPages(resp.totalPages || 0);
        setCurrentPage(0);
        setPages(generatePages(resp.currentPage, resp.totalPages));
        setListBook(resp.listBook)
    }
    fetch();
  },[isSelectTab])
  useEffect(() => {
    const fetch = async () => {
      const num = isSelectTab ==="Sách giấy" ? 0 : 1 ;
        const resp = await getAllBookForAdmin(num, currentPage, size);
        if(!resp) return;
        setTotalPages(resp.totalPages || 0);
        setCurrentPage(resp.currentPage);
        setPages(generatePages(resp.currentPage, resp.totalPages));
        setListBook(resp.listBook)
    }
    fetch();
  },[showModalUpdate,showModalAddNew])


  const handlePageChange = async (page) => {
    const num = isSelectTab ==="Sách giấy" ? 0 : 1 ;
    const resp =  await getAllBookForAdmin(num, page-1, size);
    setListBook(resp.listBook)
    setTotalPages(resp.totalPages || 0);
    setCurrentPage(resp.currentPage || 0);
    setPages(generatePages(resp.currentPage, resp.totalPages));
  
  };

    const generatePages = (currentPage, totalPages) => {
        const visiblePages = 5; 
        let start = Math.max(1, currentPage + 1 - Math.floor(visiblePages / 2)); 
        let end = Math.min(totalPages, start + visiblePages - 1); 
      
        if (end - start + 1 < visiblePages) {
          if (start === 1) {
            end = Math.min(totalPages, visiblePages);
          } else if (end === totalPages) {
            start = Math.max(1, totalPages - visiblePages + 1);
          }
        }
      
        const pages = [];
        if (start > 1) pages.push(1, "..."); 
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (end < totalPages) pages.push("...", totalPages); 
      
        return pages;
      };
      useEffect(() => {
        let reset;
        if(addSs || updateSs ) {
             reset = setTimeout(() => {
                setUpdateSs(false);
                setAddSs(false);

            },3500)
        }
        return () => {
            clearTimeout(reset);
        }
    },[addSs,updateSs])

    useEffect(() => { 
        if(!searchTerm){
            if(!isSelectTab) {
            setIsSelectTab("Sách giấy");
            }
            handlePageChange(1)
         }else {
            setIsSelectTab("");
            const fetchSearch =  async () => {
                const resp = await searchBookAdmin(searchTerm);
                setListBook(resp);
             
        }
        fetchSearch();
        }
      
    },[searchTerm])
  return (
    <div className="m-6 font-oswald relative">
               {addSs && <SuccessAddBook isAddNew={true}/>}
               {updateSs && <SuccessAddBook isAddNew={false}/>}


{ showModalAddNew && <AddNewModal setShowModalAddNew={setShowModalAddNew} setAddSs={setAddSs}/>
}   
{ showModalUpdate && <UpdateModal setShowModalUpdate={setShowModalUpdate} book={currentBookUpdate} setUpdateSs={setUpdateSs}/> }
   <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-4">
        <h1 className="text-4xl font-bold text-white">Tất cả sách</h1>
   
        <button className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
        onClick={() => setShowModalAddNew(true)}
        >
          Thêm sách
        </button>

      </div>
      <div className="text-primary  flex flex-col  font-bold text-[20px] mb-4">
            <div
            className={`cursor-pointer ${isSelectTab !== "Sách giấy"? 'text-white' : ''}`}
            onClick={() => setIsSelectTab("Sách giấy")}>
<div className="">Sách giấy</div>
            </div>
            <div className={`  cursor-pointer  ${isSelectTab == "Sách điện tử"?  'text-primary' : 'text-white'} `}onClick={() => setIsSelectTab("Sách điện tử")}>
            Sách điện tử 
            </div>
<div>
<SearchBar placeholder={"Tìm theo tác giả, tên sách, thể loại... "} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>

</div>
        </div>

        <div className="rounded-lg shadow overflow-x-auto">
  <table className="table-fixed min-w-full whitespace-nowrap border-collapse ">
    <thead className="bg-black">
      <tr>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Bìa
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Tên sách
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Tác giả
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Thể loại
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Kiểu sách
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Giá sách
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">      
          Trạng thái
        </th>
        <th className="px-4 py-2 text-center text-white font-medium uppercase ">
          Thao tác
        </th>
      </tr>
    </thead>
    <tbody className="bg-custom-modal-dark-II backdrop-blur-50 divide-y-2 divide-dashed divide-gray-400 ">
      {listBook.map((product, index) => (
        <tr key={index} className="">
          <td className="px-4 py-2 text-center divide-solid ">
            <img
              src={product.coverImage}
              alt={product.name}
              className="w-12 h-16 object-cover mx-auto rounded"
            />
          </td>
          <td className="px-4 py-2 text-center text-white  truncate max-w-[150px]">
            {product.bookName}
          </td>
          <td className="px-4 py-2 text-center text-white  truncate max-w-[150px]">
            {product.author.name}
          </td>
          <td className="px-4 py-2 text-center text-white  truncate max-w-[150px]">
            {product.category.cateName}
          </td>
          <td className="px-4 py-2 text-center text-white ">
            {product.bookType === "EBOOK" ? 'Sách điện tử' : 'Sách giấy'}
          </td>
          <td className="px-4 py-2 text-center text-white ">
            {formatNumber(product.price)} đ
          </td>
          <td className="px-4 py-2 text-center text-white  truncate max-w-[150px]">
            {product.isVisible ? "Hiện" : "Ẩn"}
          </td>
          <td className="px-4 py-2 text-center text-white ">
          <button className="bg-primary text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
              onClick={() => {
                setShowModalUpdate(true);
                setCurrentBookUpdate(product);
              }}
            >
              <i className="fa-solid fa-wrench"></i>
            </button>
            {/* <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Xóa
            </button> */}
          </td>
        </tr>
      ))}
      {
        listBook.length === 0 && <td colSpan={7} className="text-center p-4 text-[24px] text-white">Không có kết quả nào cho tìm kiếm "<span className="text-red-500">{searchTerm}</span>"</td>
      }
    </tbody>
  </table>
</div>

   {  !searchTerm && <div className="pagination-controls flex justify-center mt-8">
          <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
              <li>
                <button
                  onClick={() => {
                    if (currentPage === 0) return;
                    handlePageChange(currentPage);
                  }}
                  disabled={currentPage === 0}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300 "
                >
                  Previous
                </button>
              </li>

              {pages.map((page, index) => (
                <li key={index} className="mx-1">
                  {page === "..." ? (
                    <span className="px-3 py-1.5 text-white">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`relative block rounded bg-transparent px-3 py-1.5 text-[16px] transition duration-300 ${
                        currentPage + 1 === page
                          ? "bg-neutral-700 text-primary border-primary border font-bold"
                          : "text-surface hover:bg-gray-500 dark:text-white "
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={() => {
                    if (currentPage === totalPages - 1) return;
                    handlePageChange(currentPage + 2);
                  }}
                  disabled={currentPage === totalPages - 1}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300 "
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>}
    </div>
  );
};

export default TableProduct;
