import { Navigate } from "react-router-dom";
import userStore from "../store/userStore.js";

const GuestRoute = ({children}) => {
    const user = userStore(state => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;

}

export default GuestRoute