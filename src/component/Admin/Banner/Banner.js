import React, { useEffect, useRef, useState } from "react";
import { useAPI } from "../../Service/APIContext";
import SuccessAddBanner from "../../Shared/SuccessAddBanner";
import { a } from "@react-spring/web";

const AdminBannerManagement = () => {
    const {  getBanners,
        createBanner,
        deleteBanner} = useAPI();
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState(null);
  const inputRef = useRef(null);
  const [successModal, setSuccesModal] = useState(false);
  const [isAdd,setIsAdd] = useState(false);
     useEffect(() => {
        let reset;
      if(successModal){
         reset = setTimeout(() => {
            setSuccesModal(false)
        },3500)
        return () => {
        clearTimeout(reset);
        }
      }
     },[successModal])
        useEffect(() => {
            fetchGetAllBanner();
        },[])
        const fetchGetAllBanner = async () => {
            const resp = await getBanners();
            setBanners(resp)
        }
        const handleAddNewBanner = async () => {
           await createBanner(newBanner);
           await fetchGetAllBanner();
           setIsAdd(true)
           setSuccesModal(true);
           setNewBanner();
        }
        const handleClickInputFile = () => {
            inputRef.current.click();
        }
        const handleDeleteBanner = async (id) => {  
            await deleteBanner(id);
            await fetchGetAllBanner();
            setIsAdd(false);
            setSuccesModal(true);
        }
  return (
    <div className="p-8 min-h-screen relative z-[51] font-oswald">
       {successModal &&  <SuccessAddBanner isAdd={isAdd}/> }
      <h1 className="text-3xl font-bold text-white mb-6">Quản lý Banner</h1>

      {/* Form Thêm Banner */}
      <div className="bg-background-white backdrop-blur p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-white mb-4"        >Thêm Banner</h2>
        <input
             ref={inputRef}
            type="file"
            accept="image/*"
            className="border border-gray-300 hidden rounded-lg p-2 w-full"
            onChange={(e) => setNewBanner(e.target.files[0])}
          />
        <div className="flex items-center  justify-between ">
        <button className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
                    onClick={handleClickInputFile}

            >Chọn hình ảnh</button>
          <button
  

            className="bg-primary text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary bg-blue-500 text-white px-4 py-2 disabled:opacity-70 font-bold rounded-lg disabled:hover:bg-primary disabled:hover:scale-[100%] disabled:hover:text-white "
            disabled={!newBanner}
            onClick={() => {
             handleAddNewBanner();
            }}
          >
            Thêm
          </button>
        </div>
      {newBanner &&   <div className="flex flex-col items-center justify-center">
            <div className="font-bold text-white text-[22px]">
            Xem trước banner 
            </div>
            <div className="w-1/2">
            <img
                  src={URL.createObjectURL(newBanner) || ""}
                  className="w-full rounded-xl h-48 object-fit"
                />
            </div>
        </div>}
      </div>

      {/* Danh sách Banner */}
      <div className="bg-background-white backdrop-blur p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Danh sách Banner</h2>
        {banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={banner.imageURL}
                  alt={`Banner ${banner.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 font-bold right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                        handleDeleteBanner(banner.id)
                    }

                    className="bg-red-500 text-white rounded-xl px-4 py-2 transition-all duration-300 hover:scale-[110%] hover:bg-white hover:bg-red-400"
                  >
                    Xóa
                  </button>
                </div>
                <div className="p-4 text-center">
                  <p className="text-white font-medium">ID: {banner.id}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Chưa có banner nào.</p>
        )}
      </div>
    </div>
  );
};

export default AdminBannerManagement;