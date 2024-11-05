export default function ReadSetting({
  setBackGround,
  setFontSize,
  backGround,
  fontSize,
  setFontFamily,
  fontFamily,
}) {
  return (
    <div className="bg-[#19191c] h-[520px] relative z-10 w-[300px] px-4 py-2">
      <div className="">
        <h1 className="font-bold pb-1">Nền</h1>
        <div className="flex gap-2 border-b-gray-500 border-b-[1px] pb-4">
          <div
            className={`cursor-pointer bg-black w-[70px] h-[40px] rounded-lg ${
              backGround === "#000" ? "border-[4px] border-primary" : ""
            }`}
            onClick={() => setBackGround("#000")}
          ></div>
          <div
            className={`cursor-pointer bg-white w-[70px] h-[40px] rounded-lg ${
              backGround === "#FFFFFF" ? "border-[4px] border-primary" : ""
            }`}
            onClick={() => setBackGround("#FFFFFF")}
          ></div>
          <div
            className={`cursor-pointer bg-[#cfcfcf] w-[70px] h-[40px] rounded-lg ${
              backGround === "#cfcfcf" ? "border-[4px] border-primary" : ""
            }`}
            onClick={() => setBackGround("#cfcfcf")}
          ></div>
          <div
            className={`cursor-pointer bg-[#d5c59f] w-[70px] h-[40px] rounded-lg ${
              backGround === "#d5c59f" ? "border-[4px] border-primary" : ""
            }`}
            onClick={() => setBackGround("#d5c59f")}
          ></div>
        </div>
      </div>
      <div className="pt-2 pb-4 border-gray-500 border-b-[1px]">
        <h1 className="font-bold pb-1">Cỡ chữ</h1>
        <div className="flex items-center justify-center mt-2 gap-2">
          <button
            className={`bg-gray-500 flex-1 px-4 rounded-full flex items-center justify-center ${
              fontSize === "small" ? "bg-primary" : ""
            }`}
            onClick={() => setFontSize("small")}
          >
            Nhỏ
          </button>
          <button
            className={`bg-gray-500 flex-1 px-4 rounded-full flex items-center justify-center ${
              fontSize === "medium" ? "bg-primary" : ""
            }`}
            onClick={() => setFontSize("medium")}
          >
            Vừa
          </button>
          <button
            className={`bg-gray-500 flex-1 px-4 rounded-full flex items-center justify-center ${
              fontSize === "large" ? "bg-primary" : ""
            }`}
            onClick={() => setFontSize("large")}
          >
            Lớn
          </button>
        </div>
      </div>
      <div className="pt-2">
        <h1 className="font-bold pb-1">Kiểu chữ</h1>
        <div className="text-lg flex flex-col gap-3 mt-3">
          <div
            className={`cursor-pointer ${!fontFamily && "text-primary"}`}
            onClick={() => setFontFamily(null)}
          >
            Mặc định
            {
                !fontFamily &&  <i class="fa-solid fa-check ml-2"></i>
            }
      
          </div>
          <div
            className={`cursor-pointer font-times ${
              fontFamily === "Times New Roman" ? "text-primary" : null
            }`}
            onClick={() => setFontFamily("Times New Roman")}
          >
            Times New Roman
            {
                fontFamily === "Times New Roman"  &&  <i class="fa-solid fa-check ml-2"></i>
            }
          </div>
          <div
            className={`cursor-pointer font-poppins ${
              fontFamily === "Poppins" ? "text-primary" : null
            }`}
            onClick={() => setFontFamily("Poppins")}
          >
            Poppins
            {
                fontFamily === "Poppins"  &&  <i class="fa-solid fa-check ml-2"></i>
            }
          </div>
          <div
            className={`cursor-pointer font-arial ${
              fontFamily === "Arial" ? "text-primary" : null
            }`}
            onClick={() => setFontFamily("Arial")}
          >
            Arial
            {
                fontFamily === "Arial"  &&  <i class="fa-solid fa-check ml-2"></i>
            }
          </div>
          <div
            className={`cursor-pointer font-merri ${
              fontFamily === "Merriweather" ? "text-primary" : null
            }`}
            onClick={() => setFontFamily("Merriweather")}
          >
            Merriweather
            {
                fontFamily === "Merriweather"  &&  <i class="fa-solid fa-check ml-2"></i>
            }
          </div>

          <div
            className={`cursor-pointer font-nunito ${
              fontFamily === "Nunito" ? "text-primary" : null
            }`}
            onClick={() => setFontFamily("Nunito")}
          >
            Nunito
            {
                fontFamily === "Nunito"  &&  <i class="fa-solid fa-check ml-2"></i>
            }
          </div>
        </div>

        <div className="flex items-center justify-center mt-2"></div>
      </div>
    </div>
  );
}
