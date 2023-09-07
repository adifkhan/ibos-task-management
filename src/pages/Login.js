import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import style from "../styles/register.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import auth from "../firebase/firebase.config";

const Login = () => {
  const navigate = useNavigate();
  let errorMessage;

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(data.email, data.password);
    } catch (error) {
      errorMessage = <p className={style.form__message}>{error?.message}</p>;
    }
  };
  if (error) {
    errorMessage = <p className={style.form__message}>{error?.message}</p>;
  }
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <section className={style.register}>
      <div className={style.register__container}>
        <div className="heading">
          <h2>Login</h2>
        </div>
        <div className={style.register__wrapper}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            {errorMessage}
            <input
              className="button"
              type="submit"
              value={loading ? "loging in..." : "login"}
            />
          </form>
        </div>
        <div className={style.toggle__page}>
          <p>
            New to Task Manager? Please <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
