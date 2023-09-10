import React, { useState } from "react";
import style from "../styles/register.module.css";
import { useForm } from "react-hook-form";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { idb } from "../utilities/database";
import auth from "../firebase/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Register = () => {
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [proccessing, setProccessing] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [updateProfile, updating, updateError] = useUpdateProfile(auth);

  // generating unique id for user //
  const randomId = function (length = 6) {
    const rndm = Math.random()
      .toString(36)
      .substring(2, length + 2);
    const hours = new Date().getHours();
    const mins = new Date().getMinutes();
    const id = hours + mins + rndm;
    return id;
  };

  // imgbb API key for file uploading //
  const imgStorageKey = "ec615fc495698531172416f9505b41b3";

  const onSubmit = async (data) => {
    if (data.password !== data.confirmpassword) {
      setMessage("Passwords did not match!");
      return;
    }
    setProccessing(true);
    setName(data.name);
    setEmail(data.email);
    setBio(data.bio);
    setImage(data?.image[0]);

    await createUserWithEmailAndPassword(data.email, data.password);
    await updateProfile({ displayName: data.name });
  };
  if (error) {
    console.log(error?.message);
    setMessage("Error occurred, try again");
    setProccessing(false);
  }
  if (updateError) {
    console.log(updateError?.message);
    setMessage("Couldn't update user name!");
    setProccessing(false);
  }
  if (user) {
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imgStorageKey}`;

    let imageUrl;
    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          imageUrl = result.data.url;

          // store in indexedDb//
          const dbPromise = idb.open("task-manager", 2);

          dbPromise.onerror = (event) => {
            console.log("Couldn't open IndexedDB", event);
          };
          dbPromise.onupgradeneeded = (event) => {
            const db = dbPromise.result;
            if (!db.objectStoreNames.contains("userCollection")) {
              db.createObjectStore("userCollection", { keyPath: "email" });
            }
          };

          dbPromise.onsuccess = () => {
            const db = dbPromise.result;
            const transaction = db.transaction("userCollection", "readwrite");
            const usersData = transaction.objectStore("userCollection");
            const userInfo = usersData.put({
              id: randomId(10),
              name: name,
              email: email,
              bio: bio,
              img: imageUrl,
            });

            userInfo.onsuccess = () => {
              transaction.oncomplete = () => {
                db.close();
              };
              setMessage("");
              setProccessing(false);
              // signout and navigate to login page after database is updated //
              signOut(auth);
              navigate("/login");
            };
            userInfo.onerror = (event) => {
              console.log(event);
              alert("Error occurred!");
              setProccessing(false);
            };
          };
        }
      });
  }
  return (
    <section className={style.register}>
      <div className={style.register__container}>
        <div className="heading">
          <h2>Register</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.register__wrapper}>
            <div className={style.form__left}>
              <div className={style.form__group}>
                <label htmlFor="" className={style.input__title}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  {...register("name", {
                    required: { value: true, message: "Name is required" },
                    minLength: {
                      value: 8,
                      message: "Must be longer than 8 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Must be shorter than 20 characters",
                    },
                  })}
                />
                <label>
                  {errors.name?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.name.message}
                    </span>
                  )}
                  {errors.name?.type === "minLength" && (
                    <span className={style.form__message}>
                      {errors.name.message}
                    </span>
                  )}
                  {errors.name?.type === "maxLength" && (
                    <span className={style.form__message}>
                      {errors.name.message}
                    </span>
                  )}
                </label>
              </div>
              <div className={style.form__group}>
                <label className={style.input__title}>Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "email is required",
                    },
                    pattern: {
                      value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                      message: "Provide a valid Email",
                    },
                  })}
                />
                <label>
                  {errors.email?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.email.message}
                    </span>
                  )}
                  {errors.email?.type === "pattern" && (
                    <span className={style.form__message}>
                      {errors.email.message}
                    </span>
                  )}
                </label>
              </div>
              <div className={style.form__group}>
                <label className={style.input__title}>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "password is required",
                    },
                    minLength: {
                      value: 6,
                      message: "Must be 6 characters or longer",
                    },
                    maxLength: {
                      value: 24,
                      message: "Maximum Characters 24",
                    },
                  })}
                />
                <label>
                  {errors.password?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.password.message}
                    </span>
                  )}
                  {errors.password?.type === "minLength" && (
                    <span className={style.form__message}>
                      {errors.password.message}
                    </span>
                  )}
                  {errors.password?.type === "maxLength" && (
                    <span className={style.form__message}>
                      {errors.password.message}
                    </span>
                  )}
                </label>
              </div>
              <div className={style.form__group}>
                <label className={style.input__title}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmpassword", {
                    required: {
                      value: true,
                      message: "Confirm Password",
                    },
                    minLength: {
                      value: 6,
                      message: "Must be 6 characters or longer",
                    },
                    maxLength: {
                      value: 24,
                      message: "Maximum Characters 24",
                    },
                  })}
                />
                <label>
                  {errors.confirmpassword?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.confirmpassword.message}
                    </span>
                  )}
                  {errors.confirmpassword?.type === "minLength" && (
                    <span className={style.form__message}>
                      {errors.confirmpassword.message}
                    </span>
                  )}
                  {errors.confirmpassword?.type === "maxLength" && (
                    <span className={style.form__message}>
                      {errors.confirmpassword.message}
                    </span>
                  )}
                </label>
              </div>
            </div>
            <div className={style.form__devider}></div>
            <div className={style.form__right}>
              <div className={style.form__group}>
                <label className={style.input__title}>Bio</label>
                <textarea
                  rows="2"
                  placeholder="Your Bio"
                  {...register("bio", {
                    required: { value: true, message: "Bio is required" },
                    minLength: {
                      value: 20,
                      message: "Must be longer than 20 characters",
                    },
                    maxLength: {
                      value: 180,
                      message: "Must be shorter than 180 characters",
                    },
                  })}
                ></textarea>
                <label>
                  {errors.bio?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.bio.message}
                    </span>
                  )}
                  {errors.bio?.type === "minLength" && (
                    <span className={style.form__message}>
                      {errors.bio.message}
                    </span>
                  )}
                  {errors.bio?.type === "maxLength" && (
                    <span className={style.form__message}>
                      {errors.bio.message}
                    </span>
                  )}
                </label>
              </div>
              <div className={style.form__group}>
                <label className={style.input__title}>Profile Picture</label>
                <input
                  type="file"
                  {...register("image", {
                    required: { value: true, message: "Image is required" },
                  })}
                />
                <label>
                  {errors.bio?.type === "required" && (
                    <span className={style.form__message}>
                      {errors.bio.message}
                    </span>
                  )}
                </label>
              </div>

              <div className={style.terms}>
                <label>
                  <input
                    type="checkbox"
                    name="terms"
                    onChange={() => setTerms(!terms)}
                  />
                  Agree to Terms and Conditions
                </label>
              </div>
              <div>
                {message && <p className={style.form__message}>{message}</p>}
                <input
                  className="button"
                  type="submit"
                  disabled={!terms}
                  value={
                    loading || updating || proccessing
                      ? "Resistering..."
                      : "Register"
                  }
                />
              </div>
            </div>
          </div>
        </form>
        <div className={style.toggle__page}>
          <p>
            already have an account? Please <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
