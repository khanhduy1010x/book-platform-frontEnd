import React, { useEffect, useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SearchBar from "../../Shared/SearchBar";


const TransactionTable = () => {
  const { getAllTransAdmin, searchTrans, formatNumber,formatDate,mapisSelectFilterToVietnamese,getOrderDetail,mapPaymentStatusToVietnamese,searchOrder } = useAPI();
  const [Trans, setTrans] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectFilter, setisSelectFilter] = useState(4);
  const [methodTypeCount, setmethodTypeCount] = useState([]);
  const [transTypeCount, settransTypeCount] = useState([]);
  const size = 5;

  useEffect(() => {
    setSearchTerm("");
  },[isSelectFilter])




  useEffect(() => {
    const fetchTrans = async () => {
        
      try { 
        if(!searchTerm) {
            const resp = await getAllTransAdmin(isSelectFilter, 0, size);    
            setTrans(resp?.listTrans || []);
            setCurrentPage(resp.currentPage)
            setTotalPages(resp?.totalPages || 0);
            setPages(generatePages(currentPage, resp?.totalPages || 0));
    
            
            const combinedtransTypeCount = TransType.map((status) => {
              const countData = resp?.countTransByTransType?.find(
                (item) => item.transactionType === status.key
              );
              return { ...status, count: countData ? countData.count : 0 };
            });
                     settransTypeCount(combinedtransTypeCount)
    
            const combinedmethodTypeCount = methodType.map((status) => {
                const countData = resp?.countTransByMethodTypes?.find(
                  (item) => item.methodType === status.key
                );
                return { ...status, count: countData ? countData.count : 0 };
              });
              setmethodTypeCount(combinedmethodTypeCount); 
        }else {
            const resp = await searchTrans(searchTerm);
            setTrans(resp?.listTrans || []);
        }
      
      
      } catch (error) {
        console.error("Error fetching Trans:", error);
      }
    };
    fetchTrans();
  }, [isSelectFilter]);


  
  const handlePageChange = async (page) => {
    try {
      const resp = await getAllTransAdmin(isSelectFilter,page - 1, size);
      setTrans(resp?.listTrans || []);
      setTotalPages(resp?.totalPages || 0);
      setCurrentPage(resp?.currentPage || 0);
      setPages(generatePages(resp?.currentPage || 0, resp?.totalPages || 0));
    } catch (error) {
      console.error("Error handling page change:", error);
    }
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
  const TransType = [
    { key: "MEMBER_PACKAGE", num: 0, name: "Mua gói", count: 0 },
    { key: "DEPOSIT", num: 1, name: "Nạp tiền", count: 0 },
    { key: "BUY_BOOK", num: 2, name: "Mua sách", count: 0 },
  ];
  const methodType = [
    { key: "QR_CODE", num: 3, name: "Quét Mã", count: 0 },
    { key: "WEBSITE", num: 4, name: "Tiền trên web", count: 0 },
  ];


  
  return (
    <div className="m-6 font-oswald relative">

        <h1 className="text-3xl font-bold text-white border-b border-gray-500 border-b-[2px] pb-2 ">Quản lí đơn hàng</h1>
        <div className="flex justify-between items-center">
        <div className="mt-4 flex gap-5 mb-4">
  <div
    className={`font-bold text-[22px] cursor-pointer relative ${
      isSelectFilter === -1 ? "text-primary" : "text-white"
    }`}
    onClick={() => setisSelectFilter(-1)}
  >
    <div className="group">
      Tất cả: {methodTypeCount.reduce((total, status) => total + status.count, 0)}
      <span
        className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
          isSelectFilter === -1 ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </div>
  </div>
  {methodTypeCount.map((status, index) => (
    <div
      key={index}
      onClick={() => setisSelectFilter(status.num)}
      className={`font-bold text-[22px] cursor-pointer relative ${
        isSelectFilter === status.num ? "text-primary" : "text-white"
      }`}
    >
      <div className="group">
        {status.name} ({status.count})
        <span
          className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
            isSelectFilter === status.num ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </div>
    </div>
  ))}
</div>
<div className="flex gap-5">
{transTypeCount.map((status, index) => (
    <div
      key={index}
      onClick={() => setisSelectFilter(status.num)}
      className={`font-bold text-[22px] cursor-pointer relative ${
        isSelectFilter === status.num ? "text-primary" : "text-white"
      }`}
    >
      <div className="group">
        {status.name} ({status.count})
        <span
          className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
            isSelectFilter === status.num ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </div>
    </div>
  ))}
</div>
</div>
<div className="text-primary    font-bold text-[20px] mb-4">
<SearchBar
  placeholder={"Tìm theo thông tin khách hàng, giao hàng..."}
  setSearchTerm={setSearchTerm}
  searchTerm={searchTerm}
/>
</div>



      

      <div className="rounded-lg shadow overflow-x-auto">
        <table className="table-fixed min-w-full whitespace-nowrap border-collapse">
          <thead className="bg-black">
            <tr>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Mã giao dịch
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Username
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Phương thức 
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Loại giao dịch
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Nội dung
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Số dư trước  
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Số dư sau
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Tiền giao dịch
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Ngày giao dịch 
              </th>
            </tr>
          </thead>
          <tbody className="bg-custom-modal-dark-II backdrop-blur-50 divide-y-2 divide-dashed divide-gray-400">
          {Trans?.map((trans, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-center text-white">{trans?.id || "N/A"}</td>
                <td className="px-4 py-2 text-center text-white">
                  {trans?.account.username || "N/A"}
                </td>
                <td className=" py-2 text-center text-white">
  {trans?.methodType }
</td>
<td className=" py-2 text-center text-white">
  {trans?.transactionType }
</td>
<td className=" py-2 text-center max-w-[150px] text-wrap text-white">
  {trans?.content }
</td>

           
           
                <td className="px-4 py-2 text-center text-white">
                  {formatNumber(trans?.afterAmount) || "0"} đ
                </td>
                <td className="px-4 py-2 text-center text-white">
                  {formatNumber(trans?.beforeAmount) || "0đ"}
                </td>
                <td className=" py-2 text-center text-white">
  {trans?.priceQR == 0 || !trans?.priceQR ? formatNumber(trans?.beforeAmount-trans?.afterAmount) : formatNumber(trans?.priceQR)  }
</td>
                <td className="px-4 py-2 text-center text-white">
                  {formatDate(trans?.time) || "0đ"}
                </td>
            
              </tr>
            ))}
            {Trans.length === 0 && (
              <td
                colSpan={9}
                className="text-center p-4 text-[24px] text-white"
              >
                Không có đơn hàng nào
              </td>
            )}
          </tbody>
        </table>
      </div>

      {Trans.length > 0 && !searchTerm && (
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
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
