import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";

import SlidebarReading from "./SlibarReading";
import ReadSetting from "./ReadSetting";
import { useParams } from "react-router-dom";
import { useAPI } from "../Service/APIContext";

function EpubReader() {
    const {getDetailBook} = useAPI();
    const [bookInfo, setBookInfo] = useState();
    const {id} = useParams();
  const bookRef = useRef(null);
  const [backGround, setBackGround] = useState("#000");
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("small");
  const [rendition, setRendition] = useState(null);
  const [settingModal, setSettingModal] = useState(false);
  const [toc, setToc] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [showSlideBar, setShowSlideBar] = useState("");
  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await getDetailBook(id);
        setBookInfo(response)
        const url = response.url;
        const book = ePub(url); 
        await book.ready;
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
        rendition.on("relocated", (location) => {
          const currentHref = location.start.href;
          const chapter = toc.toc.find((chap) =>
            currentHref.includes(chap.href)
          );
          if (chapter) {
            setCurrentChapter(chapter.label);
          }
        });

        await rendition.display();
      } catch (error) {
        console.error("Error loading book:", error);
      }
    };

    loadBook();
  }, []);
  const goToChapter = (href) => {
    if (rendition) {
      rendition.display(href);
    }
  };

  const nextPage = () => {
    if (rendition) {
      rendition
        .next()
        .then(() => {
          console.log("Next page displayed.");
        })
        .catch((error) => {
          console.error("Error going to the next page:", error);
        });
    }
  };

  const prevPage = () => {
    if (rendition) {
      rendition
        .prev()
        .then(() => {
          console.log("Previous page displayed.");
        })
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
  return (
    <div className="max-h-screen overflow-hidden">
      <div className="h-[72px] bg-[#1d1d1f] relative z-2 pt-1 flex items-center justify-center text-white font-bold text-[22px] custom-shadow">
        <h1 className="">{bookInfo?.bookName}</h1>
        <div className="absolute right-8">
          <i
            class={`fa-duotone fa-solid fa-text-size hover:text-primary font-bold ${
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
            className=" w-[55px] flex items-center justify-center h-[55px] rounded-full bg-[#29292b]  absolute bottom-0 -right-6 z-10"
            onClick={() => setShowSlideBar(!showSlideBar)}
          >
            <i class={`fa-solid fa-arrow-${showSlideBar ? "left" : "right" } text-[22px] pl-7 font-bold text-white hover:text-primary cursor-pointer`}></i>
          </div>
        </div>
        <div
          className={`flex-1 ${
            backGround === "#000" ? "bg-black" : `bg-[${backGround}]`
          } relative w-[100%]`}
        >
          <div
            ref={bookRef}
            className={`flex items-center justify-center pt-10`}
          ></div>
          <button
            className="absolute rounded-full group w-[50px] h-[50px] flex justify-center items-center top-1/2 left-2 bg-gray-700 text-white "
            onClick={prevPage}
          >
            <i class="fa-solid fa-angles-left text-[24px] group-hover:text-primary"></i>
          </button>
          <button
            className="absolute rounded-full group w-[50px] h-[50px] flex justify-center items-center   top-1/2 right-2 bg-gray-700 text-white rounded"
            onClick={nextPage}
          >
            <i class="fa-solid fa-angles-right text-[24px] group-hover:text-primary"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EpubReader;
