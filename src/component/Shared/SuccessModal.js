import React, { useState, useEffect } from "react";

function SuccessModal({content}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsVisible(true);
  
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
  
      return () => clearTimeout(hideTimer);
    }, 100);
  
    return () => clearTimeout(delayTimer); 
  }, []);

  return (
    <div
      className={`fixed top-20 right-0 z-[99999] flex p-4  bg-background-white backdrop-blur text-white border-primary border font-bold rounded-lg shadow-lg items-center gap-4 transform transition-transform duration-500 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
        <div className="font-bold text-[22px] font-oswald fa-beat flex overflow-hidden "><i class="fa-solid fa-pen-to-square  p-2 bg-primary rounded-full mr-2 "></i><div className="">{content}</div></div>

    </div>
  );
}

export default SuccessModal;
