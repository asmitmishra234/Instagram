import { useContext } from "react";
import { AuthContext } from "../ContextApi";

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;