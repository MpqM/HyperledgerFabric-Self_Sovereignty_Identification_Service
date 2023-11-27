import { useState } from "react";
import { Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import "../styles/Navi.css";

const Navi = () => {
    const [activeLink, setActiveLink] = useState('');
    const handleLinkClick = (linkName: string) => setActiveLink(linkName);

    return (
        <Navbar expand="lg" bg="dark">
            <NavLink 
                to="/" 
                className={`brand ${activeLink === 'home' ? 'active' : ''}`}
                onClick={() => handleLinkClick('home')}
            > SSI </NavLink>
            <NavLink  
                to="/issuer" 
                className={`link ${activeLink === 'issuer' ? 'active' : ''}`}
                onClick={() => handleLinkClick('issuer')}
            > Issuer </NavLink>
            <NavLink 
                to="/holder" 
                className={`link ${activeLink === 'holder' ? 'active' : ''}`}
                onClick={() => handleLinkClick('holder')}
            > Holder </NavLink>
            <NavLink 
                to="/verifier" 
                className={`link ${activeLink === 'verifier' ? 'active' : ''}`}
                onClick={() => handleLinkClick('verifier')}
            > Verifier </NavLink>
        </Navbar>
    );
}

export default Navi