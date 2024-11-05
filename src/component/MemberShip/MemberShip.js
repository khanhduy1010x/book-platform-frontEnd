export default function MemberShip() {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center py-12 px-4 pt-[72px]">
            <div className="bg-[url('https://waka.vn/target/dist/client/member-package-plan.jpg?v=1729645921556)]"></div>
        <h1 className="text-4xl font-bold mb-2 mt-[20px]">Gói hội viên</h1>
        <p className="text-center text-gray-400 mb-10">
          Nghe và đọc hơn 20,000 nội dung thuộc Kho sách Hội viên (Không bao gồm kho sách Hiệu Số, sách mua lẻ)
        </p>
  
        <div className="w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-4">Mua gói theo tháng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-6 relative rounded-lg border-2 border-primary pt-[45px] flex flex-col">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-sky-500 px-4 py-2 rounded-bl-xl rounded-br-xl inline-block font-bold">
        Top Mua
    </div>              <div className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 3 THÁNG</div>
              <p className="text-2xl font-semibold my-4">99.000đ</p>
              <p className="text-gray-400">1100đ/ngày</p>
              <button className="mt-auto w-full py-2 bg-orange-500 text-white rounded-lg font-semibold ">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 flex flex-col">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 6 THÁNG</p>
              <p className="text-2xl font-semibold my-4">179.000đ</p>
              <button className="mt-auto w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 flex flex-col">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 12 THÁNG</p>
              <p className="text-2xl font-semibold my-4">329.000đ</p>
              <button className="mt-auto w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
          </div>
        </div>
  
        <div className="w-full max-w-6xl mt-10">
          <h2 className="text-xl font-semibold mb-4">Mua gói theo ngày</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col ">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 1 NGÀY</p>
              <p className="text-lg font-semibold my-4">2.000đ</p>
              <button className="mt-auto  w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col ">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 7 NGÀY</p>
              <p className="text-lg font-semibold my-4">7.000đ</p>
              <button className="mt-auto w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col ">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 30 NGÀY</p>
              <p className="text-lg font-semibold my-4">30.000đ</p>
              <button className="mt-auto w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col ">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 3 THÁNG</p>
              <p className="text-lg font-semibold my-4">85.000đ</p>
              <button className="mt-auto w-full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg flex flex-col ">
              <p className="text-xl font-bold"><span className='text-primary'>BOOK4.0</span> / 12 THÁNG</p>
              <p className="text-lg font-semibold my-4">324.000đ</p>
              <button className="mt-auto -full py-2 bg-gray-700 text-white rounded-lg font-semibold">
                Mua gói
              </button>
            </div>
          </div>
        </div>
  
     
      </div>
    )
}