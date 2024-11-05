import Header from "./component/Shared/Header/Header";
import "../src/App.css";
import Home from "./component/Home/Home";
import Footer from "./component/Shared/Footer/Footer";
import Zalo from "./component/Shared/ChatIcon/Zalo";
import ChatWeb from "./component/Shared/ChatIcon/ChatWeb";
import DetailBook from "./component/DetailsBook/DetailBook";
import { Routes, Route, useLocation } from "react-router-dom";
import Search from "./component/Search/Search";
import ListByTypePage from "./component/TypeBookPage/ListByTypePage";
import InfoPage from "./component/Infomation/InfoPage";
import EpubReader from "./component/EpubReader/EpubReader";
import { useEffect } from "react";
import Cart from "./component/Cart/Cart";
import { InputShipInfo } from "./component/Order/InputShipInfo";
import Deposit from "./component/Deposit/Deposit";
import MemberShip from "./component/MemberShip/MemberShip";
import QrCodeModal from "./component/Order/QrCodeModal";
function App() {

  const location = useLocation();
  const isEpubReaderRoute = location.pathname.startsWith("/epubread");
  useEffect(() => {
   
    window.scrollTo(0, 0);
}, [location.pathname]);
  return (
    <>
      <Zalo />
      <ChatWeb />
      {!isEpubReaderRoute && (
        <div className="z-[9999] relative">
          <Header />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:id" element={<DetailBook />} />
        <Route path="/search/:param" element={<Search/>} />
        <Route path="/type/:bookType/:cate" element={<ListByTypePage/>}/>
        <Route path="/info" element={<InfoPage/>} />
        <Route path="/epubread/:id" element={<EpubReader/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/info-ship" element={<InputShipInfo/>} />
        <Route path="/deposit" element={<Deposit/>}/>
        <Route path="/member-ship" element={<MemberShip/>}/>
        <Route path="/test" element={<QrCodeModal/>}/>



      </Routes>
      {!isEpubReaderRoute && <Footer />}
    </>
  );
}

export default App;
