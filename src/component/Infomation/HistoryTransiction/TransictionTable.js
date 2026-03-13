import { useEffect, useState } from "react"
import { useAPI } from "../../Service/APIContext";

export default function TransictionTable({isSelectTab}) {
  const [listTrans, setListTrans] = useState([]);
  const {getTransBuyMemberPack,formatNumber} = useAPI();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([])
  const [totalResult,setTotalResult] = useState(0);

  const size = 5;
 
  
 
  const handlePageChange = async (page) => {
    const num = isSelectTab === "Mua gói cước" ? 0 : isSelectTab === "Mua nội dung" ? 2 : isSelectTab === "Nạp Tiền" ? 1 : 4;
   const resp =  await getTransBuyMemberPack(num, page-1, size);
    setListTrans(resp.listTrans)
    setTotalPages(resp.totalPages || 0);
    setCurrentPage(resp.currentPage || 0);
    setTotalResult(resp.totalRecords || 0)
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
  function formatDateToCustom(isoDate) {
    const date = new Date(isoDate);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  const TransactionType = {
    MEMBER_PACKAGE: "MEMBER_PACKAGE",
    DEPOSIT: "DEPOSIT",
    BUY_BOOK: "BUY_BOOK",
  };
 
  
  function getTransactionDescription(type) {
    switch (type) {
      case TransactionType.MEMBER_PACKAGE:
        return "Mua gói thành viên";
      case TransactionType.DEPOSIT:
        return "Nạp tiền";
      case TransactionType.BUY_BOOK:
        return "Mua nội dung";
      default:
        return "Không xác định";
    }
  }
  
  

  useEffect(() => {
    const fetch = async () => {
      const num = isSelectTab === "Mua gói cước" ? 0 : isSelectTab === "Mua nội dung" ? 2 : isSelectTab === "Nạp Tiền" ? 1 : 4;
        const resp = await getTransBuyMemberPack(num, 0, size);
        setTotalPages(resp.totalPages || 0);
        setCurrentPage(0);
        setTotalResult(resp.totalRecords || 0)
        setPages(generatePages(resp.currentPage, resp.totalPages));
      setListTrans(resp.listTrans)
    }
    fetch();
  },[isSelectTab])

  return (
    <div className="max-w-screen mt-4 font-oswald">
      <div className="mb-3">Tổng giao dịch <span className="text-primary font-bold">"{isSelectTab}"</span>: {totalResult} giao dịch</div>

      {/* Empty state */}
      {(!listTrans || listTrans.length === 0) && (
        <div className="flex flex-col items-center justify-center h-[350px] gap-4 text-gray-500">
          <i className="fa-solid fa-clock-rotate-left text-[64px] text-gray-600"></i>
          <p className="text-[20px] font-oswald">Chưa có giao dịch nào</p>
        </div>
      )}

      {listTrans && listTrans.length > 0 && (
        <>
          <div className="rounded-xl overflow-hidden border border-gray-700 overflow-x-auto">
            <table className="table-auto w-full min-w-[700px] text-left border-collapse text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3 text-center whitespace-nowrap">Thời gian</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Loại giao dịch</th>
                  <th className="px-4 py-3 text-center">Nội dung</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Số dư trước</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Số dư sau</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Số tiền</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">Phương thức</th>
                </tr>
              </thead>
              <tbody>
                {listTrans.slice().reverse().map((item, index) => (
                  <tr key={index} className={`border-t border-gray-700 ${index % 2 === 0 ? "bg-[#1a1a1c]" : "bg-[#111113]"}`}>
                    <td className="px-4 py-3 text-center text-gray-300 whitespace-nowrap border-r border-gray-700">{formatDateToCustom(item?.time)}</td>
                    <td className="px-4 py-3 text-center text-gray-300 border-r border-gray-700">{getTransactionDescription(item?.transactionType)}</td>
                    <td className="px-4 py-3 text-gray-300 border-r border-gray-700">{item?.content}</td>
                    <td className="px-4 py-3 text-center text-gray-300 border-r border-gray-700 whitespace-nowrap">{formatNumber(item?.beforeAmount)}đ</td>
                    <td className="px-4 py-3 text-center text-gray-300 border-r border-gray-700 whitespace-nowrap">{formatNumber(item?.afterAmount)}đ</td>
                    <td className="px-4 py-3 text-center font-bold text-primary border-r border-gray-700 whitespace-nowrap">{formatNumber(item?.priceQR)}đ</td>
                    <td className="px-4 py-3 text-center text-gray-300">{item?.methodType === "WEBSITE" ? "Số dư website" : "Quét Mã QR"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <nav>
              <ul className="flex items-center gap-1">
                <li>
                  <button
                    onClick={() => { if (currentPage !== 0) handlePageChange(currentPage); }}
                    disabled={currentPage === 0}
                    className="disabled:opacity-40 disabled:pointer-events-none px-3 py-1.5 text-sm text-white rounded hover:bg-gray-700 transition"
                  >
                    Previous
                  </button>
                </li>
                {pages.map((page, index) => (
                  <li key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-1.5 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 text-sm rounded transition ${
                          currentPage + 1 === page
                            ? "bg-gray-700 text-primary border border-primary font-bold"
                            : "text-white hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => { if (currentPage !== totalPages - 1) handlePageChange(currentPage + 2); }}
                    disabled={currentPage === totalPages - 1}
                    className="disabled:opacity-40 disabled:pointer-events-none px-3 py-1.5 text-sm text-white rounded hover:bg-gray-700 transition"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
