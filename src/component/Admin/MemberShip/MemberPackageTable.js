import React, { useEffect, useState } from "react";
import { useAPI } from "../../Service/APIContext"; 
import SearchBar from "../../Shared/SearchBar";
import AddMemberPkg from "./AddMemberPkg";
import SuccessModal from "../../Shared/SuccessModal";
import EditPkg from "./EditPkg";

const MemberPackageTable = () => {
  const { getAllMemberPackageAdmin, searchMembershipPackages, formatNumber,memberMapper } = useAPI(); 
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState([]);
  const [isSelectFilter , setIsSelectFilter] = useState(-1);
  const [membersShip, setMembersShip]=useState([]);
  const [showModalAdd, setShowModalAdd] =useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [success, setSuccess] = useState(false);
  const [content,setContent] = useState("")
  const [currentPkg, setCurrentPkg]=useState()
  const size = 5;

  useEffect(() => {
    const fetchPackages = async () => {
        try {
            const response = await getAllMemberPackageAdmin(isSelectFilter,currentPage, size); 
            setPackages(response?.membershipPackages || []);
            setTotalPages(response?.totalPages || 0);
            setPages(generatePages(currentPage, response?.totalPages || 0));
            const combinedStatusCounts = MemberShip.map((status) => {
              const countData = response?.listMemberByType?.find(
                (item) => item.memberType === status.key
              );
              return { ...status, count: countData ? countData.count : 0 };
            });
            setMembersShip(combinedStatusCounts);
          
        } catch (error) {
          console.error("Error fetching membership packages:", error);
        }
      };
          fetchPackages();
  }, [isSelectFilter,currentPage,success]);
  const handleFilterChange = (filter) => {
    setIsSelectFilter(filter); 
    setCurrentPage(0); 
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

  const handlePageChange = async (page) => {
    if (page === "...") return;
    setCurrentPage(page - 1);
  };
  const MemberShip = [
    { key: "BASIC", num: 1, name: "Thành viên bạc", count: 0 },
    { key: "ADVANCE", num: 2, name: "Thành viên vàng", count: 0 },
    { key: "PREMIUM", num: 3, name: "Thành viên kim cương", count: 0 },
  ];
  useEffect(() => {
    let reset;
    if(success) {
        reset = setTimeout(() => {
setSuccess(false);
        },3500)
    }
    return () => 
        clearTimeout(reset)
  },[success])

  return (
    <div className="m-6 font-oswald relative">
        {success && <SuccessModal content={content}/>}
        {showModalAdd && <AddMemberPkg setShowModalAdd={setShowModalAdd} setSuccess={setSuccess} setContent={setContent}/>}
        {showModalEdit && <EditPkg setShowModalEdit={setShowModalEdit} setSuccess={setSuccess} setContent={setContent} pkg={currentPkg}/>}

        <div className="border-b border-gray-500 flex pb-2 justify-between">
      <h1 className="text-3xl font-bold text-white  ">
        Quản lý Membership Package
      </h1>
      <button className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
      onClick={() => setShowModalAdd(true)}
      >Thêm gói mới</button>
      </div>
<div>
    <div className="flex items-center gap-5 my-4">
    <div
      onClick={() => handleFilterChange(-1)}
            className={`font-bold text-[22px] cursor-pointer relative ${
        isSelectFilter === -1 ? "text-primary" : "text-white"
      }`}
    >
      <div className="inline-block relative group">
        Tất cả: {membersShip.reduce((total, status) => total + status.count, 0)}
        <span
          className={`absolute left-0 bottom-0 h-[2px] bg-primary transition-all duration-[500ms] ease-out ${
            isSelectFilter === -1 ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </div>
    </div>
{membersShip.map((status, index) => (
    <div
      key={index}
      onClick={() => handleFilterChange(status.num)}
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
</div>

      <div className="rounded-lg shadow overflow-x-auto">
        <table className="table-fixed min-w-full whitespace-nowrap border-collapse">
          <thead className="bg-black">
            <tr>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">ID</th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">Tên gói</th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">Giá</th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">Loại</th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">Thời hạn</th>
              <th className="px-4 py-2 text-center text-white font-medium uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y-2 divide-gray-600">
            {packages?.map((pkg, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-center text-white">{pkg.id || "N/A"}</td>
                <td className="px-4 py-2 text-center text-white">{pkg.packageName || "N/A"}</td>
                <td className="px-4 py-2 text-center text-white">{formatNumber(pkg.price) || "0"} đ</td>
                <td className="px-4 py-2 text-center text-white">{memberMapper(pkg.memberType) || "N/A"}</td>
                <td className="px-4 py-2 text-center text-white">{pkg.durationDays || "0"} ngày</td>
                <td className="px-4 py-2 text-center text-white">
                <button className="bg-primary text-white rounded-xl py-2 px-4 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
                  onClick={(e) => 
                {    setCurrentPkg(pkg)
                    setShowModalEdit(true)}}
                  >
                    <i className="fa-solid fa-wrench"></i>
                  </button>
                
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-[24px] text-white">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {packages.length > 0  && (
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

export default MemberPackageTable;
