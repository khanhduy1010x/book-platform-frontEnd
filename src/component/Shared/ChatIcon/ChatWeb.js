import { Link } from "react-router-dom"
export default function ChatWeb() {
    return (
        <Link to="chat">
        <div className="fixed right-10 bottom-[6%] z-[100] text-center">
       <div className="p-2 text-white bg-primary w-[50px] h-[50px] rounded-2xl">
            <div>
            <i className="fa-solid fa-message-lines text-[32px]"></i>
            </div>
            </div>
            </div>
            </Link>
    );
}