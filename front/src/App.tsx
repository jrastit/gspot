import type {FunctionComponent} from "react";
import Admin from "./admin/Admin";
import User from "./user/User";

const App: FunctionComponent = () => (window.location.pathname === '/admin' ? <Admin/> : <User/>)

export default App;
