import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAPI } from "../Service/APIContext";
import { useEffect } from "react";

function Carousel() {
  const {getListBanner,listBanner} = useAPI();
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 200,
  };
  useEffect(() => {
    getListBanner();
  },[])
  return (
    <div className="h-[550px] w-full overflow-hidden relative">
      <Slider {...settings}>
        {
          listBanner.map((item,index) => (
            <div key={index} className="h-full w-full">
            <img
              className="h-[550px] w-full object-fit"
              src={item.imageURL}
              alt={`Slide ${index + 1}`}
            />
          </div>
          ))
        }
       
     
      </Slider>
      <div className="absolute !bg-home-banner h-[7.5rem] w-full bottom-0 left-0"></div>
    </div>
  );
}

export default Carousel;
