import AuthorSlider from "./AuthorSlider";

export default function AuthorHome() {

    return (
      <div className="bg-[#121214] pb-32">
   
          <div className="w-full container-block bg-[#121214] pt-[60px] pl-[60px]">
          <div className="flex items-center w-max mb-6">
            <h2 className="text-white text-4xl text-[1.625rem] font-rubik font-bold cursor-pointer">
             Tác giả
            </h2>
          </div>
          <AuthorSlider />
        </div>

      </div>
      
    );
}