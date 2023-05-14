import {FunctionComponent} from "react";
import Admin from "./admin/Admin";
import User from "./user/User";
import UserSismo from "./user/UserSismo";
import Worldcoin from './service/Worldcoin'
import {Container, Nav, Navbar} from "react-bootstrap";

const getComponent = () => {
    switch (window.location.pathname) {
        case '/free':
            return <Worldcoin/>;
        case '/admin':
            return <Admin/>;
        case '/sismo':
            return <UserSismo/>;
        case '/':
            return <User/>;
        default:
            return undefined;
    }
}

const App: FunctionComponent = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">Global spot</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Metamask</Nav.Link>
                            <Nav.Link href="/free">Worldcoin</Nav.Link>
                            <Nav.Link href="/admin">Admin</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {getComponent()}
        </>
    );
}

export default App;
