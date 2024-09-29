import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Carousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 100,
  };
  return (
    <div className="h-[550px] w-full overflow-hidden relative">
      <Slider {...settings}>
        <div className="h-full w-full">
          <img
            className="h-[550px] w-full object-fit"
            src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3583.jpg?v=1&w=1920&h=600"
            alt="Slide 1"
          />
        </div>
        <div className="h-full w-full">
          <img
            className="h-[550px] w-full object-fit"
            src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3586.jpg?v=1&w=1920&h=600"
            alt="Slide 2"
          />
        </div>
        <div className="h-full w-full">
          <img
            className="h-[550px] w-full object-fit"
            src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3589.jpg?v=1&w=1920&h=600"
            alt="Slide 3"
          />
        </div>
      </Slider>
      <div className="absolute !bg-home-banner h-[7.5rem] w-full bottom-0 left-0"></div>
    </div>
  );
}

export default Carousel;
