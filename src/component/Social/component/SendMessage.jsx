
export default function SendMessage({handleSendMessage}) {
  
  return (
    <>
       <div className="flex justify-between w-full gap-4">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="w-[60px] h-[60px] bg-blue-500 flex items-center justify-center text-white border rounded-lg shadow-lg transition-transform duration-300 hover:bg-blue-400 hover:scale-105"
                >
                  <i className="fad fa-paper-plane text-black"></i>
                </button>
              </div>
    </>
  );
}