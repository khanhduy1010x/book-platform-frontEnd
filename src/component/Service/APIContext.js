import { createContext, useContext, useEffect, useState } from "react";
import { setToken, getToken, setUser,removeToken, removeUser, getUser } from "./LocalStorage";
import { useGoogleLogin } from '@react-oauth/google';  
import ForgotPassword from "../Shared/Header/ForgotPassword";
import { json, useNavigate, useParams } from "react-router-dom";

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
  const [listVoucher, setListVoucher] = useState([]);
  const [isAddCart, setIsAddCart] = useState(false);
  const [listCart, setListCart] = useState([]);
  const [listBookByCateAndBookType,setListBookByCateAndBookType]= useState([])
  const [listBookHome, setListBookHome] = useState([]);
  const [listBanner, setListBanner] = useState([]);
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
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [isServerDown, setIsServerDown] = useState(false);
  const [serverCheckDone, setServerCheckDone] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "";
  const [orderCreationRequest, setOrderCreationRequest] = useState({
     province: "",
     district: "",
     wards: "",
     shipDetail: "",
     name: "",
     phone: "",
     paymentMethod: "",
  })
  const [listOrder, setListOrder] = useState([])
  const [listBookByBookType, setListBookByBookType] = useState([]);
  const [memberPackage, setMemberPackage]=useState({});
/////Fetch lay cac data home 
useEffect(() =>{
  getInfoUser();
},[])  

