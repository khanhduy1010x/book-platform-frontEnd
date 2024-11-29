import React, { useRef, useState, useEffect } from "react";
import { useAPI } from "../Service/APIContext";
import ConfirmModal from "./ConfirmModal";
import ModalCOD from "./ModalCODE";
import QrCodeModal from "./QrCodeModal";
import { Navigate, useNavigate } from "react-router-dom";

const URL_PROVINCES = "https://provinces.open-api.vn/api";

export function InputShipInfo() {
  const {
    userInfo,
    getListCart,
    listCart,
    formatNumber,
    createOrderInCart,
    getQRCodeOrder,
    checkQROrder
  } = useAPI();
  const [paymentMethod, setPaymentMethod] = useState("");
  const[invalidAmount, setInvalidAmount] = useState(false);
  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const wardRef = useRef(null);
  const [showListProvince, setShowListProvince] = useState(false);
  const [showListDistricts, setShowListDistricts] = useState(false);
  const [showListWards, setShowListWards] = useState(false);
  const [listProvinces, setListProvinces] = useState([]);
  const [listDistricts, setListDistricts] = useState([]);
  const [listWards, setListWards] = useState([]);
  const [shipProvince, setShipProvince] = useState("");
  const [shipDistricts, setShipDistricts] = useState("");
  const [shipWards, setShipWards] = useState("");
  const [detailAddressShip, setDetailAddressShip] = useState("");
  const [phoneShip, setPhoneShip] = useState(userInfo?.phone);
  const [nameShip, setNameShip] = useState(userInfo?.fullName);
  const [errors, setErrors] = useState({});
  const [isValidInfo, setIsValidInfo] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [shipPrice, setShipPrice] = useState(15000);
  const [showConfirmModal, setShowConfirmModal] =useState(false)
  const [modalCOD, setShowModalCOD] =useState(false);
  const [qrCode, setQrCode] = useState("");
  const [modalQrCode, setModalQrCode] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    getListCart();
    console.log(listCart)
    if( listCart &&  listCart.cartItems && listCart.cartItems.length === 0 ) {
      navigate('/cart')
    }
  }, []);
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const response = await fetch(`${URL_PROVINCES}/p`);
        const data = await response.json();
        setListProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(
        `${URL_PROVINCES}/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setListDistricts(data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(
        `${URL_PROVINCES}/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setListWards(data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isOk = true;
    if (nameShip.trim() === "") {
      newErrors.nameShip = "Tên người nhận không được để trống";
      isOk = false;
    }
    if (!phoneShip || !/^0\d{9,10}$/.test(phoneShip)) {
      newErrors.phoneShip = "Số điện thoại không hợp lệ";
      isOk = false;
    }
    if (!shipProvince) {
      newErrors.shipProvince = "Vui lòng chọn Tỉnh/Thành phố";
      isOk = false;
    }
    if (!shipDistricts) {
      newErrors.shipDistricts = "Vui lòng chọn Huyện";
      isOk = false;
    }
    if (!shipWards) {
      newErrors.shipWards = "Vui lòng chọn Xã/Phường";
      isOk = false;
    }
    if (!detailAddressShip) {
      newErrors.detailAddressShip = "Địa chỉ cụ thể không được để trống";
      isOk = false;
    }
    setErrors(newErrors);

    return isOk;
  };

  const handleFetchAPICreateOrder = async () => {
    const result = await createOrderInCart(
      shipProvince,
      shipDistricts,
      shipWards,
      detailAddressShip,
      nameShip,
      phoneShip,
      paymentMethod
    );  
    console.log(result)

    return result;
  }

  const handlePaymentOrder = async () => {
    if (!validateForm() && !paymentMethod) {
      setIsValidInfo(false);
      return;
    }
    if(paymentMethod === "ONLINE") {
      setShowConfirmModal(true);
      const result =await handleFetchAPICreateOrder();
      console.log(result)
      if(result === 0) {
        setShowConfirmModal(false);
        setShowModalCOD(true);
      }else if (result===-3) {
        setInvalidAmount(true);
      }
    }else if ( paymentMethod === "CASH") {
      console.log("test");
        if(await handleFetchAPICreateOrder() === 0) {
          setShowModalCOD(true);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showListProvince &&
        provinceRef.current &&
        !provinceRef.current.contains(event.target)
      ) {
        setShowListProvince(false);
      }

      if (
        showListDistricts &&
        districtRef.current &&
        !districtRef.current.contains(event.target)
      ) {
        setShowListDistricts(false);
      }

      if (
        showListWards &&
        wardRef.current &&
        !wardRef.current.contains(event.target)
      ) {
        setShowListWards(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showListProvince, showListDistricts, showListWards]);
  const handleClickBuyButton = async() => {
    if(paymentMethod === "ONLINE") {
      setShowConfirmModal(true);
}else if(paymentMethod === "CASH") {
  handlePaymentOrder();
}else if (paymentMethod === "QR") {
  console.log(userInfo.accID)
  const request = {
    province: shipProvince,
    district: shipDistricts,
    wards: shipWards,
    shipDetail: detailAddressShip,
    name: nameShip,
    phone: phoneShip,
    paymentMethod: paymentMethod,
    accID: userInfo.accID
  }
  console.log(request)
 const qrCode = await getQRCodeOrder(request);
 setQrCode(qrCode.qrUrl)
 setModalQrCode(true);
 checkQROrder(qrCode.messageKey);
}
getListCart();
  }
  return (
    <div className="bg-[#121214] relative min-h-screen  pt-[70px] px-[40px] pb-[150px] font-oswald">
      {
        showConfirmModal && <ConfirmModal invalidAmount={invalidAmount} setInvalidAmount={setInvalidAmount} handlePaymentOrder={handlePaymentOrder} totalPrice={listCart?.totalPriceAfterSale} setShowConfirmModal={setShowConfirmModal}/>
      }
        {
        modalCOD && <ModalCOD/>
      }
      {
          modalQrCode && <QrCodeModal qrCode={qrCode} />
      }
      <svg
        width="100%"
        id="svg"
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out absolute z-[1] bottom-0 left-0 delay-150"
      >
        <style>
          {`
        .path-0 {
          animation: pathAnim-0 4s linear infinite;
        }
        @keyframes pathAnim-0 {
          0% {
            d: path("M 0,400 L 0,250 C 200.8,252.13333333333333 401.6,254.26666666666668 541,242 C 680.4,229.73333333333332 758.4000000000001,203.06666666666666 898,177 C 1037.6,150.93333333333334 1238.8,125.46666666666667 1440,100 L 1440,400 L 0,400 Z");
          }
          25% {
            d: path("M 0,400 L 0,250 C 173.59999999999997,248.39999999999998 347.19999999999993,246.79999999999998 499,229 C 650.8000000000001,211.20000000000002 780.8000000000002,177.20000000000002 934,153 C 1087.1999999999998,128.79999999999998 1263.6,114.39999999999999 1440,100 L 1440,400 L 0,400 Z");
          }
          50% {
            d: path("M 0,400 L 0,250 C 188.8,281.6 377.6,313.2 532,292 C 686.4,270.8 806.4000000000001,196.8 952,156 C 1097.6,115.19999999999999 1268.8,107.6 1440,100 L 1440,400 L 0,400 Z");
          }
          75% {
            d: path("M 0,400 L 0,250 C 167.59999999999997,267.4666666666667 335.19999999999993,284.93333333333334 510,266 C 684.8000000000001,247.06666666666666 866.8,191.73333333333335 1023,158 C 1179.2,124.26666666666667 1309.6,112.13333333333333 1440,100 L 1440,400 L 0,400 Z");
          }
          100% {
            d: path("M 0,400 L 0,250 C 200.8,252.13333333333333 401.6,254.26666666666668 541,242 C 680.4,229.73333333333332 758.4000000000001,203.06666666666666 898,177 C 1037.6,150.93333333333334 1238.8,125.46666666666667 1440,100 L 1440,400 L 0,400 Z");
          }
        }
        .path-1 {
          animation: pathAnim-1 4s linear infinite;
        }
        @keyframes pathAnim-1 {
          0% {
            d: path("M 0,400 L 0,383 C 182.2666666666667,381.6666666666667 364.5333333333334,380.33333333333337 534,367 C 703.4666666666666,353.66666666666663 860.1333333333334,328.3333333333333 1009,304 C 1157.8666666666666,279.6666666666667 1298.9333333333334,256.33333333333337 1440,233 L 1440,400 L 0,400 Z");
          }
          25% {
            d: path("M 0,400 L 0,383 C 160.2666666666667,419 320.5333333333334,455 501,426 C 681.4666666666666,397 882.1333333333334,303 1042,260 C 1201.8666666666666,217 1320.9333333333334,225 1440,233 L 1440,400 L 0,400 Z");
          }
          50% {
            d: path("M 0,400 L 0,383 C 126.80000000000001,388.6 253.60000000000002,394.2 417,380 C 580.4,365.8 780.4000000000001,331.8 957,304 C 1133.6,276.2 1286.8,254.6 1440,233 L 1440,400 L 0,400 Z");
          }
          75% {
            d: path("M 0,400 L 0,383 C 192.2666666666667,363.93333333333334 384.5333333333334,344.8666666666667 523,335 C 661.4666666666666,325.1333333333333 746.1333333333332,324.4666666666667 890,309 C 1033.8666666666668,293.5333333333333 1236.9333333333334,263.26666666666665 1440,233 L 1440,400 L 0,400 Z");
          }
          100% {
            d: path("M 0,400 L 0,383 C 182.2666666666667,381.6666666666667 364.5333333333334,380.33333333333337 534,367 C 703.4666666666666,353.66666666666663 860.1333333333334,328.3333333333333 1009,304 C 1157.8666666666666,279.6666666666667 1298.9333333333334,256.33333333333337 1440,233 L 1440,400 L 0,400 Z");
          }
        }
      `}
        </style>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#00d084" />
            <stop offset="95%" stopColor="#0693e3" />
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,250 C 200.8,252.13333333333333 401.6,254.26666666666668 541,242 C 680.4,229.73333333333332 758.4000000000001,203.06666666666666 898,177 C 1037.6,150.93333333333334 1238.8,125.46666666666667 1440,100 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="0.53"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        />
        <path
          d="M 0,400 L 0,383 C 182.2666666666667,381.6666666666667 364.5333333333334,380.33333333333337 534,367 C 703.4666666666666,353.66666666666663 860.1333333333334,328.3333333333333 1009,304 C 1157.8666666666666,279.6666666666667 1298.9333333333334,256.33333333333337 1440,233 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill="url(#gradient)"
          fillOpacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-1"
        />
      </svg>
      <div className=" flex  justify-center  gap-10  pb-12">
        <div className="h-full">
          <div className="pt-[35px] text-[32px] text-white font-bold flex items-center justify-center">
            {" "}
            Thông tin nhận hàng & thanh toán
          </div>

          <div className="flex flex-col lg:flex-row bg-gradient-to-r from-[#66e0da] to-[#00D084] p-6 rounded-lg shadow-lg mx-4 w-full flex h-full items-center justify-center mt-[50px]">
            <div className="flex flex-col items-center lg:w-1/3 mb-6 lg:mb-0 lg:mr-6 text-center text-white">
              <i className="fas fa-shipping-fast text-4xl"></i>
              <h3 className="mt-4 text-lg font-semibold">Thank You</h3>
              <p className="mt-2 text-sm">
                Hãy điền thông tin để có thể nhận được hàng sớm nhất từ chúng
                tôi !
              </p>
              <button
                type="button"
                className="bg-white text-black font-semibold py-2 px-4 rounded-full mt-8 hover:bg-gray-100 transition duration-300"
              >
                Quay về giỏ hàng
              </button>
            </div>

            <div className="bg-background-white backdrop-blur-50  pt-[20px] pb-[50px] pr-[95px] rounded-lg lg:w-2/3 shadow pl-[100px]  rounded-l-[200px]">
              <h4 className="text-center text-2xl text-white font-semibold text-gray-800 mb-6">
                Thông tin nhận hàng
              </h4>
              <form className="space-y-4 box-border w-[120%]">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-white">
                      Tên người nhận
                    </label>
                    <input
                      type="text"
                      value={nameShip}
                      onChange={(e) => setNameShip(e.target.value)}
                      className="w-full mt-1 p-2  rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 "
                    />
                    {errors.nameShip && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nameShip}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-white">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={phoneShip}
                      onChange={(e) => setPhoneShip(e.target.value)}
                      className="w-full mt-1 p-2  rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 "
                    />
                    {errors.phoneShip && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phoneShip}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-white">
                      Tỉnh/Thành phố
                    </label>
                    <input
                      type="text"
                      value={shipProvince || "Nhấn vào để chọn"}
                      onClick={() => setShowListProvince(!showListProvince)}
                      readOnly
                      className="w-full mt-1 p-2  rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 cursor-pointer"
                    />
                    {errors.shipProvince && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipProvince}
                      </p>
                    )}
                    {showListProvince && (
                      <ul
                        ref={provinceRef}
                        className="absolute z-10 w-full bg-white  rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
                      >
                        {listProvinces.map((province) => (
                          <li
                            key={province.code}
                            onClick={() => {
                              setShipProvince(province.name);
                              fetchDistricts(province.code);
                              setShowListProvince(false);
                              setShipDistricts("");
                              setShowListDistricts(false);
                              setShipWards("");
                            }}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {province.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-white">
                      Huyện
                    </label>
                    <input
                      type="text"
                      value={shipDistricts || "Nhấn vào để chọn"}
                      onClick={() => setShowListDistricts(!showListDistricts)}
                      readOnly
                      className="w-full mt-1 p-2 border focus:outline-none border-gray-300 rounded-md  focus:ring focus:ring-blue-200 cursor-pointer"
                    />
                    {errors.shipDistricts && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipDistricts}
                      </p>
                    )}
                    {showListDistricts && (
                      <ul
                        ref={districtRef}
                        className="absolute z-10 w-full bg-white  rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
                      >
                        {listDistricts.map((district) => (
                          <li
                            key={district.code}
                            onClick={() => {
                              setShipDistricts(district.name);
                              fetchWards(district.code);
                              setShowListDistricts(false);
                              setShowListWards(false);
                              setShipWards("");
                            }}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {district.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full relative">
                    <label className="block text-sm font-medium text-white">
                      Xã/Phường
                    </label>
                    <input
                      type="text"
                      value={shipWards || "Nhấn vào để chọn"}
                      onClick={() => setShowListWards(!showListWards)}
                      readOnly
                      className="w-full mt-1 p-2 focus:outline-none  rounded-md  focus:ring focus:ring-blue-200 cursor-pointer"
                    />
                    {errors.shipWards && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipWards}
                      </p>
                    )}
                    {showListWards && (
                      <ul
                        ref={wardRef}
                        className="absolute z-10 w-full bg-white  rounded-md shadow-lg mt-1 max-h-60 overflow-auto"
                      >
                        {listWards.map((ward) => (
                          <li
                            key={ward.code}
                            onClick={() => {
                              setShipWards(ward.name);
                              setShowListWards(false);
                            }}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {ward.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="w-full ">
                    <label className="block text-sm font-medium text-white">
                      Địa chỉ cụ thể
                    </label>
                    <input
                      type="text"
                      value={detailAddressShip}
                      onChange={(e) => setDetailAddressShip(e.target.value)}
                      className="w-full mt-1 p-2  rounded-md  focus:ring focus:ring-blue-200"
                    />
                    {errors.detailAddressShip && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.detailAddressShip}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full">
            <div className="text-white text-[28px] font-bold mx-3 my-6">
              <span>Sản phẩm mua</span>
            </div>
            <div className=" items-center text-white mt-2 w-full">
              <div className="bg-gray-900 rounded-lg p-6 ml-4">
                <table className="w-full text-center">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2"></th>
                      <th className="py-2">Tên sách</th>
                      <th className="py-2">Đơn giá</th>
                      <th className="py-2">Số lượng</th>
                      <th className="py-2">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listCart?.cartItems?.length > 0 &&
                      listCart?.cartItems?.map((item, index) => {
                        return (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-4 flex items-center justify-start">
                              <div className="  rounded-md mr-4 overflow-hidden">
                                <img
                                  src={item?.book?.coverImage}
                                  alt={item?.book?.bookName}
                                  className="w-16 h-[95px] object-cover"
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {item?.book?.bookName}
                                </h3>
                              </div>
                            </td>

                            <td className="py-4">
                              {formatNumber(item?.book?.price)}đ
                            </td>

                            <td className="py-4">{item?.quantity} quyển</td>

                            <td className="py-4">
                              {formatNumber(item?.book?.price * item?.quantity)}
                              đ
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="w-full relative z-[4]">
            <div className="text-white text-[28px] font-bold ml-4 my-6">
              <span>Chọn hình thức thanh toán</span>
            </div>
            <div className=" items-center text-white mt-2 w-full">
              <div className="bg-book backdrop-blur border-white border-[2px] rounded-xl py-6 px-12 ml-4 flex flex-col gap-4">
                <div
                  className={` ${
                    paymentMethod === "QR" ? "!border-primary" : ""
                  } justify-between bg-gray-600 px-3 py-2 rounded-xl flex items-center hover:border-[2px] hover:border-primary border-[2px] hover:bg-gray-500 border-transparent cursor-pointer `}
                  onClick={() => setPaymentMethod("QR")}
                >
                  <div className="flex items-center ">
                    <div
                      className={`bg-gray-400 p-2 ${
                        paymentMethod === "QR" ? "!bg-transparent" : ""
                      }  rounded-xl w-[52px]  h-[52px] flex items-center justify-center`}
                    >
                      <i
                        className={`fa-regular fa-qrcode text-[38px] ${
                          paymentMethod === "QR" ? "!text-primary" : ""
                        }`}
                      ></i>
                    </div>
                    <div className="text-[22px] font-bold ml-4">
                      <span>Quét QR CODE</span>
                    </div>
                  </div>
                  <div>
                    {paymentMethod === "QR" && (
                      <i className="fa-sharp-duotone fa-solid fa-check text-primary text-[24px] mr-4"></i>
                    )}
                  </div>
                </div>
                <div
                  className={`bg-gray-600 px-3 py-2  rounded-xl flex justify-between items-center hover:border-[2px] hover:border-primary border-[2px]  hover:bg-gray-500 border-transparent cursor-pointer ${
                    paymentMethod === "CASH" ? "!border-primary" : ""
                  }`}
                  onClick={() => setPaymentMethod("CASH")}
                >
                  <div className="flex items-center">
                    <div
                      className={`bg-gray-400 p-2  rounded-xl w-[52px] ${
                        paymentMethod === "CASH" ? "!bg-transparent" : ""
                      }   h-[52px] flex items-center justify-center`}
                    >
                      <i
                        className={`fa-regular fa-box-circle-check text-[38px]  ${
                          paymentMethod === "CASH" ? "!text-primary" : ""
                        } `}
                      ></i>
                    </div>

                    <div className="text-[22px] font-bold ml-4">
                      <span>Thanh toán khi nhận hàng</span>
                    </div>
                  </div>
                  {paymentMethod === "CASH" && (
                    <i className="fa-sharp-duotone fa-solid fa-check text-primary text-[24px] mr-4"></i>
                  )}
                </div>
                <div
                  className={`bg-gray-600 justify-between px-3 py-2 rounded-xl flex items-center hover:border-[2px] hover:border-primary border-[2px]  hover:bg-gray-500 border-transparent cursor-pointer ${
                    paymentMethod === "ONLINE" ? "!border-primary" : ""
                  }`}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <div className="flex items-center">
                    <div
                      className={`bg-gray-400 p-2  rounded-xl w-[52px] ${
                        paymentMethod === "ONLINE" ? "!bg-transparent" : ""
                      }   h-[52px] flex items-center justify-center`}
                    >
                      <i
                        className={`fa-regular fa-box-circle-check text-[38px]  ${
                          paymentMethod === "ONLINE" ? "!text-primary" : ""
                        }`}
                      ></i>
                    </div>

                    <div className="text-[22px] font-bold ml-4">
                      <span>Thanh toán bằng số dư trên web</span>
                    </div>
                  </div>
                  {paymentMethod === "ONLINE" && (
                    <i className="fa-sharp-duotone fa-solid fa-check text-primary text-[24px] mr-4"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-500 z-[4]  rounded-xl p-4 font-bold text-white  h-full mt-[131px] w-full max-w-[350px] sticky top-[100px] bg-gray-900">
          <div className="mb-3 flex flex-col gap-2">
            <div className="flex justify-between">
              <span>Thành tiền:</span>{" "}
              <span>
                {formatNumber(
                  listCart?.totalPriceAfterSale + listCart?.totalSale - 15000 
                )}
                đ{" "}
              </span>
            </div>
            <div className="flex justify-between ">
              <span>Tổng giảm giá:</span>{" "}
              <span className="text-green-500">
                -
                {formatNumber(
                  `${listCart?.totalSale ? listCart?.totalSale : 0}`
                )}
                đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>{" "}
              <span>{formatNumber(shipPrice)}đ</span>
            </div>
          </div>
          <div className="flex justify-between pt-3 border-t border-white">
            <span>Tổng số tiền:</span>{" "}
            <span>
              {formatNumber(listCart?.totalPriceAfterSale )}đ
            </span>
          </div>
          <div className="flex justify-center items-center mt-2">
            <button
              disabled={
                !(
                  nameShip &&
                  phoneShip &&
                  shipDistricts &&
                  shipWards &&
                  shipProvince &&
                  detailAddressShip &&
                  paymentMethod
                )
              }
              className="bg-primary p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleClickBuyButton()
               
              }
            >
              Mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
