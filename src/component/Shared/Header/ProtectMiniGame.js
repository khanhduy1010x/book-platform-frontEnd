import { Navigate } from "react-router-dom";

export default function ProtectMiniGame({ isLogin,isCheckingLogin, children ,isVip}) {
    if (isCheckingLogin) {
        return null;
    }
  if (!isVip || !isLogin) {
    return <Navigate to="/member-ship" replace />;
  }

  return children;
}
