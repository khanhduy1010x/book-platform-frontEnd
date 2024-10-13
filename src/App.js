import Header from "./component/Shared/Header/Header";
import "../src/App.css";
import Home from "./component/Home/Home";
import Footer from "./component/Shared/Footer/Footer";
import Zalo from "./component/Shared/ChatIcon/Zalo";
import ChatWeb from "./component/Shared/ChatIcon/ChatWeb";
import DetailBook from "./component/DetailsBook/DetailBook";
import { Routes, Route } from "react-router-dom";
import Search from "./component/Search/Search";
import ListByTypePage from "./component/TypeBookPage/ListByTypePage";
import InfoPage from "./component/Infomation/InfoPage";
import Chat from "./component/Chat/Chat";
import Social from "./component/Social/Social";
function App() {
  return (
    <>
      <Zalo />
      <ChatWeb />
      <div className="z-[9999] relative">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<DetailBook />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/type" element={<ListByTypePage/>}/>
        <Route path="/info" element={<InfoPage/>} />

        <Route path="/chat" element={<Chat/>} />
        <Route path="/social" element={<Social/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
