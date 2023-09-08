import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import style from "../../styles/header.module.css";
import { Link } from "react-router-dom";
import auth from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import useUserData from "../../hooks/useUserData";

const Header = () => {
  const [user] = useAuthState(auth);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [usersData] = useUserData();

  const currentUser = usersData.find(
    (userData) => userData?.email === user?.email
  );

  const logout = () => {
    signOut(auth);
    setToggleMenu(!toggleMenu);
  };
  return (
    <header className={style.header}>
      <div className={style.header__logo}>
        <h1>task manager</h1>
      </div>
      <nav className={style.navbar}>
        <Link to="/">Home</Link>
        <Link to="/userslist">Users</Link>
        {user ? (
          <div className={style.user}>
            <div
              className={style.user__avatar}
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              <img src={currentUser?.img} alt="" />
            </div>
            <div
              className={
                toggleMenu
                  ? `${style.user__dropdown}`
                  : `${style.disabled__dropdown}`
              }
            >
              <Link
                to={`/profile/${currentUser?.id}`}
                onClick={() => setToggleMenu(!toggleMenu)}
              >
                <p>{user?.displayName}</p> <span>{user?.email}</span>
              </Link>
              <Link onClick={logout}>Signout</Link>
            </div>
          </div>
        ) : (
          //
          <Link to="/login">login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
