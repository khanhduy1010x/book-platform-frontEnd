import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SearchBar from "../../Shared/SearchBar";
import InfoUser from "./InfoUser";
import SuccessChangeInfoUser from "../../Shared/SuccessChangeInfoUser";

const AccountsTable = () => {
  const { getAllAccount, memberMapper,searchAccount,changeRole, changeAccountStatus,getInfoByIDUser } = useAPI();
  const [accounts, setAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectFilter,setIsSelectFilter]= useState(-1)
  const [memberShipCounts, setMemberShipCounts] = useState([]);
  const [roleCounts, setRoleCounts] = useState([]);
  const [isBanneds, setIsBanneds] = useState([]);
  const [currentUser,setCurrentUser] = useState({})
  const [showModalUser,setShowModalUser] = useState(false);
  const [successUpdate, setSuccessUpdate]=useState(false);


  const size = 5;
  const MemberShip = [
    { key: "NONE", num: 0, name: "Chưa đăng kí", count: 0 },
    { key: "BASIC", num: 1, name: "Thành viên bạc", count: 0 },
    { key: "ADVANCE", num: 2, name: "Thành viên vàng", count: 0 },
    { key: "PREMIUM", num: 3, name: "Thành viên kim cương", count: 0 },
  ];
  const Role = [
    { key: "USER", num: 4, name: "Người dùng", count: 0 },
    { key: "ADMIN", num: 5, name: "Quản trị viên", count: 0 },
  ];
  const isBanned = [
    { key: true, num: 7, name: "Đã bị khóa", count: 0 },
    { key: false, num: 8, name: "Hoạt động", count: 0 },
  ];
  useEffect(() => {
    if(isSelectFilter === -1 && searchTerm)return;
    setSearchTerm("");
  },[isSelectFilter])
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if(!searchTerm) {

        const resp = await getAllAccount(isSelectFilter, currentPage, size);
        setAccounts(resp?.accounts || []);
        setCurrentPage(resp?.currentPage)
        setTotalPages(resp?.totalPages || 0);
        setPages(generatePages(currentPage, resp?.totalPages || 0));
        const combinedStatusCounts = MemberShip.map((status) => {
          const countData = resp?.countOrderByPayment?.find(
            (item) => item.memberType === status.key
          );
          return { ...status, count: countData ? countData.count : 0 };
        });
        setMemberShipCounts(combinedStatusCounts);
        const combinedPaymentCounts = Role.map((status) => {
            const countData = resp?.countOrderByRole?.find(
              (item) => item.role === status.key
            );
            return { ...status, count: countData ? countData.count : 0 };
          });
          setRoleCounts(combinedPaymentCounts)
          const combinedisBanneds = isBanned.map((status) => {
            const countData = resp?.listCountByActiveStatus?.find(
              (item) => item.banned === status.key
            );
            return { ...status, count: countData ? countData.count : 0 };
          });
          setIsBanneds(combinedisBanneds);
        }else {
          setIsSelectFilter(-1)
          const resp = await searchAccount(searchTerm)
          setAccounts(resp.accounts || []);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, [isSelectFilter,searchTerm,successUpdate]);

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
    if(successUpdate) {
        reset=setTimeout(() => {
            setSuccessUpdate(false);
        },3500)
    }
    return () => 
clearTimeout(reset)

  },[successUpdate])
  const handleChangeRole = async() => {
    const resp = await changeRole(currentUser.accID);
    if(resp) {
      const resp2 = await getInfoByIDUser(currentUser.accID);
      setCurrentUser(resp2)
    }
    setSuccessUpdate(true);
}
const handleChangeAccountStatus = async() => {
    const resp = await changeAccountStatus(currentUser.accID);
    if(resp) {
      const resp2 = await getInfoByIDUser(currentUser.accID);
      setCurrentUser(resp2)
    }
    setSuccessUpdate(true);

}
  const handlePageChange = async (page) => {
    try {
      const resp = await getAllAccount(isSelectFilter, page - 1, size);
      setAccounts(resp?.accounts || []);
      setCurrentPage(resp?.currentPage || 0);
      setPages(generatePages(resp?.currentPage || 0, resp?.totalPages || 0));
    } catch (error) {
      console.error("Error handling page change:", error);
    }
  };

  return (
    <div className="m-6 font-oswald relative">
                     {successUpdate &&      <SuccessChangeInfoUser/>        }

{showModalUser &&       <InfoUser user={currentUser} handleChangeRole={handleChangeRole} handleChangeAccountStatus={handleChangeAccountStatus} setShowModalUser={setShowModalUser}/>
}
      <h1 className="text-3xl font-bold text-white pb-2">
        Quản lý tài khoản
      </h1>

      {/* Bộ lọc theo vai trò */}
      <div className=" items-center mb-4">
        <div className="flex gap-5 justify-between items-center">
        <div className="grid grid-cols-2 gap-5">
  {memberShipCounts.map((status, index) => (
    <div
      key={index}
      onClick={() => setIsSelectFilter(status.num)}
      className={`font-bold text-[22px] cursor-pointer relative ${
        isSelectFilter === status.num ? "text-primary" : "text-white"
      }`}
    >
      <div className="inline-block relative group">
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
<div>
        <div className="mt-4 flex flex-col gap-5 mb-4">
  <div
    className={`font-bold text-[22px] cursor-pointer text-center relative ${
      isSelectFilter === -1 ? "text-primary" : "text-white"
    }`}
    onClick={() => setIsSelectFilter(-1)}
  >
    <div className="inline-block relative  group text-center">
      Tất cả: {roleCounts.reduce((total, status) => total + status.count, 0)}
      <span
        className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
          isSelectFilter === -1 ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </div>
  </div>
 <div className="flex gap-5">
 {roleCounts.map((status, index) => (
    <div
      key={index}
      onClick={() => setIsSelectFilter(status.num)}
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
 <div className="flex gap-5 justify-between">
 {isBanneds.map((status, index) => (
    <div
      key={index}
      onClick={() => setIsSelectFilter(status.num)}
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
</div>

        </div>
        <div className="text-primary    font-bold text-[20px] mb-4">
<SearchBar
  placeholder={"Tìm theo tên đăng nhập, phone, email, tên ..."}
  setSearchTerm={setSearchTerm}
  searchTerm={searchTerm}
/>
</div>

        {/* Thanh tìm kiếm */}
        {/* <SearchBar
          placeholder="Tìm kiếm tài khoản"
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        /> */}
      </div>

      {/* Bảng tài khoản */}
      <div className="rounded-lg shadow overflow-x-auto">
        <table className="table-fixed min-w-full whitespace-nowrap">
          <thead className="bg-black">
            <tr>
              <th className="px-4 py-2 text-center text-white">Tên đăng nhập</th>
              <th className="px-4 py-2 text-center text-white">Email</th>
              <th className="px-4 py-2 text-center text-white">Số điện thoại</th>
              <th className="px-4 py-2 text-center text-white">Vai trò</th>
              <th className="px-4 py-2 text-center text-white">Loại thành viên</th>
              <th className="px-4 py-2 text-center text-white">Trạng thái</th>
              <th className="px-4 py-2 text-center text-white">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y-2 divide-gray-600">
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <tr key={index}>
                
                  <td className="px-4 py-2 text-center text-white">
                    {account?.username || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                    {account?.email || "Không có"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                    {account?.phone || "Không có"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                    {account?.role === "USER" ? "Người dùng" : "Quản trị viên" || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                    {memberMapper(account?.memberType) || "Chưa đăng kí"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                    {account?.isBanned ? "Đã bị khóa" : "Hoạt động"}
                  </td>
                  <td className="px-4 py-2 text-center text-white">
                  <button className="bg-primary text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
                    onClick={() => {
                      setShowModalUser(true);
                      setCurrentUser(account)}}
                    >
                      <i className="fa-solid fa-wrench"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-white">
                  Không có tài khoản nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Điều hướng trang */}
      {accounts.length > 0 && (
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

export default AccountsTable;
