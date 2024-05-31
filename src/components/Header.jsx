import React, { useContext } from 'react'
import Avatar from '@mui/material/Avatar';
import "./header.css"
import { LoginContext } from './ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom"

const Header = () => {

    const { logindata, setLoginData } = useContext(LoginContext);

    const history = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const logoutuser = async () => {
        let token = localStorage.getItem("usersdatatoken");
        console.log(token);
        const res = await fetch("https://backendofmam.onrender.com/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                Accept: "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data);

        if (data.status === 201) {
            console.log("User Logout");
            localStorage.removeItem("usersdatatoken");
            setLoginData(false)
            window.location.href("/signup")
        } else {
            console.log("Error");
        }
    }

    const goDash = () => {
        history("/dash")
    }

    const goExDash = () => {
        history("/examDashboard")
    }

    const goLogin = () => {
        history("/login")
    }

    const goRegister = () => {
        history("/register")
    }

    const goError = () => {
        history("*")
    }

    return (
        <>
            <header>
                <nav>
                    <div className='logo'>
                    <img src="./App_Logo1.png" alt="" />

                    <i><u><h1> Secure Pariksha </h1></u></i>
                    </div>
                    <div className="avtar">
                        {
                            logindata.ValidUserOne ? <Avatar style={{ background: "salmon", fontWeight: "bold", textTransform: "capitalize" }} onClick={handleClick}>{logindata.ValidUserOne.fname[0].toUpperCase()}</Avatar> :
                                <Avatar style={{ background: "blue" }} onClick={handleClick} />
                        }

                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            logindata.ValidUserOne ? (
                                <>
                                    <MenuItem onClick={() => {
                                        goDash()
                                        handleClose()
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        goExDash()
                                        handleClose()
                                    }}>Exam Dashboard</MenuItem>
                                    <MenuItem onClick={() => {
                                        logoutuser()
                                        handleClose()
                                    }}>Logout</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={() => {
                                        goLogin()
                                        handleClose()
                                    }}>Sign In</MenuItem>
                                    <MenuItem onClick={() => {
                                        goRegister()
                                        handleClose()
                                    }}>Sign Up</MenuItem>
                                    <MenuItem onClick={() => {
                                        goError()
                                        handleClose()
                                    }}>Profile</MenuItem>
                                </>
                            )
                        }

                    </Menu>
                </nav>
            </header>
        </>
    )
}

export default Header
