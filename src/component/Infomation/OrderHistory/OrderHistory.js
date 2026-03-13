import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";

export default function OrderHistory({ currentPage,setCurrentPage }) {
  const {
    getAllOrder,
    formatDate,
    mapShipStatusToVietnamese,
    formatNumber,
    getStatusColor,
    listOrder
  } = useAPI();


  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([])

  const size = 3;


  useEffect(() => {
    getAllOrder(currentPage , size);
        setTotalPages(listOrder.totalPages || 0);
      setCurrentPage(listOrder.currentPage || 0);
  }, []);

  useEffect(() => {
    setTotalPages(listOrder.totalPages || 0);
    setCurrentPage(listOrder.currentPage || 0);
    setPages(generatePages(currentPage, listOrder.totalPages));
  },[listOrder,currentPage])
 
  const handlePageChange = (page) => {
    getAllOrder(page-1 , size);
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
  
  

  return (
    <div className="px-3 sm:px-8 py-8">
      <div className="text-white font-bold text-[28px] mb-4">Lịch sử mua hàng</div>

      {/* Empty state */}
      {(!listOrder?.listOrder || listOrder.listOrder.length === 0) && (
        <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-gray-500">
          <i className="fa-solid fa-box-open text-[64px] text-gray-600"></i>
          <p className="text-[20px] font-oswald">Bạn chưa có đơn hàng nào</p>
          <Link to="/" className="mt-2 px-6 py-2 bg-primary rounded-full text-white text-[14px] font-bold hover:scale-105 transition-transform duration-200">
            Mua sắm ngay
          </Link>
        </div>
      )}

      {listOrder?.listOrder?.length > 0 &&
        listOrder?.listOrder?.map((item, index) => (
          <div key={index} className="my-5 border border-gray-700 rounded-xl p-5">
            <div className="flex flex-wrap justify-between text-sm items-center pb-3 border-b border-gray-700 gap-2">
              <div>
                <span className="text-white text-xl font-semibold mr-4">
                  Đơn hàng {formatDate(item.date)}
                </span>
                <span className="text-gray-400">#{item.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 bg-${getStatusColor(item.shipStatus)} rounded-full animate-blink`}></span>
                <span className={`${getStatusColor(item.shipStatus) === "orange-500" ? "text-orange-500" : `text-${getStatusColor(item.shipStatus)}`}`}>
                  {mapShipStatusToVietnamese(item.shipStatus)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap mt-4 items-center justify-between pb-4 border-b border-gray-700 gap-2">
              <div className="flex items-center gap-4">
                <div className="w-[70px] h-[105px] shrink-0">
                  <img
                    src={item.firstBook?.coverImage}
                    alt="Product"
                    className="w-full h-full object-cover rounded-md border border-gray-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-[15px] font-semibold">{item.firstBook?.bookName}</span>
                  {item.totalBook > 1 && (
                    <span className="text-gray-500 text-sm">+{item.totalBook - 1} sản phẩm khác</span>
                  )}
                </div>
              </div>
              <span className="text-gray-400 text-sm">{formatNumber(item.firstBook?.price)}đ</span>
            </div>

            <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
              <Link
                to={`/info/order-history/detail/${item.id}`}
                className="text-primary font-semibold flex items-center gap-2 hover:underline"
              >
                <i className="fa-sharp-duotone fa-solid fa-memo-circle-info"></i>
                Xem chi tiết
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Thành tiền:</span>
                <span className="text-2xl font-bold text-primary">{formatNumber(item.totalAmountBefore)}đ</span>
              </div>
            </div>
          </div>
        ))}

      {listOrder?.listOrder?.length > 0 && (
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
      )}
    </div>
  );
}
