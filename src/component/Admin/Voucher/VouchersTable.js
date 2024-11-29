import { useEffect, useState } from "react"
import { useAPI } from "../../Service/APIContext"
import SearchBar from "../../Shared/SearchBar";
import AddVoucherModal from "./AddVoucherModal";
import SuccessModal from "../../Shared/SuccessModal";
import UpdateModal from "../Product/UpdateModal";
import EditVoucher from "./EditVoucher";

export default function VouchersTable() {
    const [searchTerm ,setSearchTerm] =useState("")
    const [listVoucher, setListVoucher]=useState([])
    const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] =useState(false)
  const [success,setSuccess]=useState(false);
  const [showModalUpdate, setShowModalUpdate] =useState(false);
  const [currentVoucher, setCurrentVoucher] =useState();

  const [content,setContent] =useState("")
  const size = 5;
    const {formatNumber,getAllVoucherADmin,memberMapper,searchVoucher} =useAPI()

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
      const fetchVouchers = async () => {
        if(searchTerm)return;
        try { 
          const resp = await getAllVoucherADmin( currentPage, size);    
          setListVoucher(resp?.listVoucher || []);
          setTotalPages(resp?.totalPages || 0);
          setPages(generatePages(currentPage, resp?.totalPages || 0));
  
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchVouchers();
    }, [searchTerm,success]);
    const handlePageChange = async (page) => {
      try {
        const resp = await getAllVoucherADmin(page - 1, size);
        setListVoucher(resp?.listVoucher || []);
        setTotalPages(resp?.totalPages || 0);
        setCurrentPage(resp?.currentPage || 0);
        setPages(generatePages(resp?.currentPage || 0, resp?.totalPages || 0));
      } catch (error) {
        console.error("Error handling page change:", error);
      }
    };
  
    useEffect(() => {
      const fetch = async () => {
        const resp = await searchVoucher(searchTerm);
        setListVoucher(resp?.listVoucher || []);
      }
        if(searchTerm) {
          fetch()
        }
    },[searchTerm])

    useEffect(() => {
      let reset; 
      if(success) {
          reset = setTimeout(() => {
            setSuccess(false)
          },3500)
      }
      return () => clearTimeout(reset)
    },[success])
    return (
        <div className="relative z-[60]">
          <div className="z-[999] relative">
          {showModal && <AddVoucherModal setContent={setContent} setSuccess={setSuccess} setShowModal={setShowModal}/>}
          {showModalUpdate && <EditVoucher voucher={currentVoucher} setContent={setContent} setSuccess={setSuccess} setShowModalUpdate={setShowModalUpdate}/>}
          </div>
        {success && <SuccessModal content={"Thêm voucher thành công"}/>}
<div className="rounded-lg  overflow-x-auto font-oswald relative z-[51]">
  <div className="text-white flex items-center justify-between font-bold text-[32px] mb-4">

    <div>Quản lí voucher</div>
    <div className="mr-4">
    <button 
    onClick={() => setShowModal(true)}
    className="bg-primary text-[18px] text-white rounded-xl ml-r p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary">
      Thêm voucher</button></div>
  </div>

  <div className="text-primary    font-bold text-[20px] mb-4">
<SearchBar
  placeholder={"Tìm theo tên voucher"}
  setSearchTerm={setSearchTerm}
  searchTerm={searchTerm}
/>
</div>
  <table className="table-fixed min-w-full whitespace-nowrap  border-collapse rounded-xl overflow-hidden">
    <thead className="">
      <tr>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Tên voucher</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Cho mọi người</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Loại giảm giá</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Giá trị giảm</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Kiểu thành viên</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Giá trị giỏ hàng</th>
        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Mô tả</th>

        <th className="px-4 py-2 text-center bg-black text-white font-medium uppercase">Thao tác</th>
      </tr>
    </thead>
    <tbody className="bg-custom-modal-dark-II backdrop-blur-50 divide-y-2 divide-dashed divide-gray-400">
      {listVoucher &&  listVoucher.map((voucher, index) => (
        <tr key={index}>
          <td className="px-4 py-2 text-center text-white divide-solid">
           {voucher?.voucherName}
          </td>
          <td className="px-4 py-2 text-center text-white truncate max-w-[150px]">
          {voucher?.public ? "Có" : "Không"}
          </td>
          <td className="px-4 py-2 text-center text-white truncate max-w-[150px]">
          {voucher?.discountType === "PERCENTAGE"? "Giảm phần trăm" : "Giảm trực tiếp" }
          </td>
          <td className="px-4 py-2 text-center text-white">
            {voucher?.discountType === "PERCENTAGE"? voucher?.discountValue + "%" : formatNumber(voucher?.discountValue) + "đ"}
          </td>
          <td className="px-4 py-2 text-center text-white truncate max-w-[150px]">
            {memberMapper(voucher?.memberType) || "Không cần thành viên"}
          </td>
        
          <td className="px-4 py-2 text-center text-white">
            {formatNumber(voucher?.minCartValue)}đ
          </td>
          <td className="px-4 py-2 text-center text-white max-w-[150px] text-wrap">
          {voucher?.voucherDescription}
          </td>
          <td className="px-4 py-2 text-center text-white">
            <button
              className="bg-primary text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[110%] hover:bg-white hover:text-primary"
              onClick={() => {
                setCurrentVoucher(voucher)
                setShowModalUpdate(true)
              }}
            >
              <i className="fa-solid fa-wrench"></i>
            </button>
          </td>
        </tr>
      ))}
      {listVoucher.length === 0 && (
        <tr>
          <td colSpan={7} className="text-center p-4 text-[24px] text-white">
            Không có kết quả nào cho tìm kiếm "
            <span className="text-red-500">{searchTerm}</span>"
          </td>
        </tr>
      )}
    </tbody>
  </table>
{!searchTerm &&   <div className="pagination-controls flex justify-center mt-8">
          <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
              <li>
                <button
                  onClick={() => {
                    if (currentPage === 0) return;
                    handlePageChange(currentPage);
                  }}
                  disabled={currentPage === 0}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300"
                >
                  Previous
                </button>
              </li>

              {pages?.map((page, index) => (
                <li key={index} className="mx-1">
                  {page === "..." ? (
                    <span className="px-3 py-1.5 text-white">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`relative block rounded bg-transparent px-3 py-1.5 text-[16px] transition duration-300 ${
                        currentPage + 1 === page
                          ? "bg-neutral-700 text-primary border-primary border font-bold"
                          : "text-surface hover:bg-gray-500 dark:text-white"
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
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>}
</div>


        </div>
    )
}