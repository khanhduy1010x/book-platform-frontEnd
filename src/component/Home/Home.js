import BookHome from "../HomeBook/BookHome";
import BookSlider from "../HomeBook/BookSlider";
import Carousel from "../CouraselBanner/Carousel";
import AuthorHome from "../Author/AuthorHome";

export default function Home() {

  return (
    <>
   <div className="">
        <Carousel />
      </div>     
      <div className="">
        <BookHome/>
      </div>
      <>
      <AuthorHome/>
      </>
    </>
  );
}
