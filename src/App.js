import Header from "./component/Shared/Header/Header";
import "../src/App.css";
import Home from "./component/Home/Home";
import Footer from "./component/Shared/Footer/Footer";
import Zalo from "./component/Shared/ChatIcon/Zalo";
import ChatWeb from "./component/Shared/ChatIcon/ChatWeb";
import DetailBook from "./component/DetailsBook/DetailBook";
import { Routes, Route, useLocation } from "react-router-dom";
import EpubReader from "./component/Reader/EpubReader";
import Search from "./component/Search/Search";
import ListByTypePage from "./component/TypeBookPage/ListByTypePage";
import InfoPage from "./component/Infomation/InfoPage";
function App() {
  const isReading = useLocation().pathname.startsWith("/read/");
  return (
    <>
      {!isReading && <div className="hidden lg:block"><Zalo /><ChatWeb /></div>}
      {!isReading && <div className="z-[9999] relative">
        <Header />
      </div>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<DetailBook />} />
        <Route path="/detail/:id" element={<DetailBook />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/type" element={<ListByTypePage/>}/>
        <Route path="/info" element={<InfoPage/>} />
        <Route path="/read/:id" element={<EpubReader />} />


      </Routes>
      {!isReading && <Footer />}
    </>
  );
}

export default App;