/// Kiem tra may chu con song khong
useEffect(() => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  fetch(`${BASE_URL}/banner`, {
    method: "GET",
    signal: controller.signal,
  })
    .then(() => {
      clearTimeout(timeoutId);
      setIsServerDown(false);
    })
    .catch((err) => {
      clearTimeout(timeoutId);
      // Neu la AbortError (timeout) hoac TypeError (network fail) → server down
      if (err.name === "AbortError" || err instanceof TypeError) {
        setIsServerDown(true);
      }
    })
    .finally(() => {
      setServerCheckDone(true);
    });

  return () => {
    clearTimeout(timeoutId);
    controller.abort();
  };
}, []);

  // Kiem tra token xem con han khong ( introspect ) 
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const token = getToken();
    if (token && !isFetching) {
      setIsFetching(true);
      fetch(`${BASE_URL}/auth/introspect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsFetching(false);
          if (data.code === 1000 && data.result.valid) {
            setIsLogin(true);
            getInfoUser(token);
            setUserInfo(getUser());
          } else {
            refreshToken();
          }
        })
        .catch(() => {
          setIsFetching(false);
        })
        .finally(() => {
          setIsCheckingLogin(false); 
        });
    } else {
      setIsCheckingLogin(false); 
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
          setUserInfo(data.result);
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
        else if (data.code === 1060) {
          /// Code !== 1000 -> sai tai khoan or password
          setError({
            ...error,
            isBanned:true
          });
        } else {
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

  ///// Dang ki tai khoan (khong can OTP)
  const sendRegisterAccount = () => {
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
        otp: "",
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
        phone: isPhone
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
   /// get all book home by cate
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

  /// get banner 
  const getListBanner = () => {
    fetch(`${BASE_URL}/banner/view-banner`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setListBanner(data?.result);
        }
        if (data.code !==1000) {
        }
      })
      .catch((e) => {});
  };
  function formatNumber(num) {
    if(!num) return 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
  function memberMapper(memberType) {
    return memberType === "BASIC" ? "Thành viên bạc" : memberType === "ADVANCE" ? "Thành viên vàng" :  memberType === "PREMIUM" ? "Thành viên kim cương" : null 
  }
  const [bookDetail, setBookDetail] = useState(null); // Tạo state để lưu thông tin sách

  const [listBookLike, setListBookLike] = useState([])
const nagivate = useNavigate();
  const getDetailBook = (id) => {
    const token = getToken();
    const isLogin = !!token;
    fetch(`${BASE_URL}/book/book-detail/${id}`, {
      method: "GET",
      headers: isLogin
        ? { Authorization: `Bearer ${token}` }
        : {},
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          if(!data.result.book.isVisible) {
            nagivate("/");
          }
          setBookDetail(data.result); // Cập nhật state với dữ liệu sách
          getBookLike(data.result.book.category.cateName, data.result.book.bookType)
        } else {
          nagivate("/")
          console.error("Failed to fetch book details:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching book details:", error);
      });
  };
  const getDetailBook2 = async (id) => {
    const token = getToken();
    const isLogin = !!token;
  
    try {
      const response = await fetch(`${BASE_URL}/book/book-detail/${id}`, {
        method: "GET",
        headers: isLogin
          ? { Authorization: `Bearer ${token}` }
          : {},
      });
  
      const data = await response.json();
  
      if (data.code === 1000) {
        return data.result; 
      } else {
        console.error("Failed to fetch book details:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null; 
    }
  };
  
  
  async function getEpubFile(id) {
    try {
      const response = await fetch(`${BASE_URL}/book/book-detail/${id}`, {
        method: "GET",
      });
      const data = await response.json();

      if (data.code === 1000) {
        return data.result.url; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error("Error fetching book details:", error);
      return null; 
    }
  }
  async function searchBook(param) {
    try {
      const response = await   fetch(`${BASE_URL}/book/search/${param}`, {
        method: "GET",
      });
      const data = await response.json();

      if (data.code === 1000) {
        return data.result; 
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Error fetching book search:", error);
      return []; 
    }
  }
  async function searchBookAdmin(param) {
    try {
      const response = await   fetch(`${BASE_URL}/book/search-admin/${param}`, {
        method: "GET",
      });
      const data = await response.json();

      if (data.code === 1000) {
        return data.result; 
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Error fetching book search:", error);
      return []; 
    }
  }
  async function getAllCateByBookType(param) {
    try {
      const response = await   fetch(`${BASE_URL}/book/filter-cate?bookType=${param}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.code === 1000) {
        return data.result; 
      } else {
        return []; 
      }
    } catch (error) {
      console.error("Error fetching book search:", error);
      return []; 
    }
  }
  const getListBookByCateAndBookType = (cate,bookType) => {
    fetch(`${BASE_URL}/book/get-by-cate-type?bookType=${bookType}&cateID=${cate}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setListBookByCateAndBookType(data?.result);
        }
        if (data.code !==1000) {
        }
      })
      .catch((e) => {});
  };
  const getListBookByBookType =  async (bookType) => {
    fetch(`${BASE_URL}/book/get-by-type/${bookType}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.code === 1000) {
          setListBookByBookType(data?.result);
        }
        if (data.code !==1000) {
        }
      })
      .catch((e) => {});
  };
 /////Cart 
  const getListCart = () => {
    const token = getToken();
    console.log("isOk")
  
      fetch(`${BASE_URL}/cart/view`, {
        method: "GET",
        headers: {
          Authorization : `Bearer ${token}`
        }
      },
    ).then((response) => {
      return response.json();
    }
    ).then((data) => {
      if (data.code === 1000) {
        setListCart(data.result)
      } else {
        setListCart([])
      }
    }).catch((error) => {

    });      
  
  }
  
  const addToCart = (bookID, quantity) => {
    if(!isLogin) {
      setModalStatus('login')
      setShowModal(true)
      return;
    }
    
    const token= getToken();
    fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": 'Application/json',
        Authorization : `Bearer ${token}`
      }
      ,body: JSON.stringify({
        bookId: bookID,
        quantity: quantity
      })
     
      
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
      getListCart();
      setIsAddCart(true)
    } else {
    }
  }).catch((error) => {

  });
  }

  const deleteToCart = (cartItemID) => {
    const token= getToken();
    fetch(`${BASE_URL}/cart/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": 'Application/json',
        Authorization : `Bearer ${token}`
      }
      ,body: JSON.stringify({
        cartItemID: cartItemID,     
      }) 
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
      getListCart()
    } else {
    }
  }).catch((error) => {

  });
  }
  const updateCartItem = (cartId,quantity) => {
    const token= getToken();
    fetch(`${BASE_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": 'Application/json',
        Authorization : `Bearer ${token}`
      }
      ,body: JSON.stringify({
        cartId: cartId,  
        quantity: quantity
      }) 
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
      getListCart()
    } else {
    }
  }).catch((error) => {

  });
  }
  const getAllVoucher = () => {
    const token= getToken();
    fetch(`${BASE_URL}/voucher/get-voucher-available`, {
      method: "GET",
      headers: {
        "Content-Type": 'Application/json',
        Authorization : `Bearer ${token}`
      }
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
      setListVoucher(data.result)
    } else {
    }
  }).catch((error) => {

  });
  }
  const addVoucherToCart = (voucherID) => {
    const token= getToken();
    fetch(`${BASE_URL}/voucher/add-voucher`, {
      method: "POST",
      headers: {
        "Content-Type": 'Application/json',
        Authorization : `Bearer ${token}`
      },
      body : JSON.stringify({
        voucherID : voucherID
      })
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
      getAllVoucher();
      getListCart();
    } else {
    }
  }).catch((error) => {

  });
  }

  const createOrderInCart = async (province, district, wards, shipDetail, name, phone, paymentMethod) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/api/order/create-from-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Chú ý chữ "Application/json" nên là "application/json"
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          province,
          district,
          wards,
          shipDetail,
          name,
          phone,
          paymentMethod,
        }),
      });
      const data = await response.json();
      if (data.code === 1000) {
        getListCart()
        return 0; 
      } else if(data.code === 1057) {
        return -3; 
      } else {
        return -1;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      return -1; 
    }
  };
  
  const getAllOrder = (page = 0, size = 10) => {
    const token = getToken();
    fetch(`${BASE_URL}/api/order/get-all-order?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 1000) {
          setListOrder(data.result);
        } else {
        }
      })
      .catch((error) => {
        console.error('Error fetching order history:', error);
      });
  };
  function formatDate(dateStr) {
    if(!dateStr) return;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); 
}
function mapPaymentStatusToVietnamese(status) {
  const statusMap = {
      PENDING: 'Đang chờ thanh toán',
      COMPLETED: 'Đã thanh toán',
      FAILED: 'Thất bại',
      CANCELLED: 'Đã hủy',
      REFUNDED: 'Đã hoàn tiền'
  };

  return statusMap[status] || 'Trạng thái không xác định';
}
function mapPaymentMethodToVietnamese(method) {
  const methodMap = {
      CASH: 'Thanh toán khi nhận hàng',
      ONLINE: 'Tiền trên website',
      QR: 'Thanh toán qua mã QR'
  };

  return methodMap[method] || 'Phương thức thanh toán không xác định';
}
function mapShipStatusToVietnamese(status) {
  const statusMap = {
      PENDING: 'Đang chờ xử lý',
      SHIPPED: 'Đã gửi',
      IN_TRANSIT: 'Đang vận chuyển',
      DELIVERED: 'Đã giao',
      RETURNED: 'Đã trả lại',
      CANCELLED: 'Đã hủy'
  };

  return statusMap[status] || 'Trạng thái không xác định';
}


const getOrderDetail = async (orderID) => {
  // const token= getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/api/order/view/${orderID}`, {
      method: "GET",
      // headers: {
      //   Authorization : `Bearer ${token}`
      // }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else {
    return -1;
  }
  }catch(e) {
    console.log(e)
  }
};
const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "orange-500"; 
    case "SHIPPED":
      return "blue-500";   
    case "IN_TRANSIT":
      return "indigo-500"; 
    case "DELIVERED":
      return "green-500";  
    case "RETURNED":
      return "red-500";    
    case "CANCELLED":
      return "gray-500";   
    default:
      return "gray-400";   
  }
  }

  const getQRCodeOrder = async (request) => {

    const token= getToken();
    try {
      const response = await
      fetch(`${BASE_URL}/paymentQR/get-qr-order`, {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${token}`
        }
        ,
        body:JSON.stringify(
          request
        )
      })
     const data = await response.json();
     if (data.code === 1000) {
      console.log(data.result)
      return data.result; 
      } else {
      return false;
    }
    }catch(e) {
      console.log(e)
    }
  }
  const [isCompleteQROrder, setIsCompleQROrder] = useState(false);
  const checkQROrder = (message) => {
    if(!isLogin) return;
    var token = getToken();
    const intervalId = setInterval(async () => {
        try {
            const response = await fetch(`${BASE_URL}/paymentQR/check-payment-qr-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify({
                  messageKey: message
                }
                  
                )
            });
            const data = await response.json();
            if (data.code === 1000) {
              if( data.result.status) {
                setIsCompleQROrder(true)
                clearInterval(intervalId); 
            }
          }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 1000); 
};

