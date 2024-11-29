import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import InfoUserModal from "../Order/InfoUserModal";

const StaticTable = () => {
  const {
    getMostPurchasedBooks,
    getMostReadBooks,
    getMostReader,
    getPayMostUser,
    getRevenueByBook,
    getStatisticsByMembershipPackage,
    getInfoByIDUser
  } = useAPI();

  const [mostPurchasedBooks, setMostPurchasedBooks] = useState([]);
  const [mostReadBooks, setMostReadBooks] = useState([]);
  const [mostReader, setMostReader] = useState([]);
  const [payMostUsers, setPayMostUsers] = useState([]);
  const [revenueByBook, setRevenueByBook] = useState([]);
  const [statisticsByMembership, setStatisticsByMembership] = useState([]);
  const [updatedRevenue ,setUpdatedRevenue ] =useState([])
  const [currentUser, setCurrentUser]=useState();
  const [showModal, setShowModal] = useState();

  const handleSetCurrentUser = async(id) => {
    const resp = await getInfoByIDUser(id);
    setCurrentUser(resp);
    setShowModal(true)
  }
  const [filter, setFilter] = useState({
    statisticType: "MONTH",
    month: 11,
    year: 2024,
    stDate: "2024-11-01",
    edDate: "2024-11-30",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const fetchStatistics = async () => {
    const purchasedBooks = await getMostPurchasedBooks();
    const readBooks = await getMostReadBooks();
    const readers = await getMostReader();
    const payUsers = await getPayMostUser();
    const revenue = await getRevenueByBook({
      ...filter,
      stDate: `${filter.stDate}T00:00:00Z`,
      edDate: `${filter.edDate}T23:59:59Z`,
    });
    const membershipStatistics = await getStatisticsByMembershipPackage({
      memberType: "ADVANCE",
    });

    setMostPurchasedBooks(purchasedBooks || []);
    setMostReadBooks(readBooks || []);
    setMostReader(readers || []);
    setPayMostUsers(payUsers || []);
    setRevenueByBook(revenue || []);
    setStatisticsByMembership(membershipStatistics || []);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);
  useEffect(() => {
    const updatedList = [];

    revenueByBook.forEach((item) => {
      const existingBook = updatedList.find(
        (bookItem) => bookItem.book.id === item.book.id
      );

      if (existingBook) {
        // Nếu sách đã tồn tại, cộng doanh thu vào sách cũ
        existingBook.revenue += item.revenue;
      } else {
        // Nếu sách chưa tồn tại, thêm sách mới vào danh sách
        updatedList.push({ ...item });
      }
    });

    // Cập nhật lại state với danh sách đã được xử lý
    setUpdatedRevenue(updatedList);
  }, [revenueByBook]); 


  return (
    <div className="container mx-auto p-6 relative z-[51]">
    {showModal  && <InfoUserModal setShowModalUser={setShowModal} user={currentUser}/>}
      <h1 className="text-4xl font-extrabold mb-8 text-white">
        Bảng Thống Kê Tổng Hợp
      </h1>

      {/* Bộ lọc */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-black mb-4 relative z-[51]">Bộ Lọc Doanh Thu Theo Sách</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Loại thống kê
            </label>
            <select
              name="statisticType"
              value={filter.statisticType}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="DAYS">Theo ngày</option>
              <option value="MONTH">Theo tháng</option>
              <option value="YEAR">Theo năm</option>
            </select>
          </div>
          {filter.statisticType === "MONTH" && (
            <>
              <div>
                <label className="block text-gray-600 font-medium mb-2">Tháng</label>
                <input
                  type="number"
                  name="month"
                  value={filter.month}
                  onChange={handleFilterChange}
                  min="1"
                  max="12"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">Năm</label>
                <input
                  type="number"
                  name="year"
                  value={filter.year}
                  onChange={handleFilterChange}
                  min="2000"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
          {filter.statisticType === "DAYS" && (
            <>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="stDate"
                  value={filter.stDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="edDate"
                  value={filter.edDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </>
          )}
          {filter.statisticType === "YEAR" && (
            <div>
              <label className="block text-gray-600 font-medium mb-2">Năm</label>
              <input
                type="number"
                name="year"
                value={filter.year}
                onChange={handleFilterChange}
                min="2000"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
        <button
          onClick={fetchStatistics}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Lọc
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Doanh Thu Theo Sách</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {updatedRevenue.map((item, index) => (
            <div key={index} className="bg-gray-100 p-4 shadow rounded-lg">
              <h3 className="font-bold">{item.book.bookName}</h3>
              <p className="text-sm text-gray-500">
                Tác giả: {item.book.author?.name}
              </p>
              <p>Doanh thu: {item.revenue.toLocaleString()} VND</p>
            </div>
          ))}
        </div>
      </div>
      {/* Các thống kê */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Sách Bán Chạy Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostPurchasedBooks.map((item, index) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="font-bold">{item.book.bookName}</h3>
              <p className="text-sm text-gray-500">
                Tác giả: {item.book.author?.name}
              </p>
              <p>Số lượng bán: {item.total_quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Sách Được Đọc Nhiều Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostReadBooks.map((item, index) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg">
              <h3 className="font-bold">{item.book.bookName}</h3>
              <p className="text-sm text-gray-500">
                Tác giả: {item.book.author?.name}
              </p>
              <p>Số lượng người đọc: {item.total_read_user}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Người Dùng Đọc Nhiều Nhất</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mostReader.map((item, index) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg">
              {/* <h3 className="font-bold">{item.acc.fullName}</h3> */}
              <div className="flex gap-3 items-center"><span className="font-bold">ID:</span> {item.accid} <div className=" h-[20px] w-[20px]   bg-gray-500  flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => handleSetCurrentUser(item.accid)}
              >
              <i className="fa-solid fa-info text-white "></i>
                </div></div>
              <p>Tổng số sách đã đọc: {item.totalBooksRead}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default StaticTable;
