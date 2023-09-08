import React from "react";
import useUserData from "../hooks/useUserData";
import style from "../styles/userslist.module.css";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [usersData] = useUserData();

  return (
    <div className={style.users_list_container}>
      <div className="heading">
        <h2>Users List</h2>
      </div>
      <div className={style.user_list_wrapper}>
        {usersData?.map((user) => (
          <div key={user.id} className={style.user_wrapper}>
            <div className={style.user_photo}>
              <img src={user?.img} alt="" />
            </div>
            <div className={style.user_details}>
              <div>
                <p>{user?.name}</p>
                <span>{user?.email}</span>
              </div>
              <Link to={`/profile/${user?.id}`}>View Profile</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
