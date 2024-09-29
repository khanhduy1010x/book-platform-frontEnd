import { createContext, useContext, useEffect, useState } from "react";
import { setToken, getToken, setUser,removeToken, removeUser, getUser } from "./LocalStorage";
const APIContext = createContext();

export function useAPI() {
  return useContext(APIContext);
}
export function ContextAPI({ children }) {
  const [error, setError] = useState({
    failLogin: null,
    otpError: null,
    valid: {
      register: {
        isNull: null,
        phone: null,
        name: null,
        password: null,
        repassword: null,
      },
      login: {
        phone: null,
        password: null,
      },
    },
  });
  const [userInfo, setUserInfo] = useState(null);
  const [success, setSuccess] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [accountCreatRequest, setAccountCreateRequest] = useState({
    phone: "",
    password: "",
    repassword: "",
    name: "",
    otp: "",
  });
  const BASE_URL = "http://localhost:9999";

  // Kiem tra token xem con han khong ( introspect ) 
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
      const token = getToken();
      if (token && !isFetching) {
          setIsFetching(true);
          fetch(`${BASE_URL}/auth/introspect`, {
              method: "POST",
              headers: {
                  "Content-Type": 'application/json'
              },
              body: JSON.stringify({ token })
          })
          .then((response) => response.json())
          .then((data) => {
              setIsFetching(false); 
              if (data.code === 1000 && data.result.valid) {
                  setIsLogin(true);
                  setUserInfo(getUser());
              } else {
                  refreshToken();
              }
          })
          .catch(() => {
              setIsFetching(false); 
          });
      }
  }, []);
/// RefreshToken 
const refreshToken = () => {
  const token = getToken()
  if(token)
  fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
       token : token 
    })
  })
  .then((response) => {
    return response.json()
  })  
  .then((data) => {
    if (data.code === 1000) {
      removeToken();
    setToken(data.result.token)
     setIsLogin(true);
    }else { 
      setIsLogin(false)
      removeToken();
      removeUser();
    }
  })
}
  useEffect(() => {
    setError({
      failLogin: null,
      otpError: null,
      valid: {
        register: {
          isNull: null,
          phone: null,
          name: null,
          password: null,
          repassword: null,
        },
        login: {
          phone: null,
          password: null,
        },
      },
    });
  }, [modalStatus, showModal]);
  useEffect(() => {
    setAccountCreateRequest({
      phone: "",
      password: "",
      repassword: "",
      name: "",
      otp: "",
    });
  }, [showModal]);



  /// Dang xuat
  const logOut = () => {
    const token = getToken();
    fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code != null) {
          removeToken();
          removeUser();
          setIsLogin(false);
          setUserInfo(null);
        }
      })
      .catch(() => {
        removeToken();
          removeUser();
          setIsLogin(false)
          setUserInfo(null);
      });
  };
  /// Lay thong tin user
  const getInfoUser = (token) => {
    fetch(`${BASE_URL}/auth/my-info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setUser(data?.result);
          setUserInfo(getUser());
          setIsLogin(true);
        }
        if (data.code !== 1000) {
        }
      })
      .catch((e) => {});
  };
  //// Dang Nhap
  const loginRequest = (phone, password) => {
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setToken(data?.result.token);
          getInfoUser(data?.result.token);
          setShowModal(false);
        }
        if (data.code != 1000) {
          /// Code != 1000 -> sai tai khoan or password
          setError({
            ...error,
            failLogin: true,
          });
        }
      })
      .catch((e) => {
        setError({
          ...error,
          failLogin: true,
        });
      });
  };

  ///// Dang ki tai khoan
  const sendRegisterAccount = (otp) => {
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: accountCreatRequest.password,
        phone: accountCreatRequest.phone,
        fullName: accountCreatRequest.name,
        otp: otp,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code !== 1000) {
          setError({
            ...error,
            otpError: data.message,
          });
        }
        if (data.code === 1000) {
          setModalStatus("login");
          setSuccess({
            ...success,
            successRegistered: true,
          });
        }
      })
      .catch((e) => {
        setError({
          ...error,
          otpError: "Lỗi vui lòng thử lại",
        });
      });
  };
  /// Request yeu cau gui OTP sdt
  const sendSMSOTPReg = (phone) => {
    fetch(`${BASE_URL}/auth/sendSMS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1023) {
          setError((prevError) => ({
            ...prevError,
            register: {
              ...prevError.register,
              exitsPhone: "Số điện thoại đã được đăng kí",
            },
          }));
        }
        if (data.code === 1025) {
          setError({
            ...error,
            register: {
              ...error.register,
              waittingTime: "Vui lòng chờ thêm giây lát để tiếp tục nhận OTP",
            },
          });
        } else {
          setError((prevError) =>({
            ...prevError,
            register: {
              ...prevError.register,
              waittingTime: null,
            },
          }));
        }
        if (data.code === 1000) {
          setModalStatus("otp");
          setError({
            ...error,
            register: {
              ...error.register,
              exitsPhone: null,
            },
          });
        }
      })
      .catch((e) => {
        setError({
          ...error,
          register: {
            ...error.register,
            server: "Lỗi từ hệ thống vui lòng thử lại",
          },
        });
      });
  };
  const value = {
    sendSMSOTPReg,
    error,
    setError,
    logOut,
    modalStatus,
    setModalStatus,
    success,
    setSuccess,
    sendRegisterAccount,
    setAccountCreateRequest,
    accountCreatRequest,
    loginRequest,
    showModal,
    userInfo,
    setShowModal,
    isLogin
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
}
