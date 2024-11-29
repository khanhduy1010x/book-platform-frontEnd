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
    <div>
      <div className="bg-book backdrop-blur-50 px-8 py-8 rounded-xl">
        <div className="text-white font-bold text-[28px] ">Lịch sử mua hàng</div>
        {listOrder?.listOrder?.length > 0 &&
          listOrder?.listOrder?.map((item, index) => (
            <div
              key={index}
              className="order-summary my-5 bg-custom-modal-dark backdrop-blur border-white border rounded-lg shadow-lg p-5 min-w-screen"
            >
              <div className="order-header flex justify-between text-sm items-center pb-2 border-b border-gray-700">
                <div>
                  <span className="order-date text-white text-xl font-semibold mr-4">
                    Đơn hàng {formatDate(item.date)}
                  </span>
                  <span className="order-number text-white">#{item.id}</span>
                </div>
                <div className="order-status flex items-center mt-2">
                  <span
                    className={`status-indicator w-2.5 h-2.5 bg-${getStatusColor(
                      item.shipStatus
                    )} rounded-full mr-2 animate-blink`}
                  ></span>
                  <span className={` ${getStatusColor(item.shipStatus) === "orange-500" ? 'text-orange-500' : `text-${getStatusColor(item.shipStatus)}` } `}>
                    {mapShipStatusToVietnamese(item.shipStatus)}
                  </span>
                </div>
              </div>

              <div className="order-item flex mt-5 items-center text-center justify-between pb-4 border-b border-gray-700">
                <div className="item-image w-[80px] h-[120px] mr-3">
                  <img
                    src={item.firstBook?.coverImage}
                    alt="Product Image"
                    className="w-full h-full object-cover rounded-md border border-gray-300"
                  />
                </div>
                <div className="item-details flex flex-col">
                  <span className="item-name text-base text-white mb-1">{item.firstBook?.bookName}</span>
                  {item.totalBook > 0 && (
                    <span className="item-name-more text-gray-500 text-sm">
                      +{item.totalBook - 1} Sản phẩm
                    </span>
                  )}
                </div>
                <div>
                  <span className="item-price text-sm text-gray-400">
                    {formatNumber(item.firstBook?.price) + "đ"}
                  </span>
                </div>
              </div>

              <Link
                to={`order-history/detail/${item.id}`}
                className="detail-order text-primary mt-4 font-semibold flex items-center"
              >
                <span className="fa-sharp-duotone fa-solid fa-memo-circle-info mr-2"></span>
                Xem chi tiết
              </Link>

              <div className="order-total flex justify-end items-center mt-5 text-white">
                <span className="total-text mr-2 mt-1 text-gray-300">Thành tiền:</span>
                <span className="total-amount text-2xl font-bold text-primary">
                  {formatNumber(item.totalAmountBefore)}đ
                </span>
              </div>
            </div>
          ))}

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
    </div>
  );
}
