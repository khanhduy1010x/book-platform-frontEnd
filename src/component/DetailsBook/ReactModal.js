import React, { useEffect, useState } from "react";
import { useAPI } from "../Service/APIContext";

const ReactModal = ({setShowRating,bookID,userComment,rateToNumber,id
}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const {createComment,updateComment,getDetailBook} = useAPI();


  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };
  useEffect(() => {
    if(!userComment) return;
    setSelectedRating(rateToNumber(userComment.rate));
    setComment(userComment.comment);
  },[])

  const handleSubmit = () => {
    if(!userComment) {
        createComment(bookID, selectedRating,comment,id);
    }else{
        updateComment(userComment.id,selectedRating,comment,id);
    }
    setShowRating(false);
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="bg-background-book backdrop-blur-50 text-white border-[2px] border-yellow-500 rounded-xl p-6 w-96 shadow-lg relative">
        <button
          className="absolute top-2 text-black right-2 bg-gray-400 w-5 hover:border-primary hover:border hover:text-white flex items-center justify-center pb-1  h-5 rounded-full   text-xl"
          onClick={() => setShowRating(false)}
        >
          &times;
        </button>

        
        <h2 className="text-[1.625rem] font-bold mb-4 text-center">
          Đánh giá và nhận xét
        </h2>

        
        <div className="flex items-center mb-6">
          <div className="mr-2">Đánh giá</div>
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className="cursor-pointer"
              >
                {selectedRating >= star ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
                      fill="#FFCC00"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.80826 5.77355C10.4538 4.61551 10.8982 3.82224 11.292 3.30809C11.6853 2.79443 11.8862 2.75 12 2.75C12.1138 2.75 12.3147 2.79443 12.708 3.30809C13.1018 3.82224 13.5462 4.61551 14.1917 5.77355L14.5194 6.36141C14.5392 6.39685 14.5587 6.43195 14.578 6.46671C14.8787 7.00791 15.1326 7.46469 15.5416 7.77518C15.955 8.08901 16.459 8.20227 17.0447 8.33389C17.0823 8.34235 17.1203 8.35089 17.1586 8.35956L17.795 8.50354C19.0503 8.78757 19.9043 8.98299 20.4892 9.21351C21.06 9.43845 21.1805 9.62275 21.2264 9.77044C21.2749 9.9263 21.2763 10.1647 20.9351 10.7068C20.5887 11.257 20.0044 11.9432 19.1499 12.9425L18.7161 13.4498C18.6909 13.4793 18.6659 13.5084 18.6411 13.5373C18.2381 14.0074 17.9021 14.3993 17.748 14.895C17.5948 15.3877 17.6455 15.9054 17.7071 16.5332C17.7109 16.5716 17.7147 16.6106 17.7185 16.6499L17.7841 17.3267C17.9132 18.6589 18.0002 19.5762 17.9708 20.2369C17.9414 20.8965 17.8021 21.0788 17.6914 21.1628C17.5929 21.2376 17.4108 21.3204 16.8175 21.1504C16.2147 20.9777 15.4134 20.6111 14.238 20.0699L13.6422 19.7956L13.3285 20.4768L13.6422 19.7956C13.6055 19.7787 13.5691 19.7619 13.5331 19.7452C12.9883 19.4934 12.5157 19.2748 12 19.2748C11.4843 19.2748 11.0117 19.4934 10.4669 19.7452C10.4309 19.7619 10.3945 19.7787 10.3578 19.7956L9.762 20.0699C8.58658 20.6111 7.78533 20.9777 7.18246 21.1504C6.58923 21.3204 6.40714 21.2376 6.30863 21.1628C6.19788 21.0788 6.05858 20.8965 6.0292 20.2369C5.99976 19.5762 6.08681 18.6589 6.2159 17.3267L6.28149 16.6499C6.2853 16.6105 6.28912 16.5716 6.29289 16.5331C6.35446 15.9054 6.40524 15.3877 6.25203 14.895C6.09789 14.3993 5.76186 14.0074 5.35884 13.5373C5.33411 13.5084 5.30913 13.4793 5.28392 13.4498L4.8501 12.9425C3.99557 11.9432 3.41127 11.257 3.06492 10.7068C2.72368 10.1647 2.72512 9.9263 2.77359 9.77044C2.81952 9.62275 2.94001 9.43845 3.51081 9.21351C4.09574 8.98299 4.94973 8.78757 6.20505 8.50354L6.8414 8.35956C6.87971 8.35089 6.91769 8.34235 6.95533 8.3339C7.54104 8.20227 8.04502 8.08901 8.45843 7.77518C8.86743 7.46469 9.12126 7.0079 9.42199 6.46669C9.4413 6.43194 9.46081 6.39684 9.48056 6.36141L9.80826 5.77355Z"
                      stroke="#FFCC00"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">Nhận xét</div>
        <textarea
          className="w-full p-2 rounded-xl bg-background-book backdrop-blur text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
          placeholder="Hãy cho chúng mình một vài nhận xét và đóng góp ý kiến nhé"
          rows={4}
          value={comment}
          onChange={(e) => 
            {
                if(e.target.value.length > 300 ) return;
                setComment(e.target.value);

            }}
        ></textarea>
    
    <div className="text-center">{comment.length}/300</div>
        
        <button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary hover:opacity-[0.9] text-white py-2 rounded-full mt-4 font-semibold"
        >
          Gửi nhận xét
        </button>
      </div>
    </div>
  );
};

export default ReactModal;
