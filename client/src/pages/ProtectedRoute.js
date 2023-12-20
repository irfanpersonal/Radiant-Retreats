import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children, role}) => {
    const {user} = useSelector(store => store.user);
    if (!role.includes(user?.role)) {
        return <Navigate to='/'/>
    }
    return children;
}

export default ProtectedRoute;