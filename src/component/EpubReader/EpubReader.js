import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import SlidebarReading from "./SlibarReading";
import ReadSetting from "./ReadSetting";
import { useNavigate, useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";
import PurchaseModal from "./PurchaseModal";
import loadingGif from '../../assets/image/loadingz.gif'
import LoginDialog from "../Shared/Header/LoginDialog";
import PaymentEbook from "../DetailsBook/PaymentEbook";

function EpubReader() {
  const { getDetailBook, bookDetail, isLogin, setModalStatus, showModal, setShowModal,addHistory,getDetailBook2 } = useAPI();
  const [showPaymentModal ,setShowPaymentModal] = useState(false);
  const [bookPayment , setBookPayment] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const [bookInfo, setBookInfo] = useState();
  const { id } = useParams();
  const bookRef = useRef(null);
  const [backGround, setBackGround] = useState("#000");
  const [fontFamily, setFontFamily] = useState("Oswald");
  const [fontSize, setFontSize] = useState("small");
  const [rendition, setRendition] = useState(null);
  const [settingModal, setSettingModal] = useState(false);
  const [toc, setToc] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [showSlideBar, setShowSlideBar] = useState(true);
  const [isOwned, setIsOwned] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [tempProgress, setTempProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0); 
  const [loading, setLoading] = useState(true);
  const isFirst = useRef(true);
  const isFistGoHistory = useRef(true);
  const countRef = useRef(0);
  const [userPercent, setUserPercent] = useState(0);
  const navigate = useNavigate()

 
 useEffect(() => {
  const iframe = bookRef.current.querySelector("iframe");
  if (iframe) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeDoc) {
      iframeDoc.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
              iframeDoc.body.style.userSelect = "none";
      iframeDoc.body.style.webkitUserSelect = "none";
      iframeDoc.body.style.msUserSelect = "none";
      iframeDoc.body.style.mozUserSelect = "none";
              if (iframeDoc.body) {
        iframeDoc.body.addEventListener("contextmenu", (e) => {
          e.preventDefault();
        });
      }
    }
  }
 })
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" || // F12
      (e.ctrlKey && e.shiftKey && e.key === "I") || 
      (e.ctrlKey && e.shiftKey && e.key === "J") || 
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
            navigate('/');

    }
  });
useEffect(() => {
 const fetch = async() => {
  if(isFirst.current) return;
  if(userPercent > 0 && isFistGoHistory.current) {
    console.log("lay duoc readP")
  await mapPercentageToPage(userPercent);
    isFistGoHistory.current=false;
    return;
  }
  if(countRef.current>0){
    addHistory(id,tempProgress);
  }
    countRef.current += 1;
 }
 fetch();

}, [tempProgress,id,userPercent,currentChapter]);

  useEffect(() => {
    setShowModal(false);
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault(); 
    });
    
    const loadBook = async () => {
      try {
        const response = await getDetailBook2(id);
        setBookPayment(await response)
        setIsOwned(await response?.owned);
        setUserPercent(await response.readPercent);
        setBookInfo(await response.book);
        const url = response.book.url;
        const book =  ePub(url);
        await book.ready;
        if (book.locations.total === 0) {
          await book.locations.generate(1024);
        }
        const toc = await book.loaded.navigation;
        setToc(toc.toc);
        const rendition = book.renderTo(bookRef.current, {
          method: "default",
          width: "750px",
          color: "white",
          height: "700px",
          manager: "continuous",
          flow: "paginated",
        });
        setRendition(rendition);

      
        
        rendition.on("relocated", async (location) => {
          const { currentPage, totalPages, progress } = await estimatePages(book, rendition);
          setTotalPages(totalPages);
          setReadingProgress(progress);
          setTempProgress(progress)
          const currentHref = location.start.href;    
          if( !isFirst.current && !response?.owned && (currentHref !== toc.toc[0]?.href && currentHref !== toc.toc[1]?.href   && currentHref !== toc.toc[2]?.href          ) ) {
            setCurrentChapter(toc.toc[0]?.label)
            setTempProgress(0);
            await goToChapter(toc.toc[0]?.href)
            if(!isLogin && response.memberType === "NONE" && response.price === 0) {
              setShowLogin(true)
            }else {
              setShowPurchaseModal(true);
            }
            await rendition.display();
            return;
          }
          const chapter = toc.toc.find((chap) =>
            currentHref.includes(chap.href)
          );
          if (chapter) {
            setCurrentChapter(chapter.label);
          }
            setCurrentPage(currentPage);
     
        });

        await rendition.display();
      } catch (error) {
        console.error("Error loading book:", error);
      }
    };

    loadBook();
  }, [id]);
  console.log(currentPage)
