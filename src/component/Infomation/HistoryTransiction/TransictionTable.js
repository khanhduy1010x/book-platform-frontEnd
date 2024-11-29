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
    <div className=" max-w-screen mt-4 rounded-xl overflow-hidden font-oswald">
      <div className="mb-3">Tổng giao dịch <span className="text-primary font-bold">"{isSelectTab}"</span>: {totalResult} giao dịch</div>
      <table className="table-auto w-full text-left whitespace-no-wrap border-collapse ">
        <thead>
          <tr className="bg-primary text-white">
          <th className="px-4 py-2  w-[800px] text-center whitespace-nowrap">
              Thời gian 
            </th>
            <th className="px-4 py-2  w-[700px] text-center whitespace-nowrap">
              Loại giao dịch
            </th>
            <th className="px-4 py-2  w-[200px] text-center">
              Nội dung 
            </th>
         
            <th className="px-4 py-2  min-w-[120px] text-center">
              Số dư trước
            </th>
            <th className="px-4 py-2  min-w-[120px] text-center">Số dư sau</th>
         
            <th className="px-4 py-2  min-w-[150px] text-center">
              Số tiền 
            </th>
            <th className="px-4 py-2 whitespace-nowrap  w-[650px] text-center">
              Phương thức
            </th>
           
          </tr>
        </thead>
        <tbody className="text-black">
            {
              listTrans && listTrans?.reverse().map((item, index) => (
                <tr key={index} className="bg-gray-100 border-t border-gray-300">
   <td className="px-4 py-2  w-[350px] break-words  text-center  border-r border-gray-300">
              {formatDateToCustom(item?.time)}
              </td>
              <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              {getTransactionDescription(item?.transactionType)}
              </td>
              
              <td className="px-4 py-2 w-[200px]  max-w-[200px] break-words border-r border-gray-300 float-left">
                    <div className="flex items-center ">
                    {item?.content}

                    </div>
              </td>
              <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
               {formatNumber(item?.beforeAmount)}đ
              </td>
              <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              {formatNumber(item?.afterAmount)}đ


              </td>
              <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              {formatNumber(item?.priceQR)}đ
                

              </td>
              <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
               { item?.methodType === "WEBSITE" ? "Số dư website" : "Quét Mã QR"}
                

              </td>
            
            
           
              </tr>
              ))
            }
            
       
    
        </tbody>
      </table>
      <div className="pagination-controls flex justify-center mt-8">
          <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
              <li>
                <button
                  onClick={() => {
                    if (currentPage === 0) return;
                    handlePageChange(currentPage);
                  }}
                  disabled={currentPage === 0}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-sm text-white transition duration-300 "
                >
                  Previous
                </button>
              </li>

              {pages.map((page, index) => (
                <li key={index} className="mx-1">
                  {page === "..." ? (
                    <span className="px-3 py-1.5 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`relative block rounded bg-transparent px-3 py-1.5 text-sm transition duration-300 ${
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
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-sm text-white transition duration-300 "
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
    </div>
  );
}
