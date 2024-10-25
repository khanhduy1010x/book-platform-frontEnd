import { createContext, useContext, useEffect, useState } from "react";
import { setToken, getToken, setUser,removeToken, removeUser, getUser } from "./LocalStorage";
import { useGoogleLogin } from '@react-oauth/google';  
import ForgotPassword from "../Shared/Header/ForgotPassword";

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
  const [listBookHome, setListBookHome] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [success, setSuccess] = useState({});
  const [usernameForgotPassword,setUsernameForgotPassword]=useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [created, setCreated] = useState(false);
  const [chooseMethodSendOTP, setChooseMethodSendOTP]=useState(false);
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState({
    phone: "",
    email: ""
  })
  const [isSkipPasswordPrompt, setIsSkipPasswordPrompt] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [otpForgotPassword, setOtpForgotPassword]=useState(false);
  const [accountCreatRequest, setAccountCreateRequest] = useState({
    phone: "",
    password: "",
    repassword: "",
    name: "",
    otp: "",
    username:"",
  });
  const [resetedPassword, setResetedPassword] = useState(false);
  const [tempToken, setTempToken]=useState("");
  const [invalidOtpResetPassword, setInvalidOtpResetPassword]= useState("");
  const [errorUsernameFGP, setErrorUsernameFGP]=useState("");
  const BASE_URL = "http://localhost:9999";
/////Fetch lay cac data home 
useEffect(() => {
getListBookHome();
},[])
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
    setErrorUsernameFGP("")
    setChooseMethodSendOTP(false);
    setInvalidOtpResetPassword("");
    setForgotPasswordInfo(null);
    if(modalStatus !== "forgotPassword" && modalStatus !== "otp" ){
      setUsernameForgotPassword("")
    }

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
        if (data.code !== null) {
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
  const getInfoUser = (token, googleLogin = false) => {
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
          if(!data.result.hasPassword && googleLogin) {
            if(!data.result.skip_password_prompt){
              setShowModal(true);
              setModalStatus("createPassword");
            }
          }
          setUserInfo(getUser());
          setIsLogin(true);
        }
        if (data.code !==1000) {
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
        username: phone,
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
        if (data.code !== 1000) {
          /// Code !== 1000 -> sai tai khoan or password
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
        username : accountCreatRequest.username,
        otp: otp,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code !==1000) {
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
        username: accountCreatRequest.username
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
        if(data.code === 1009) {
          setError((prevError) => ({
            ...prevError,
            register: {
              ...prevError.register,
              exitsUsername: "Tên đăng nhập đã tồn tại",
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
  ///// Login bang google 
  const googleLogin = useGoogleLogin({
    onSuccess: response => {
      const token = response.access_token; 
      fetch(`${BASE_URL}/auth/verify-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token : token
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.code === 1000) {
            setToken(data?.result.token);
            getInfoUser(data?.result.token, true);
          }
          if (data.code !== 1000) {
            /// Code !== 1000 -> sai tai khoan or password
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
    },
    onError: () => {
      console.error('Login with Google failed');
    },
  });

  const createPassword = (password) => {
    const token = getToken();
    fetch(`${BASE_URL}/auth/create-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify({
        password: password
      }),
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if(data.code === 1000) {
        setCreated(true);
      }
    })
  }
  const skipPasswordPrompt = () => {
    const token = getToken();
    fetch(`${BASE_URL}/account/set-password-prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify({
        skip: true
      }),
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.code === 1000) {
        console.log("Chang prompt isOK");
      }
    }).catch((error) => {
      console.log("Error chang prompt password", error)
    })
  }
  const getInfoForgotPassword = () => {
    fetch(`${BASE_URL}/account/get-info-reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameForgotPassword,
      }),
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.code === 1000) {
        setChooseMethodSendOTP(true);
        setForgotPasswordInfo({
        ...data.result
        })
      }else {
        setErrorUsernameFGP("Không tìm thấy tài khoản này vui lòng kiểm tra lại")
        console.log("Khong ton tai")
      }
    }).catch((error) => {
      console.log("Error chang prompt password", error)
    })
  } 
  const sendOTPForgotPassword = (isPhone) => {
    setOtpForgotPassword(true);
    setModalStatus("otp");
    fetch(`${BASE_URL}/auth/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameForgotPassword,
        isPhone: isPhone
      }),
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.code === 1000) {
     console.log("dagui");
        
      }else {
        console.log("Khong ton tai")
      }
    }).catch((error) => {
      console.log("Error chang prompt password", error)
    })
  } 
  const validateOtpForgotPassword = (otp) => {
    fetch(`${BASE_URL}/auth/validate-otp-forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        username:usernameForgotPassword
      }),
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.code === 1000) {
       setTempToken(data.result.tempToken)
       setModalStatus("forgotPasswordCreatePass");
      }else {
        setInvalidOtpResetPassword("Mã xác thực không chính xác vui lòng thử lại");
      }
    }).catch((error) => {
      console.log("Error chang prompt password", error)
    })
  } 
  const resetPasswordForForgotPassword = (password) => {
    fetch(`${BASE_URL}/auth/reset-password-forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : `Bearer ${tempToken}`
      },
      body: JSON.stringify({
        password: password,
      }),
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.code === 1000) {
        console.log("Doi password thanh cong")
        setResetedPassword(true)
      }
    }).catch((error) => {
      console.log("Error chang prompt password", error)
    })
  }  
   /// Lay thong tin user
   const getListBookHome = () => {
    fetch(`${BASE_URL}/book/list-book`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setListBookHome(data?.result);
        }
        if (data.code !==1000) {
        }
      })
      .catch((e) => {});
  };
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
  const value = {
    validateOtpForgotPassword,
    skipPasswordPrompt,
    sendOTPForgotPassword,
    createPassword,
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
    setUsernameForgotPassword,
    usernameForgotPassword,
    isLogin,
    googleLogin,
    created,
    getInfoForgotPassword,
    setChooseMethodSendOTP,
    chooseMethodSendOTP,
    forgotPasswordInfo,
    chooseMethodSendOTP,
    otpForgotPassword,
    resetedPassword,
    resetPasswordForForgotPassword,
    errorUsernameFGP,
    invalidOtpResetPassword,
    listBookHome,
    setListBookHome,
    formatNumber
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
}