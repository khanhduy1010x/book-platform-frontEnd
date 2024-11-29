import { useRef, useEffect } from "react";
export default function SlidebarReading({toc,goToChapter,currentChapter,showSlideBar,bookInfo}) {
    const currentChapterRef = useRef(null);
    useEffect(() => {
    if (currentChapterRef.current) {
        currentChapterRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, [currentChapter]); 
    return (
        <div className="font-oswald">
            {showSlideBar ?  <div className={`h-[calc(100vh-70px)] transition-transform duration-300 ease-in-out transform ${showSlideBar ? "translate-x-0" : "-translate-x-full"} bg-[#29292b] inline-block px-4 max-w-[400px] flex flex-col pb-8 overflow-hidden`}>
                <div className="pb-4">
            <div className="flex border-b border-gray-500 pt-4 pb-4">
<img className="rounded-xl w-[130px]" src={bookInfo?.coverImage}/>
    <div className="px-3 text-left">
    <h1 className="text-white pt-10 text-[20px] font-bold">{bookInfo?.bookName}</h1>
    <p className="font-bold text-white">
    {bookInfo?.author.name}
    </p>
    </div>
            </div>
            </div>
            <div className=" overflow-y-auto add-scrollbar">
                {
                    toc.map((toc) => {
                        const isCurrentChapter = currentChapter === toc.label;
                        return(
                            <div className="py-4 "
                            key={toc.href}
                            ref={isCurrentChapter ? currentChapterRef : null}
                            >
                            <span className={` hover:text-primary ${currentChapter === (toc.label) ? 'text-primary' : 'text-white'}  font-bold cursor-pointer`}  onClick={() => goToChapter(toc.href)}>{toc.label}</span>
                            <br></br>
                            </div>
                        )
                    })
                }
            </div>

            </div> : <div
            className="h-[calc(100vh-70px)] bg-[#29292b] flex items-center text-white"
            > <h1 className="transform -rotate-90 font-bold text-[19px]">Mục lục</h1>
            </div>}
           
        </div>
    )
}