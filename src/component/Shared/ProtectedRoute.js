import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isLogin, children , isCheckingLogin ,isAdmin=false}) {
    if (isCheckingLogin) {
        return null;
    }
    
  if (!isLogin ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