//////Change Chapter
  const goToChapter = async (href) => {
    if (rendition) {
      try {
     await rendition.display(href);
 
      } catch (error) {
        console.error("Error locating page for href:", error);
      }
    }
  };

/////GET CURRENT PAGE AND TOTAL 
async function estimatePages(book, rendition) {
  if (book.locations.total === 0) {
    await book.locations.generate(1024); 
  }
  let currentLocation = rendition.currentLocation();
  if (!currentLocation) return { currentPage: 1, totalPages: 1, progress: 0 };

  
  const totalLocations = book.locations.total;

  
  const currentPage = book.locations.locationFromCfi(currentLocation.start.cfi);

  
  const progress = (currentPage / totalLocations) * 100;

  return {
    currentPage: Math.round(currentPage),
    totalPages: Math.round(totalLocations),
    progress: Math.min(Math.max(progress, 0), 100), 
  };
}



const [filterProgress, setFilterProgress] = useState(0);

useEffect(() => {
  const calculateTotalPages = async () => {
    if (!rendition || !toc) return;

    let totalPageCount = 0;

    for (let i = 0; i < toc.length; i++) {
      const chapter = toc[i];
      try {
        await rendition.display(chapter.href);
        const location = await rendition.currentLocation();
        const chapterTotalPages = location.start.displayed.total;
        totalPageCount += chapterTotalPages;
        console.log(`Chương: ${chapter.label}, Số trang: ${chapterTotalPages}`);
      } catch (error) {
        console.error(`Lỗi khi xử lý chương ${chapter.label}:`, error);
      }

      const progress = ((i + 1) / toc.length) * 100;
      setFilterProgress(progress);
    }

    setTotalPages(totalPageCount);

    console.log(`Tổng số trang toàn bộ ebook: ${totalPageCount}`);
    setLoading(false);
    isFirst.current = false;

    if (userPercent === 0) {
      setCurrentChapter(toc[0].label);
      await goToChapter(toc[0].href);
    }
  };

  calculateTotalPages();
}, [rendition, toc]);

const handleSliderChange = (e) => {
  setTempProgress(parseFloat(e.target.value));
};

const handleSliderMouseUp = async () => {
  setReadingProgress(tempProgress); 
  await mapPercentageToPage(tempProgress); 
};



