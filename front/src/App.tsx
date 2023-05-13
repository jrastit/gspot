import type {FunctionComponent} from "react";
import Admin from "./admin/Admin";
import User from "./user/User";
import UserSismo from "./user/UserSismo";

const App: FunctionComponent = () => {

    switch (window.location.pathname) {
        case '/admin':
            return <Admin/>;
        case '/sismo':
            return <UserSismo/>;
        case '/':
            return <User/>;
    }
    return null;
}

export default App;
