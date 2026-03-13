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
import { useEffect, useState } from "react";
import Cart from "./component/Cart/Cart";
import { InputShipInfo } from "./component/Order/InputShipInfo";
import Deposit from "./component/Deposit/Deposit";
import MemberShip from "./component/MemberShip/MemberShip";
import QrCodeModal from "./component/Order/QrCodeModal";
import ConfirmModal from "./component/Order/ConfirmModal";
import ModalCOD from "./component/Order/ModalCODE";
import OrderDetailHistory from "./component/Infomation/OrderHistory/OrderDetailHistory";
import PaymentMemberShip from "./component/MemberShip/PaymentMemberShip";
import ReactModal from "./component/DetailsBook/ReactModal";
import PurchaseModal from "./component/EpubReader/PurchaseModal";
import PaymentEbook from "./component/DetailsBook/PaymentEbook";
import FavoriteNotification from "./component/Shared/FavoriteNotification";
import ProtectedRoute from "./component/Shared/ProtectedRoute";
import { useAPI } from "./component/Service/APIContext";
import AdminPage from "./component/Admin/AdminPage";
import AddNewModal from "./component/Admin/Product/AddNewModal";
import SuccessAddBook from "./component/Shared/SuccessAddBook";
import OrdersTable from "./component/Admin/Order/OrdersTable";
import UserInfo from "./component/Infomation/AccountManager/UserInfo";
import InfoUser from "./component/Admin/Account/InfoUser";
import AdminBannerManagement from "./component/Admin/Banner/Banner";
import MemberPackageTable from "./component/Admin/MemberShip/MemberPackageTable";
import AddMemberPkg from "./component/Admin/MemberShip/AddMemberPkg";
import ModalAddNewAuthor from "./component/Admin/Author/ModalAddNewAuthor";
import StaticTable from "./component/Admin/Static/StaticTable";
import AddVoucherModal from "./component/Admin/Voucher/AddVoucherModal";
import MainMiniGame from "./component/minigame/MainMiniGame";
import Social from "./component/Social/Social";
import Chat from "./component/Chat/Chat";
import ProtectedAdmin from "./component/Shared/Header/ProtectedAdmin";
import ProtectMiniGame from "./component/Shared/Header/ProtectMiniGame";
import ServerErrorPage from "./component/Shared/ServerErrorPage";
function App() {
  const {isLogin,isCheckingLogin,userInfo,isServerDown,serverCheckDone} = useAPI();
  const location = useLocation();
  const [showModalChat,setShowModalChat]=useState(false);
  const isEpubReaderRoute = location.pathname.startsWith("/epubread") || location.pathname.startsWith("/admin") ;
  const isNoFooterRoute = location.pathname === "/social";
  useEffect(() => {
    window.scrollTo(0, 0);
}, [location.pathname]);

// Neu server down thi hien trang loi
if (serverCheckDone && isServerDown) {
  return <ServerErrorPage onRetry={() => window.location.reload()} />;
}

return (
  <>
    {!isEpubReaderRoute && (
      <>
   {!location.pathname.startsWith("/mini-game") &&   <>
     
        <Zalo />
        <div >

        {showModalChat ?(
        <div className="fixed right-2 bottom-10 max-w-[500px] z-[99999999]">
        <Chat setShowModalChat={setShowModalChat}  userChat={true}/>
        </div>) : (<div className="cursor-pointer" onClick={() => setShowModalChat(true)}>
          <ChatWeb/></div>) } 

        </div>
        </>}
        <div className="z-[9999] relative">
          <Header />
        </div>
      </>
    )}
    <Routes>
      {/* Admin Route */}




      {/* User Route */}
      <Route path="/*" element={<Home />} />
      <Route path="/detail/:id" element={<DetailBook />} />
      <Route path="/search/:param" element={<Search />} />
      <Route path="/epubread/:id" element={<EpubReader/>} />
      <Route path="/member-ship" element={<MemberShip/>}/>
      <Route path="/test" element={<Chat/>}/>


      <Route path="/social" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <Social />
        </ProtectedRoute>
      } />
      <Route path="/mini-game" element={
        // <ProtectMiniGame isLogin={isLogin} isVip={userInfo && userInfo?.memberType === "ADVANCE"} isCheckingLogin={isCheckingLogin}>
          <MainMiniGame />
        // </ProtectMiniGame>
      } />
      <Route path="/type/:bookType/:cate?" element={<ListByTypePage />} />

      <Route path="/admin" element={
        <ProtectedAdmin isLogin={isLogin} isAdmin={userInfo && userInfo?.role === "ADMIN"} isCheckingLogin={isCheckingLogin}>
          <AdminPage />
        </ProtectedAdmin>
      } />
        <Route path="/info/*" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <InfoPage />
        </ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/info-ship" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <InputShipInfo />
        </ProtectedRoute>
      } />
      <Route path="/deposit" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <Deposit />
        </ProtectedRoute>
      } />
      <Route path="/payment-member-package" element={
        <ProtectedRoute isLogin={isLogin} isCheckingLogin={isCheckingLogin}>
          <PaymentMemberShip />
        </ProtectedRoute>
      } />
    </Routes>
    {!isEpubReaderRoute && !isNoFooterRoute && <Footer />}
  </>
);
}

export default App;