const getMemberShipPackage = async () => {
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/get-all`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    console.log(data.result)
    return data.result; 
    } else {
    return false;
  }
  }catch(e) {
    console.log(e)
  }
}
const paymentOnlineMemberPackage = async (id) => {
  const token= getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/buy-package-by-amount`, {
      method: "POST",
      headers: {
        Authorization : `Bearer ${token}`,
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        packageID : id 
      })
    })
   const data = await response.json();
   if (data.code === 1000) {
    getInfoUser(token);
    } 
    return data.code;
  
  }catch(e) {
    console.log(e)
  }
};
const getSaleMemberShipPackage = async (id) => {
  var token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/check-ownership-package/${id}`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result.salePrice; 
    } else {
    return data.code.result;
  }
  }catch(e) {
    console.log(e)
  }
}
const getQRCodeMemberPackage = async (request) => {
  const token= getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/paymentQR/get-qr-member-package`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        Authorization : `Bearer ${token}`
      }
      ,
      body:JSON.stringify(
        request
      )
    })
   const data = await response.json();
   if (data.code === 1000) {
    console.log(data.result)
    return data.result; 
    } else {
    return false;
  }
  }catch(e) {
    console.log(e)
  }
}
const getNotification = async (request) => {
  const token= getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/notification/get-notification`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else {
    return false;
  }
  }catch(e) {
    console.log(e)
  }
}
const [isCompletePackage, setIsCompletePackage] = useState(false);
const checkQRMemberPackage = (message) => {
  if(!isLogin) return;
  var token = getToken();
  const intervalId = setInterval(async () => {
      try {
          const response = await fetch(`${BASE_URL}/paymentQR/check-payment-package-qr-status`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body : JSON.stringify({
                messageKey: message
              }
                
              )
          });
          const data = await response.json();
          if (data.code === 1000) {
            if( data.result.status) {
              setIsCompletePackage(true)
              clearInterval(intervalId); 
          }
        }
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }, 1000); 
};
const createComment = (bookID, rate, comment,id) => {
  const token = getToken();
  console.log("isOk")

    fetch(`${BASE_URL}/api/book-rate/add`, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        Authorization : `Bearer ${token}`
      }
      ,body: JSON.stringify({
        bookID: bookID,
        rate: rate,
        comment: comment
      })
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
        console.log("isOK")
        getDetailBook(id)
    } else {
      console.log("isOK")
    }
  }).catch((error) => {

  });      

}
const updateComment = (bookRateID, rate, comment,id) => {
  const token = getToken();
  console.log("isOk")

    fetch(`${BASE_URL}/api/book-rate/update`, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        Authorization : `Bearer ${token}`
      }
      ,body: JSON.stringify({
        bookRateID: bookRateID,
        rate: rate,
        comment: comment
      })
    },
  ).then((response) => {
    return response.json();
  }
  ).then((data) => {
    if (data.code === 1000) {
        console.log("isOK")
        getDetailBook(id)
    } else {
      console.log("isOK")
    }
  }).catch((error) => {

  });      

}
const buyEbook = async (id) => {
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/book/buy-ebook`, {
      method: "POST",

      headers: {
        'Content-Type' : 'application/json',
        Authorization : `Bearer ${token}`
      }
      ,body : JSON.stringify({
        bookID: id 
      })
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else if (data.code  === 1054 ){
    return false;
  }
  }catch(e) {
    console.log(e)
  }    

}
const addHistory = async (id,percent) => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/account/book/add-history`, {
      method: "POST",

      headers: {
        'Content-Type' : 'application/json',
        Authorization : `Bearer ${token}`
      }
      ,body : JSON.stringify({
        bookID: id ,
        percent : percent

      })
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getBookReaded = async () => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/account/book/history`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getBookBought = async () => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/book/get-book-bought`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const addFavorite  = async (id) => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/api/favorite/add`, {
      method: "POST",
      headers: {
        "Content-Type" : 'application/json',
        Authorization : `Bearer ${token}`
      },
      body: JSON.stringify({
        bookID: id
      })
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getFavorite  = async (id) => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/api/favorite/get-all`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getTransBuyMemberPack  = async (id,page,size) => {
  if(!isLogin) return;
  const token = getToken();
  try {
    const response = await
    fetch(`${BASE_URL}/account/transaction/history-member-package/${id}?page=${page}&size=${size}`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const editAvatar = async (avatarFile) => {
  if (!isLogin) return;
  const token = getToken();
  try {
    const formData = new FormData();
    formData.append("file", avatarFile);
    const response = await fetch(`${BASE_URL}/account/edit-avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await response.json();
    if (data.code === 1000) {
      // Backend đã lưu xong mới trả result, cập nhật trực tiếp không cần reload
      setUserInfo(prev => ({ ...prev, avatar: data.result + "?t=" + Date.now() }));
    }
    return data.code === 1000;
  } catch (e) {
    console.error("Error uploading avatar:", e);
    return false;
  }
};
const editInfor = async (name, birth) => {
  // Optimistic update
  const prevInfo = { fullName: userInfo?.fullName, birth: userInfo?.birth };
  setUserInfo(prev => ({ ...prev, fullName: name, birth }));
  try {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/account/edit-information`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, birth })
    });

    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      // Revert nếu thất bại
      setUserInfo(prev => ({ ...prev, fullName: prevInfo.fullName, birth: prevInfo.birth }));
      console.error("Error updating information:", data.message);
      return null;
    }
  } catch (error) {
    setUserInfo(prev => ({ ...prev, fullName: prevInfo.fullName, birth: prevInfo.birth }));
    console.error("Error in editInfor API:", error);
  }
};
const changePassword = async (newPassword, confirmationNewPassword) => {
  try {
    const token = getToken(); 
    const response = await fetch(`${BASE_URL}/auth/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword,
        confirmationNewPassword,
      }),
    });

    const data = await response.json();
    if (data.code === 1000) {
      console.log("Password changed successfully");
      return true; 
    } else {
      console.error("Failed to change password:", data.message);
      return false; 
    }
  } catch (error) {
    console.error("Error in changePassword API:", error);
    return false; 
  }
};
const getAllBookForAdmin  = async (type,page,size) => {
 
  try {
    const response = await
    fetch(`${BASE_URL}/book/get-all-book/${type}?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getAllCate  = async () => {
  try {
    const response = await
    fetch(`${BASE_URL}/book/get-all-cate`, {
      method: "GET",
      headers: {
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getAllAuthor  = async () => {
  try {
    const response = await
    fetch(`${BASE_URL}/book/get-all-author`, {
      method: "GET",
      headers: {
      }
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const addNewBook = async (formData) => {
  try {

    const response = await fetch(`${BASE_URL}/book/add-new-book`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.code === 1000) {
      return data.result; 
    } else {
      return false; 
    }
  } catch (e) {
    console.error("Lỗi khi thêm sách mới:", e);
    return false;
  }
};
const updateBook = async (formData) => {
  try {

    const response = await fetch(`${BASE_URL}/book/update-book`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.code === 1000) {
      return data.result; 
    } else {
      return false; 
    }
  } catch (e) {
    console.error("Lỗi khi update:", e);
    return false;
  }
};
const getAllOrderForAdmin  = async (type,page,size) => {
 
  try {
    const response = await
    fetch(`${BASE_URL}/api/order/admin/get-all-order/${type}?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const changeStatus = async (request) => {
  try {

    const response = await fetch(`${BASE_URL}/api/order/change-status`, {
      method: "POST",
      headers: {
        "Content-Type" : 'application/json'
      },
      body: JSON.stringify(request)
    });
    const data = await response.json();

    if (data.code === 1000) {
      return data.result; 
    } else {
      return false; 
    }
  } catch (e) {
    console.error("Lỗi khi update:", e);
    return false;
  }
};
const searchOrder = async (request) => {
  try {

    const response = await fetch(`${BASE_URL}/api/order/search/${request}`, {
      method: "GET",
    });
    const data = await response.json();

    if (data.code === 1000) {
      return data.result; 
    } else {
      return false; 
    }
  } catch (e) {
    console.error("Lỗi khi update:", e);
    return false;
  }
};
const getAllAccount = async (type,page,size) => {
 
  try {
    const response = await
    fetch(`${BASE_URL}/account/get-all-admin/${type}?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const searchAccount = async (param) => {

  try {
    const response = await
    fetch(`${BASE_URL}/account/search-account/${param}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const changeRole = async (id) => {
  try {
    const response = await
    fetch(`${BASE_URL}/account/change-role/${id}`, {
      method: "POST",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const changeAccountStatus = async (id) => {
  try {
    const response = await
    fetch(`${BASE_URL}/account/change-account-status/${id}`, {
      method: "POST",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getInfoByIDUser = async (id) => {
  try {
    const response = await
    fetch(`${BASE_URL}/account/get-info-by-id/${id}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getBanners = async () => {
  try {
    const response = await fetch(`${BASE_URL}/banner/view-banner`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error fetching banners:", e);
    return false;
  }
};
const createBanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await fetch(`${BASE_URL}/banner/create-banner`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.code === 1000) {
      return true; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error creating banner:", e);
    return false;
  }
};
const deleteBanner = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/banner/delete-banner/${id}`, {
      method: "POST",
    });

    const data = await response.json();
    if (data.code === 1000) {
      return true; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error deleting banner:", e);
    return false;
  }
};
const getAllMemberPackageAdmin = async (type,page,size) => {
 
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/admin/get-all-mp/${type}?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}

const addNewMemberPackage = async (memberPackage) => {
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/add-new`, {
      method: "POST",
      headers: {
        "Content-type" : 'application/json'
      },
      body : JSON.stringify(memberPackage)
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const editMemberPackage = async (memberPackage) => {
  try {
    const response = await
    fetch(`${BASE_URL}/member-ship/edit-pkg`, {
      method: "POST",
      headers: {
        "Content-type" : 'application/json'
      },
      body : JSON.stringify(memberPackage)
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getAllAuthors = async (page,size) => {
  try {
    const response = await
    fetch(`${BASE_URL}/author/get-all?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const createAuthor = async (file,name) => {
  try {

    const formData = new FormData();
    formData.append("multipartFile", file);
    formData.append("name", name);
    const response = await fetch(`${BASE_URL}/author/add-new`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.code === 1000) {
      return true; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error creating banner:", e);
    return false;
  }
};
const editAuthor = async (id,file,name) => {
  try {

    const formData = new FormData();
    formData.append("id", id);
    if(file) {
      formData.append("multipartFile", file);

    }
    formData.append("name", name);
    const response = await fetch(`${BASE_URL}/author/update-author`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.code === 1000) {
      return true; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error creating banner:", e);
    return false;
  }
};
const searchAuthor = async (search) => {
  try {
   
    const response = await fetch(`${BASE_URL}/author/search-author/${search}`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error creating banner:", e);
    return false;
  }
};
const getRecommend = async () => {
  const token = getToken();
  try {
    const response = await fetch(`${BASE_URL}/account/book/recommend`, {
      method: "GET",
      headers: {
        Authorization : `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result; 
    } else {
      return false;
    }
  } catch (e) {
    console.error("Error creating banner:", e);
    return false;
  }
};
/////STATIC 

// Lấy danh sách các sách được mua nhiều nhất
const getMostPurchasedBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistic/most-purchased-books`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

// Lấy danh sách các sách được đọc nhiều nhất
const getMostReadBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistic/most-read-books`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

// Lấy danh sách người dùng đọc nhiều nhất
const getMostReader = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistic/most-reader`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

// Lấy danh sách người dùng trả tiền nhiều nhất
const getPayMostUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/statistic/pay-most-user`, {
      method: "GET",
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};
const getRevenueByBook = async (requestBody) => {
  try {
    const response = await fetch(`${BASE_URL}/statistic/revenue-by-book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const getStatisticsByMembershipPackage = async (requestBody) => {
  try {
    const response = await fetch(
      `${BASE_URL}/statistic/statistics-by-membership-package`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );
    const data = await response.json();
    if (data.code === 1000) {
      return data.result;
    } else {
      console.error(data.message);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const getAllVoucherADmin = async (page,size) => {
  try {
    const response = await
    fetch(`${BASE_URL}/voucher/get-all-admin?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const searchVoucher = async (param) => {
  try {
    const response = await
    fetch(`${BASE_URL}/voucher/search/${param}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const addNewVoucherAdmin = async (voucher) => {
  try {
    const response = await
    fetch(`${BASE_URL}/voucher/add-new-voucher`, {
      method: "POST",
      headers:{
        "Content-type" :'application/json'
      },
      body: JSON.stringify(voucher)
    })
   const data = await response.json();
   if (data.code === 1000) {
    return true; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getAllTransAdmin = async (num, page,size) => {
  try {
    const response = await
    fetch(`${BASE_URL}/account/transaction/admin/get-transaction/${num}?page=${page}&size=${size}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const searchTrans = async (param) => {
  try {
    const response = await
    fetch(`${BASE_URL}/account/transaction/search/${param}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getBookLike = async (cate,bookType) => {
  try {
    const response = await
    fetch(`${BASE_URL}/book/find-by-cate-and-bookType/${cate}/${bookType}`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return setListBookLike(data.result); 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
const getAllListAuthor = async () => {
  try {
    const response = await
    fetch(`${BASE_URL}/author/get-all-home`, {
      method: "GET",
    })
   const data = await response.json();
   if (data.code === 1000) {
    return data.result; 
    } else{
    return false;
  }
  }catch(e) {
    console.log(e)
  }    
}
  const value = {
    getAllListAuthor,
    listBookLike,
    getBookLike,
    searchTrans,
    getAllTransAdmin,
    addNewVoucherAdmin,
    searchVoucher,
    getAllVoucherADmin,
    getMostPurchasedBooks,
  getMostReadBooks,
  getMostReader,
  getPayMostUser,
  getRevenueByBook,
  getStatisticsByMembershipPackage,
    getRecommend,
    searchAuthor,
    editAuthor,
    createAuthor,
    getAllAuthors,
    addNewMemberPackage,
    getAllMemberPackageAdmin,
    getBanners,
    createBanner,
    deleteBanner,
    getInfoByIDUser,
    changeRole,
    changeAccountStatus,
    getEpubFile,
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
    registerAccount: sendRegisterAccount,
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
    getListBookHome,
    resetPasswordForForgotPassword,
    errorUsernameFGP,
    invalidOtpResetPassword,
    listBookHome,
    setListBookHome,
    formatNumber,
    memberMapper,
    listBanner,
    getListBanner,
    getDetailBook,
    searchBook,
    getAllCateByBookType,
    getListBookByCateAndBookType,
    listBookByCateAndBookType,
    getListCart,
    listCart,
    addToCart,
    isAddCart,
    setIsAddCart,
    deleteToCart,
    updateCartItem,
    getAllVoucher,
    listVoucher,
    addVoucherToCart,
    setOrderCreationRequest,
    createOrderInCart,
    getAllOrder,
    listOrder,
    formatDate,
    mapPaymentStatusToVietnamese,
    mapPaymentMethodToVietnamese,
    mapShipStatusToVietnamese,
    getOrderDetail,
    getStatusColor,
    getListBookByBookType,
    listBookByBookType,
    getQRCodeOrder,
    checkQROrder,
    isCompleteQROrder,
    getMemberShipPackage,
    setMemberPackage,
    memberPackage,
    paymentOnlineMemberPackage,
    getSaleMemberShipPackage,
    getQRCodeMemberPackage,
    getNotification,
    checkQRMemberPackage,
    isCompletePackage,
    setIsCompletePackage,
    createComment,
    updateComment,
    bookDetail,
    buyEbook,
    addHistory,
    getDetailBook2,
    getBookReaded,
    getBookBought,
    addFavorite,
    getFavorite,
    getTransBuyMemberPack
    ,editAvatar
    ,editInfor
    ,changePassword,
    isCheckingLogin,
    isServerDown,
    serverCheckDone,
    getAllBookForAdmin,
    getAllCate,
    getAllAuthor,
    addNewBook,
    updateBook,
    searchBookAdmin,
    getAllOrderForAdmin,
    formatDate,
    changeStatus,
    searchOrder,
    getAllAccount,
    searchAccount,
    editMemberPackage
  };

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
}