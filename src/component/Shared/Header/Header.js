import Logo from "../../../assets/image/logo.png";
import { useState, useRef, useEffect } from "react";
import OtpInput from "./OtpInput";
import { getUser } from "../../Service/LocalStorage";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import CategoryHoverDialog from "./CategoryHoverDialog";
import NotificationDialog from "./NotificationDialog";
import Oyster from "../../../assets/image/oyter.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAPI } from "../../Service/APIContext";
import AvatarComponent from "../Helper/AvatarComponent";
import CreatePasswordDialog from "./CreatePasswordDialog";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordCreateNewPass from "./ForgotPasswordCreateNewPass";
import MiniCart from "./MiniCart";
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentURL, setCurrentURL] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [listCateEbook, setListCateEbook] = useState([]);
  const [listCatePaperPack, setListCatePaperPack] = useState([]);

  const { setModalStatus,getAllCateByBookType, modalStatus,logOut, showModal, setShowModal, isLogin, userInfo, isAddCart, setIsAddCart } =
    useAPI();
    const handleLogOutSubmit= () => {
      logOut();
    }
    useEffect(() => {
      const hiddenMiniCart = setTimeout(() => {
        setIsAddCart(false);
      },3000) 
      return () => clearTimeout(hiddenMiniCart);
    },[isAddCart])
    useEffect(() => {

      const fetchCateBook = async () => {
       const listBook = await getAllCateByBookType("EBOOK");
      const listPaperPack = await getAllCateByBookType("PAPERBACK");
        setListCateEbook(listBook);
        setListCatePaperPack(listPaperPack);
      }
      fetchCateBook();
    },[])
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lưu lại URL hiện tại (trước khi tìm kiếm) để có thể quay lại sau
  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setCurrentURL(location.pathname);
    }
  }, [location.pathname]);

  // Chỉ navigate khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    } else if (currentURL && location.pathname.includes("/search")) {
      navigate(currentURL);
    }
  }, [searchTerm]);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInput &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setSearchInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchInput]);
  const handleCheckLogin = () => {
    if(!isLogin) {
      setModalStatus('login')
      setShowModal(true);
      return false;
    }
    return true;
  }
  return (
    <>
      {showModal && (
        <div
          id="modal"
          className="fixed inset-0 font-rubik bg-custom-modal-dark text-white bg-opacity-50 z-[9999] flex items-center justify-center"
        >
          <div className="bg-custom-modal-dark-II backdrop-blur w-[440px] z-1000 relative p-6 rounded-2xl relative shadow-lg text-center">
            <i
              className="fa-duotone fa-solid fa-octagon-xmark -top-3 -right-3 float-right absolute cursor-pointer"
              onClick={() => {
                setShowModal(false);
              }}
            ></i>
            {/* //  Dang nhap ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {modalStatus === "otp" ? (
              <OtpInput setModalStatus={setModalStatus} />
            ) : modalStatus === "login" ? (
              <LoginDialog setModalStatus={setModalStatus} />
            ) : modalStatus === "createPassword" ? (<CreatePasswordDialog/>) :
              modalStatus === "forgotPassword" ? (<ForgotPassword/> ) :
              modalStatus === "forgotPasswordCreatePass" ? (<ForgotPasswordCreateNewPass/>) :
            (
              //  Dang ki -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
              <RegisterDialog setModalStatus={setModalStatus} />
            )}
          </div>
        </div>
      )}
      <header
        className={`w-full py-[11px] fixed top-0 left-0 z-10 min-h-[70px] transition-all duration-300   ${
          isScrolled
            ? "bg-background-book shadow-lg backdrop-blur"
            : "bg-custom-modal-dark-III "
        }`}
      >
        {" "}
        <div className="w-full px-4 md:px-14">
          <div className="flex justify-between gap-4 md:gap-8 items-center min-h-[50px]">
            <div className="flex gap-4 md:gap-12 min-h-[50px] items-center">
              <Link to="/" className="block py-2.5">
                <img
                  src={Logo}
                  alt="logo"
                  className="cursor-pointer h-[26px] min-w-[106px] object-contain"
                />
              </Link>
              <div className="hidden md:flex flex-1 gap-x-6 flex-wrap items-center font-oswald">
                <div className="relative group">
                  <Link 
                    to={'/type/EBOOK'}
                    className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                  >
                    Sách điện tử
                  </Link>
                  <CategoryHoverDialog title={"Sách điện tử"} listCate={listCateEbook}/>
                </div>
            
                <div className="relative group">
                  <Link
                     to={'/type/PAPERBACK'}
                    className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                  >
                    Sách giấy
                  </Link>
                  <CategoryHoverDialog title={"Sách giấy"} listCate={listCatePaperPack}/>
                </div>
                <div className="relative group">
                  <div
className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
onClick={() => {
if(handleCheckLogin()) {
navigate('/deposit')
}
}}
                  >
                    Nạp Tiền
                  </div>
                </div>
                <Link
              to={"/social"}
className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                >
                Diễn Đàng 
                </Link>
                <Link
                  to="/mini-game"
                  className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                >
                  Mini Game
                </Link>
            {isLogin && userInfo && userInfo.role === "ADMIN" &&    <Link
                  to="/admin"
                  className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                >
                  Admin Page
                </Link>}
              </div>
            </div>

            <div className="flex gap-3 md:gap-6 items-center ">
              <div className="relative min-h-[16px]">
                <div
                  ref={inputRef}
                  className={`${
                    searchInput
                      ? "search-input transition-width duration-500  ease-in-out outline-none  flex py-1 px-3 items-center gap-2 border border-white-600 rounded-xl overflow-hidden"
                      : "px-3 "
                  }`}
                  style={{
                    width: searchInput ? "min(250px, 50vw)" : "40px",
                    transition: searchInput ? "width 0.7 ease-in-out" : "",
                  }}
                >
                  {searchInput && (
                    <>
                      <input
                        type="text"
                        className="outline-none text-white bg-transparent pl-2"
                        placeholder="Nhập tên sách, tác giả.."
                        autoFocus
                        max="100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        maxLength="100"
                      />
                      <div className="w-6 h-6 min-w-6 flex items-center justify-center"></div>
                    </>
                  )}

                  <i
                    className="fa-sharp-duotone fa-solid fa-magnifying-glass text-primary cursor-pointer absolute right-[6px]"
                    onClick={() => {
                      if (searchInput) {
                        setSearchTerm("");
                      }
                      setSearchInput(!searchInput);
                    }}
                  ></i>
                </div>
              </div>  
              <Link
                to="/member-ship"
                className="hidden md:flex cursor-pointer bg-package border border-[#FC0] w-[93px] h-[32px]  rounded-2xl px-2.5 py-[5.25px] bg-[rgba(255,204,0,0.16)] min-w-[92px] items-center"
              >
                <img
                  src="https://waka.vn/svgs/icon-vip.svg"
                  alt="icon-vip"
                  className="h-4 w-4"
                />
                <span className="text-[13px] font-bold text-nowrap text-yellow-500 pl-2">
                  Gói VIP
                </span>
              </Link>
             {
              isLogin && ( <div className="relative group cursor-pointer">
                <i className="fa-solid fa-bell text-primary z-10 relative"></i>
                <NotificationDialog />
              </div>)
             }
              {
                    isLogin  &&     <div className="relative w-100 group cursor-pointer">
                
                    <Link to="/cart" 
                
                  ><i className="fa-duotone cursor-pointer fa-solid fa-cart-shopping  text-primary text-[22px] font-bold"></i></Link>
                  <div className={`absolute -right-5  group-hover:block hidden ${isAddCart ?  '!block' : ""}`}>
                          <MiniCart isAddCart={isAddCart}/>
                  </div>
                  </div>
              }
          

              <div className="flex items-center group relative gap-2 h-[42px]">
                {!isLogin ? (
                  <>
                    <a
                      className="hidden sm:block bg-white-overlay text-white border-[2px] border-white-overlay py-2 font-bold px-4 cursor-pointer rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap"
                      onClick={() => {
                        setModalStatus("");
                        setShowModal(true);
                      }}
                    >
                      Đăng ký
                    </a>
                    <a
                      className="text-white font-bold text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-3 sm:px-4 button-primary bg-primary"
                      onClick={() => {
                        setShowModal(true);
                        setModalStatus("login");
                      }}
                    >
                      <span className="hidden sm:inline">Đăng nhập</span>
                      <i className="sm:hidden fa-solid fa-right-to-bracket text-[18px]"></i>
                    </a>
                  </>
                ) : (
                  <>
                  <div className="w-[42px] h-[42px] rounded-full min-w-[42px] overflow-hidden  border-white border-[1px] ">
                      <AvatarComponent avatar={userInfo.avatar} css={"w-full h-full object-cover cursor-pointer"}/>
                    </div>
                    <i className="fa-duotone fa-solid fa-caret-down absolute right-1 text-white text-[18px]"></i>
                    <div className="!bg-background-book after:content-[''] min-w-100  after:w-100 after:h-[40px] after:-top-5 after:absolute after:left-[75%] after:right-0 ease-in-out invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-500  absolute w-[300px] right-0 top-[110%] !backdrop-blur rounded-xl px-[16px] py-[8px] text-center">
                      <div className="flex justify-center items-center ">
                        <div className="text-center">
                          <h2 className="text-white text-[16px] w-100 pb-2 font-bold ">
                            {userInfo?.fullName}
                          </h2>
                          <div className="flex justify-around">
                            <div className={`bg-background-white border-[1px] flex justify-center items-center text-[12px] border-white font-bold${userInfo?.memberType === "PREMIUM" ? ' !text-primary border-yellow-500': ''} text-white px-[8px] rounded-full`}>
                              {userInfo?.memberType}
                            </div>
                            <div className="bg-background-book px-2 rounded-xl border-[1px] border-white flex justify-center items-center text-[12px]">
                            <div className="w-[20px] h-[20px] mt-[2px] flex">
                <img className="w-100 object-cover" src={Oyster} />
              </div>                              <span className="text-white font-bold ml-2 ">
                                {userInfo?.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-[45px] ml-3 h-[45px] rounded-full overflow-hidden">
                        <AvatarComponent avatar={userInfo.avatar} css={"w-full h-full object-cover"}/>

                        </div>
                      </div>
                      <div className="mt-3 px-5">
                        <Link to={'/member-ship'} className="px-2 py-1 bg-primary w-full rounded-full border-[2px] border-yellow-500 font-bold text-white cursor-pointer">
                          Trở thành hội viên
                        </Link>
                      </div>
                      <div className="mt-2">
                        <Link  to="/info" className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <img
                              src="https://waka.vn/svgs/icon-account.svg"
                              alt="icon-account"
                              className="cursor-pointer"
                            />
                          </div>{" "}
                          <div  className=" text-[15px] text-white font-bold ">
                            Quản lý tài khoản
                          </div>
                        </Link>
                        <Link to="/info/trans-history" className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-duotone fa-solid fa-clock-rotate-left text-white"></i>{" "}
                          </div>{" "}
                          <p className=" text-[15px] text-white font-bold ">
                            Lịch sử giao dịch
                          </p>
                        </Link>
                        <Link to="/info/book-shelf" className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-solid fa-cabinet-filing text-white"></i>{" "}
                          </div>{" "}
                          <p className=" text-[15px] text-white font-bold ">
                            Tủ sách cá nhân
                          </p>
                        </Link>
                        <Link to="/info/order-history" className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-solid fa-box text-white"></i>{" "}
                          </div>{" "}
                          <p className=" text-[15px] text-white font-bold ">
                            Lịch sử mua hàng
                          </p>
                        </Link>
                        <div onClick={() =>handleLogOutSubmit()} className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-duotone text-white fa-solid fa-right-from-bracket"></i>
                          </div>{" "}
                          <p  className=" text-[15px] text-white font-bold ">
                            Đăng xuất{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ----------------------------------------------------------------- */}
              </div>
              {/* Hamburger button - mobile only */}
              <button
                className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
              </button>
            </div>
          </div>
          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-background-book backdrop-blur border-t border-gray-700 py-4 flex flex-col gap-2 font-oswald">
              <Link to='/type/EBOOK' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl">Sách điện tử</Link>
              <Link to='/type/PAPERBACK' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl">Sách giấy</Link>
              <div onClick={() => { if(handleCheckLogin()) { navigate('/deposit'); setMobileMenuOpen(false); } }} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl cursor-pointer">Nạp Tiền</div>
              <Link to='/social' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl">Diễn Đàng</Link>
              <Link to='/mini-game' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl">Mini Game</Link>
              <Link to='/member-ship' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-yellow-400 font-bold hover:bg-gray-800 rounded-xl">⭐ Gói VIP</Link>
              {isLogin && userInfo?.role === 'ADMIN' && <Link to='/admin' onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white hover:text-primary hover:bg-gray-800 rounded-xl">Admin Page</Link>}
            </div>
          )}
        </div>
      </header>
    </>
  );
}