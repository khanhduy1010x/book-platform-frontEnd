import Button from "../../Shared/Button/Button";

export default function SocialConnect() {
    return (
        <div className="mt-12">
        <div className="flex items-center justify-between border-b-[1px] border-white pb-4">
            <div className="flex items-center">
            <div className="rounded-full bg-gray-500 flex justify-center items-center w-[40px] h-[40px]">
            <i className="fa-brands fa-facebook-f text-[24px]"></i>
            </div>
            <span className="font-rubik ml-2 font-bold text-[18px]">Facebook</span>
            </div>
            <Button name={"Kết nối"} padding={"px-2 py-1 mr-8"}/>
        </div>
        <div className="flex items-center justify-between mt-4 border-b-[1px] border-white pb-4">
            <div className="flex items-center">
            <div className="rounded-full bg-gray-500 flex justify-center items-center w-[40px] h-[40px]">
            <i className="fa-brands fa-google text-[24px]"></i>
            </div>
            <span className="font-rubik ml-2 font-bold text-[18px]">Google</span>
            </div>
            <Button name={"Kết nối"} padding={"px-2 py-1 mr-8"}/>
        </div>
        </div>
    )
}