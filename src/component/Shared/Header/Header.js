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

  useEffect(() => {
    if (!searchTerm && !location.pathname.includes("/search")) {
      setCurrentURL(location.pathname);
    }
    
      if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    } else if (currentURL && location.pathname.includes("/search")) {
      navigate(currentURL);
    }
  }, [searchTerm,location.pathname]);
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
        <div className="w-full px-14">
          <div className="flex justify-between gap-8 items-center min-h-[50px]">
            <div className="flex gap-12 min-h-[50px]">
              <Link to="/" className="block py-2.5">
                <img
                  src={Logo}
                  alt="logo"
                  className="cursor-pointer h-[26px] min-w-[106px] object-contain"
                />
              </Link>
              <div className="flex flex-1 gap-x-6 flex-wrap items-center font-oswald">
                <div className="relative group">
                  <a
                    href="/ebook"
                    className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                  >
                    Sách điện tử
                  </a>
                  <CategoryHoverDialog title={"Sách điện tử"} listCate={listCateEbook}/>
                </div>
            
                <div className="relative group">
                  <a
                    href="/hieu-soi"
                    className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                  >
                    Sách giấy
                  </a>
                  <CategoryHoverDialog title={"Sách giấy"} listCate={listCatePaperPack}/>
                </div>
                <div className="relative group">
                  <a
                    href="/sach-giay"
                    className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                  >
                    Nạp Tiền
                  </a>
                </div>
                <a
                  href="/sach-tom-tat"
                  className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                >
                  Podcast
                </a>
                <a
                  href="/podcast"
                  className="font-medium text-base text-white cursor-pointer whitespace-nowrap hover:text-primary"
                >
                  Mini Game
                </a>
              </div>
            </div>

            <div className="flex gap-6 items-center ">
              <div className="relative min-h-[16px]">
                <div
                  ref={inputRef}
                  className={`${
                    searchInput
                      ? "search-input transition-width duration-500  ease-in-out outline-none  flex py-1 px-3 items-center gap-2 border border-white-600 rounded-xl overflow-hidden"
                      : "px-3 "
                  }`}
                  style={{
                    width: searchInput ? "250px" : "40px",
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
                      setSearchInput(!searchInput);
                    }}
                  ></i>
                </div>
              </div>

              <a
                href="/package-plan"
                className="cursor-pointer bg-package border border-[#FC0] w-[93px] h-[32px]  rounded-2xl px-2.5 py-[5.25px] bg-[rgba(255,204,0,0.16)] min-w-[92px] flex items-center"
              >
                <img
                  src="https://waka.vn/svgs/icon-vip.svg"
                  alt="icon-vip"
                  className="h-4 w-4"
                />
                <span className="text-[13px] font-bold text-nowrap text-yellow-500 pl-2">
                  Gói VIP
                </span>
              </a>
              <div className="relative group cursor-pointer">
                <div className="absolute w-[14px] h-[14px] z-20 -right-2 -top-0.5 bg-red-500  text-[10px] font-bold flex text-white justify-center items-center rounded-full ">
                  2
                </div>
                <i className="fa-solid fa-bell text-primary z-10 relative"></i>
                <NotificationDialog />
              </div>
              <div className="relative w-100 group cursor-pointer"><Link to="/cart"><i className="fa-duotone cursor-pointer fa-solid fa-cart-shopping  text-primary text-[22px] font-bold"></i></Link>
              <div className={`absolute -right-5  group-hover:block hidden ${isAddCart ?  '!block' : ""}`}>
                      <MiniCart isAddCart={isAddCart}/>
              </div>
              </div>

              <div className="flex items-center group relative gap-2 h-[42px]">
                {!isLogin ? (
                  <>
                    <a
                      className="bg-white-overlay text-white border-[2px] border-white-overlay py-2 font-bold px-4 cursor-pointer rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap py-2"
                      onClick={() => {
                        setModalStatus("");
                        setShowModal(true);
                      }}
                    >
                      Đăng ký
                    </a>
                    <a
                      className="text-white font-bold text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-4  button-primary bg-primary"
                      onClick={() => {
                        setShowModal(true);
                        setModalStatus("login");
                      }}
                    >
                      Đăng nhập
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
                        <div className="px-2 py-1 bg-primary w-full rounded-full font-bold text-white cursor-pointer">
                          Trở thành hội viên
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <img
                              src="https://waka.vn/svgs/icon-account.svg"
                              alt="icon-account"
                              className="cursor-pointer"
                            />
                          </div>{" "}
                          <Link to="/info" className=" text-[15px] text-white font-bold ">
                            Quản lý tài khoản
                          </Link>
                        </div>
                        <div className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-duotone fa-solid fa-clock-rotate-left text-white"></i>{" "}
                          </div>{" "}
                          <p className=" text-[15px] text-white font-bold ">
                            Lịch sử giao dịch
                          </p>
                        </div>
                        <div className="flex p-2 items-center gap-3 hover:bg-background-white rounded-xl cursor-pointer d-block">
                          <div className="w-6 h-6">
                            <i className="fa-solid fa-cabinet-filing text-white"></i>{" "}
                          </div>{" "}
                          <p className=" text-[15px] text-white font-bold ">
                            Tủ sách cá nhân
                          </p>
                        </div>
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
            </div>
          </div>
        </div>
      </header>
    </>
  );
}