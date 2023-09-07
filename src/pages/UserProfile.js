import React from "react";
import style from "../styles/profile.module.css";
import useUserData from "../hooks/useUserData";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase/firebase.config";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [usersData] = useUserData();

  const currentUser = usersData.find(
    (userData) => userData.email === user.email
  );

  return (
    <section className={style.profile__container}>
      <div className={style.user__wrapper}>
        <div className={style.avatar}>
          <img src={currentUser?.img} alt="" />
        </div>
        <div className={style.user__info}>
          <h2>
            <span>Name :</span> {currentUser?.name}
          </h2>
          <h3>
            <span>Email :</span> {currentUser?.email}
          </h3>
          <h3>
            <span>ID :</span> {currentUser?.id}
          </h3>
          <p>
            <span>Bio :</span> {currentUser?.bio}
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
