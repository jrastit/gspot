import {FunctionComponent} from "react";
import Admin from "./admin/Admin";
import User from "./user/User";
import UserSismo from "./user/UserSismo";
import Worldcoin from './service/Worldcoin'

const App: FunctionComponent = () => {

    switch (window.location.pathname) {
      case '/free':
          return <Worldcoin/>;
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
