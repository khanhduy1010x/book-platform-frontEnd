import React, { useEffect, useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SearchBar from "../../Shared/SearchBar";
import InfoUserModal from "./InfoUserModal";
import DetailModal from "./DetailModal";
import SuccesChangStatus from "../../Shared/SuccessChangStatus";

const OrdersTable = () => {
  const { getAllOrderForAdmin, searchOrders, formatNumber,formatDate,mapShipStatusToVietnamese,getOrderDetail,mapPaymentStatusToVietnamese,searchOrder } = useAPI();
  const [orders, setOrders] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [shipStatus, setShipStatus] = useState(4);
  const [statusCounts, setStatusCounts] = useState([]);
  const [paymentCounts, setPaymentCounts] = useState([]);

  const [showModalUser,setShowModalUser]=useState(false);
  const [currentInfoUser, setCurrentInfoUser] = useState();
  const [currentOrderDetail,setCurrentOrderDetail]=useState()
  const [showModalOrderDetail, setShowModalOrderDetail] = useState(false);
  const [successUpdate, setSuccessUpdate]=useState(false);
  const size = 5;

  useEffect(() => {
    setSearchTerm("");
  },[shipStatus])

  useEffect(() => {
    let reset;
    if(successUpdate) {
        reset=setTimeout(() => {
            setSuccessUpdate(false);
        },3500)
    }
    return () => 
clearTimeout(reset)

  },[successUpdate])


  const handleViewOrderDetail = async (id) => {
    const resp = await getOrderDetail(id)
    setCurrentOrderDetail(resp);
    setShowModalOrderDetail(true);
  }
  useEffect(() => {
    const fetchOrders = async () => {
     
      try { 
        if(!searchTerm) {
        const resp = await getAllOrderForAdmin(shipStatus, currentPage, size);    
        setOrders(resp?.listOrder || []);
        setTotalPages(resp?.totalPages || 0);
        setPages(generatePages(currentPage, resp?.totalPages || 0));

    
        const combinedStatusCounts = ShipStatus.map((status) => {
          const countData = resp?.countOrderByShip?.find(
            (item) => item.shipStatus === status.key
          );
          return { ...status, count: countData ? countData.count : 0 };
        });
        setStatusCounts(combinedStatusCounts);
        const combinedPaymentCounts = paymentStatus.map((status) => {
            const countData = resp?.countOrderByPayment?.find(
              (item) => item.paymentStatus === status.key
            );
            return { ...status, count: countData ? countData.count : 0 };
          });
          setPaymentCounts(combinedPaymentCounts)
        } else {
            const resp = await searchOrder(searchTerm);
            setOrders(resp);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [shipStatus,successUpdate,searchTerm]);


  
  const handlePageChange = async (page) => {
    try {
      const resp = await getAllOrderForAdmin(shipStatus,page - 1, size);
      setOrders(resp?.listOrder || []);
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
  const ShipStatus = [
    { key: "PENDING", num: 0, name: "Đang chờ xử lí", count: 0 },
    { key: "SHIPPED", num: 1, name: "Đã giao hàng", count: 0 },
    { key: "IN_TRANSIT", num: 2, name: "Đang vận chuyển", count: 0 },
    { key: "DELIVERED", num: 3, name: "Đã giao", count: 0 },
  ];
  const paymentStatus = [
    { key: "PENDING", num: 5, name: "Đang chờ thanh toán", count: 0 },
    { key: "COMPLETED", num: 6, name: "Đã thanh toán", count: 0 },
  ];


  
  return (
    <div className="m-6 font-oswald relative">
               {successUpdate && <SuccesChangStatus/>}
        {showModalOrderDetail && <DetailModal orderDetail={currentOrderDetail} setShowModalOrderDetail={setShowModalOrderDetail} setSuccessUpdate={setSuccessUpdate}/>}
                {showModalUser && <InfoUserModal user={currentInfoUser} setShowModalUser={setShowModalUser}/>}

        <h1 className="text-3xl font-bold text-white border-b border-gray-500 border-b-[2px] pb-2 ">Quản lí đơn hàng</h1>
        <div className="flex justify-between items-center">
        <div className="mt-4 flex gap-5 mb-4">
  <div
    className={`font-bold text-[22px] cursor-pointer relative ${
      shipStatus === 4 ? "text-primary" : "text-white"
    }`}
    onClick={() => setShipStatus(4)}
  >
    <div className="group">
      Tất cả: {statusCounts.reduce((total, status) => total + status.count, 0)}
      <span
        className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
          shipStatus === 4 ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </div>
  </div>
  {statusCounts.map((status, index) => (
    <div
      key={index}
      onClick={() => setShipStatus(status.num)}
      className={`font-bold text-[22px] cursor-pointer relative ${
        shipStatus === status.num ? "text-primary" : "text-white"
      }`}
    >
      <div className="group">
        {status.name} ({status.count})
        <span
          className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
            shipStatus === status.num ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </div>
    </div>
  ))}
</div>
<div className="flex gap-5">
{paymentCounts.map((status, index) => (
    <div
      key={index}
      onClick={() => setShipStatus(status.num)}
      className={`font-bold text-[22px] cursor-pointer relative ${
        shipStatus === status.num ? "text-primary" : "text-white"
      }`}
    >
      <div className="group">
        {status.name} ({status.count})
        <span
          className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
            shipStatus === status.num ? "w-full" : "w-0 group-hover:w-full"
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
                Mã đơn
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Username
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Địa chỉ 
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Tổng tiền
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                TT giao hàng
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                TT thanh toán
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Ngày đặt hàng
              </th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-custom-modal-dark-II backdrop-blur-50 divide-y-2 divide-dashed divide-gray-400">
          {orders?.map((order, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-center text-white">{order?.id || "N/A"}</td>
                <td className="px-4 py-2 text-center text-white">
                  {order?.account.username || "N/A"}<i className="fa-solid fa-circle-info ml-2 cursor-pointer"
                  onClick={() => {
                    setCurrentInfoUser(order.account);
                    setShowModalUser(true);
                  }}
                  ></i>
                </td>
                <td className=" py-2 text-center text-white">
  {order?.shipInfo ? (
    <div className="flex flex-col gap-1  border border-gray-500 rounded-xl">
              <span className="">{order.shipInfo.province}</span>
              <span>{order.shipInfo.district}</span>
              <span>{order.shipInfo.wards}</span>

      <span>{order.shipInfo.shipDetail}</span>
    </div>
  ) : (
    "Chưa cập nhật"
  )}
</td>
           
                <td className="px-4 py-2 text-center text-white">
                  {formatNumber(order?.totalAmountBefore) || "0"} đ
                </td>
                <td className="px-4 py-2 text-center text-white">
                  {mapShipStatusToVietnamese(order?.shipStatus) || "Chưa cập nhật"}
                </td>
                <td className="px-4 py-2 text-center text-white">
                  {mapPaymentStatusToVietnamese(order?.paymentStatus) || "Chưa cập nhật"}
                </td>
                <td className="px-4 py-2 text-center text-white">
                    {formatDate(order?.date)}
                </td>
                <td className="px-4 py-2 text-center text-white">
                <button className="bg-primary text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
                    onClick={() => {
                        handleViewOrderDetail(order.id);
                    }}
                  >
                    <i className="fa-solid fa-wrench"></i>
                  </button>
                 
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <td
                colSpan={8}
                className="text-center p-4 text-[24px] text-white"
              >
                Không có đơn hàng nào
              </td>
            )}
          </tbody>
        </table>
      </div>

      {orders.length > 0 && !searchTerm && (
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

export default OrdersTable;