///NEXT PAGE/ PREV PAGE
  const nextPage = () => {
    if (rendition) {
      rendition
        .next()
        .then(() => {})
        .catch((error) => {
          console.error("Error going to the next page:", error);
        });
    }
  };

  const prevPage = () => {
    if (rendition) {

      rendition
        .prev()
        .then(() => {})
        .catch((error) => {
          console.error("Error going to the previous page:", error);
        });
    }
  };

  useEffect(() => {
    const fontSizesP = {
      small: "16px",
      medium: "22px",
      large: "26px",
    };
    const fontP = fontSizesP[fontSize] || fontSizesP.small;
    const color = backGround === "#000" ? "white" : "black";
    if (rendition) {
      rendition.themes.register("custom", {

        body: {
          "font-family": `${fontFamily} !important`,
          color: `${color} !important`,
          "background-color": `${backGround} !important`,
              "user-select": "none !important", 
    "-webkit-user-select": "none !important", 
    "-ms-user-select": "none !important", 
    "-moz-user-select": "none !important",
        },
        p: {
          "font-size": `${fontP} !important`,
          color: `${color} !important`,
        },
        "h1, h2, h3, h4, h5, h6": {
          "font-size": `${fontSizesP + 4} !important`,
          color: `${color} !important`,
        },
        div: {
          "font-size": `${fontP} !important`,
          color: `${color} !important`,
        },
        a: {
          "font-size": `${fontP} !important`,
          color: `${color} !important`,
        },
      });
      rendition.themes.select("custom");
    }
  }, [rendition, backGround, fontSize, fontFamily]);

  const mapPercentageToPage = async (percentage) => {
    if (!rendition || !toc || toc.length === 0) {
      console.error("Rendition hoặc TOC chưa được khởi tạo!");
      return;
    }
  
    try {
      if (percentage < 1 ) {
        const firstChapterHref = toc[0]?.href;
        setCurrentChapter(toc[0]?.label)
         goToChapter(firstChapterHref)
    
      }  else if (percentage === 100) {
        const totalLocations = rendition.book.locations.total; 
      if (totalLocations > 0) {
        const lastCfi = rendition.book.locations.cfiFromLocation(totalLocations - 1); 
        if (lastCfi) {
          await rendition.display(lastCfi); 
        } else {
          console.error("Không thể tính toán CFI cuối cùng!");
        }
      } else {
        console.error("Không thể xác định tổng số locations!");
      }
      }  else {
        const cfi = rendition.book.locations.cfiFromPercentage(percentage / 100);
        if (cfi) {
          await rendition.display(cfi);
        } else {
          console.error("Không thể tính toán CFI từ phần trăm đã chọn!");
        }
      }
    } catch (error) {
      console.error("Lỗi khi chuyển đến trang dựa trên phần trăm:", error);
    }
  };
  const onClose = () => {
    setShowPurchaseModal(false);
  }

  return (
    <div className="relative"
    onContextMenu={(e) => e.preventDefault()}
    style={{ userSelect: "none" }}
    >
         {showPaymentModal && (
  <div
    id="modal"
    className="fixed inset-0 font-rubik bg-custom-modal-dark text-white bg-opacity-50 z-[9999] flex items-center justify-center"
  >
      <PaymentEbook bookInfo={bookPayment} setShowPaymentModal={setShowPaymentModal} reLoad={true} />
    </div>
)}
      {showModal && (
  <div
    id="modal"
    className="fixed inset-0 font-rubik bg-custom-modal-dark text-white bg-opacity-50 z-[9999] flex items-center justify-center"
  >
    <div className="bg-custom-modal-dark-II backdrop-blur w-[440px] z-1000 relative p-6 rounded-2xl shadow-lg text-center">
      <i
        className="fa-duotone fa-solid fa-octagon-xmark -top-3 -right-3 float-right absolute cursor-pointer"
        onClick={() => {
          setShowModal(false);
        }}
      ></i>
      <LoginDialog setModalStatus={setModalStatus} setShowPaymentModal={setShowPaymentModal} />
    </div>
  </div>
)}
       {loading && (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50">
   <div className="flex items-center flex-col">
   <img src={loadingGif} alt="Loading..." className="object-cover w-[250px] h-[250px]" />
   <div className="text-white font-bold">   {filterProgress.toFixed(0)}%
   </div>
   <div className="w-[70%] h-4 bg-gray-500 rounded-full overflow-hidden mt-2 mb-2">
        <div
          className="h-full bg-pink-200 rounded-full"
          style={{ width: `${filterProgress}%` }}
        ></div>
      </div>
   <div className="text-white font-bold font-oswald"> Đang tải sách...</div>
    </div>  
    </div>
  )}
<div className="max-h-screen overflow-hidden">
      <div className="h-[72px] bg-[#1d1d1f] relative z-2 pt-1 flex items-center justify-center text-white font-bold text-[22px] custom-shadow">
    

        <h1 className="font-oswald">{bookInfo?.bookName}</h1>
        <div className="absolute right-8">
          <i
            className={`fa-duotone fa-solid fa-text-size hover:text-primary font-bold ${
              settingModal ? "!text-primary" : ""
            } cursor-pointer`}
            onClick={() => setSettingModal(!settingModal)}
          ></i>
          <div className="absolute z-10 right-1 rounded-xl overflow-hidden border-gray-500 border-[1px]">
            {settingModal && (
              <ReadSetting
                setBackGround={setBackGround}
                backGround={backGround}
                setFontSize={setFontSize}
                fontSize={fontSize}
                setFontFamily={setFontFamily}
                fontFamily={fontFamily}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="!font-bold relative">
          <div className="relative z-[12]">
        
            <SlidebarReading
              backGround={backGround}
              showSlideBar={showSlideBar}
              toc={toc}
              goToChapter={goToChapter}
              currentChapter={currentChapter}
              bookInfo={bookInfo}
            />
          </div>
          <div
            className=" w-[55px] flex items-center justify-center h-[55px] rounded-t-xl !bg-[#29292b]  absolute bottom-0 -right-6 z-10"
            onClick={() => setShowSlideBar(!showSlideBar)}
          >
            <i
              className={`fa-solid fa-arrow-${
                showSlideBar ? "left" : "right"
              } text-[22px] pl-7 pt-1 font-bold text-white hover:text-primary cursor-pointer`}
            ></i>
          </div>
        </div>
        <div
          className={`flex-1 ${
            backGround === "#000" ? "bg-black" : ""
          } relative w-[100%]` 
        }

        style={backGround !== "#000" ? { backgroundColor: backGround } : undefined}

        >
          
          <div
           onContextMenu={(e) => e.preventDefault()}
           style={{ userSelect: "none" }}
            ref={bookRef}
            className={`flex items-center justify-center pt-10 overflow-hidden`}
          ></div>
          
          <button
            className="absolute rounded-full group w-[50px] h-[50px] flex justify-center items-center top-1/2 border border-white left-2 !bg-[#29292b] text-white "
            onClick={prevPage}
          >
            <i className="fa-solid fa-angles-left text-[24px] group-hover:text-primary"></i>
          </button>
          <button
            className="absolute rounded-full group w-[50px] h-[50px] flex justify-center items-center  border border-white   top-1/2 right-2 !bg-[#29292b] text-white rounded"
            onClick={nextPage}
          >
            <i className="fa-solid fa-angles-right text-[24px] group-hover:text-primary"></i>
          </button>
          <div className="w-[90%]  absolute bottom-4 left-8 right-0">
          <div className="text-white font-oswald text-center">          {tempProgress.toFixed(0)}%
          </div>
          <input type="range"
           min="0"
           max="100"
           value={tempProgress}
           onChange={handleSliderChange}
           onMouseUp={handleSliderMouseUp}
          className={`w-full mx-8 bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
  [&::-webkit-slider-thumb]:w-2.5
  [&::-webkit-slider-thumb]:h-2.5
  [&::-webkit-slider-thumb]:-mt-0.5
  [&::-webkit-slider-thumb]:appearance-none
[&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(0,206,200,1)]
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:transition-all
  [&::-webkit-slider-thumb]:duration-150
  [&::-webkit-slider-thumb]:ease-in-out
  [&::-webkit-slider-thumb]:dark:bg-white
  [&::-webkit-slider-thumb]:!bg-white
  


  [&::-moz-range-thumb]:w-2.5
  [&::-moz-range-thumb]:h-2.5
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:transition-all
  [&::-moz-range-thumb]:duration-150
  [&::-moz-range-thumb]:ease-in-out

  [&::-webkit-slider-runnable-track]:w-full
  [&::-webkit-slider-runnable-track]:h-2
  [&::-webkit-slider-runnable-track]:bg-gray-100
  [&::-webkit-slider-runnable-track]:rounded-full
  [&::-webkit-slider-runnable-track]:bg-slider-track

  [&::-moz-range-track]:w-full
  [&::-moz-range-track]:h-2
  [&::-moz-range-track]:rounded-full`} id="basic-range-slider-usage" aria-orientation="horizontal"
  style={{
    "--slider-progress": `${tempProgress}%`,
    "--progress-color": "#00cec8",
    "--remaining-color": "#808080",
  }}
  />
          </div>
     
        </div>
      </div>
      {showPurchaseModal && (
        <PurchaseModal onClose={onClose} bookInfo={bookInfo} setShowPaymentModal={setShowPaymentModal}/>
      )}


    </div>
 
    </div>
  );
}

export default EpubReader;
