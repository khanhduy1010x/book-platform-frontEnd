import React, { useState } from "react";
import './admin.css'
import SlidebarAdmin from "./SlidebarAdmin";
import HeaderAdmin from "./HeaderAdmin";
import ProductManager from "./Product/ProductManager";
import OrdersManagement from "./Order/OrdersManagement";
import AccountManagement from "./Account/AccountManager";
import AccountsTable from "./Account/AccountsTable";
import BannerManagement from "./Banner/BannerManagement";
import MemberShipManager from "./MemberShip/MemberShipManager";
import AuthorManagement from "./Author/AuthorManagement";
import StaticManager from "./Static/StaticManager";
import VoucherManagement from "./Voucher/VoucherManager";
import TransactionManager from "./Transaction/TransactionManager";
import ChatManagement from "./Chat/ChatManagement";

const AdminPage = () => {
    const [isSelectTab,setIsSelectTab] = useState("book");

  return (
    <div className="flex min-h-screen ">
 <div>   <SlidebarAdmin isSelectTab={isSelectTab} setIsSelectTab={setIsSelectTab}/></div>   
      <div className="flex-1 flex flex-col">
        <HeaderAdmin />
        <div className="p-6 bg-black flex-1">
   {isSelectTab === 'book' && <ProductManager/>}
   {isSelectTab === 'order' && <OrdersManagement/>}
   {isSelectTab === 'account' && <AccountManagement/>}
   {isSelectTab === 'banner' && <BannerManagement/>}
   {isSelectTab === 'memberShip' && <MemberShipManager/>}
   {isSelectTab === 'author' && <AuthorManagement/>}
   {isSelectTab === 'static' && <StaticManager/>}
   {isSelectTab === 'voucher' && <VoucherManagement/>}
   {isSelectTab === 'trans' && <TransactionManager/>}
   {isSelectTab === 'chat' && <ChatManagement/>}






        </div>
      </div>
    </div>
  );
};

export default AdminPage;
