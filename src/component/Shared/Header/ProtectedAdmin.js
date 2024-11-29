import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ isLogin,isCheckingLogin, children ,isAdmin}) {
    if (isCheckingLogin) {
        return null;
    }
  if (!isAdmin || !isLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
