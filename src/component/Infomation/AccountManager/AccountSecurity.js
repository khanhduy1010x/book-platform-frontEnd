export default function AccountSecurity({infoUser}) {
    return (
      <div className="mt-6">
        <div className="border-b border-gray-500 pb-2">
        <div className="flex relative">
              <input
              defaultValue={"maill"}
                readOnly
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl  bg-[#2a2a2c] text-gray-300"
              />
              <span className="absolute font-bold  text-[12px] left-[15px] text-gray-500 top-1">
                Email
              </span>
            </div>
            <div className=" font-rubik text-primary text-[14px] ml-1 mt-2">Đã xác thực</div>
            </div>
            <div className="border-b border-gray-500 pb-2">
        <div className="flex relative mt-4">
              <input
              defaultValue={infoUser.phone}
                readOnly
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl  bg-[#2a2a2c] text-gray-300"
              />
              <span className="absolute font-bold  text-[12px] left-[15px] text-gray-500 top-1">
                Số điện thoại
              </span>
            </div>
            <div className=" font-rubik text-primary text-[14px] ml-1 mt-2">Đã xác thực</div>
            </div>
            <div className="border-b border-gray-500 pb-2">
        <div className="flex relative mt-4">
              <input
              defaultValue={"0848150667"}
                readOnly
                className="px-4 pb-2 border pt-5 flex-1 border-gray-300 rounded-xl  bg-[#2a2a2c] text-gray-300"
              />
              <span className="absolute font-bold  text-[12px] left-[15px] text-gray-500 top-1">
                Số điện thoại
              </span>
            </div>
            <div className=" font-rubik text-primary text-[14px] ml-1 mt-2">Đã xác thực</div>
            </div>
            <div className="font-rubik font-bold mt-4">Bạn không có nhu cầu sử dụng tài khoản nữa? <span className="text-red-500 cursor-pointer">Xóa tài khoản</span></div>
            </div>
    )
}