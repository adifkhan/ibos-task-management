import React, { useState } from "react";
import style from "../styles/home.module.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { idb } from "../utilities/database";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase/firebase.config";
import Tasks from "../components/Tasks";

const Home = () => {
  const [proccessing, setProccessing] = useState(false);
  const [user] = useAuthState(auth);
  const [toggleform, setToggleForm] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

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

  const onSubmit = (data) => {
    setProccessing(true);
    const dbPromise = idb.open("task-manager", 1);

    dbPromise.onerror = (event) => {
      console.log("Couldn't open IndexedDB", event);
      setProccessing(false);
      setToggleForm(false);
    };

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const transaction = db.transaction("taskCollection", "readwrite");
      const taskData = transaction.objectStore("taskCollection");

      const taskInfo = taskData.put({
        taskId: randomId(10),
        admin: user?.email,
        taskname: data.taskname,
        duedate: data.duedate,
        priority: data.priority,
        description: data.description,
        status: "not assigned",
        teammembers: [],
      });

      taskInfo.onerror = (event) => {
        console.log(event);
        setProccessing(false);
        setToggleForm(false);
      };

      taskInfo.onsuccess = () => {
        transaction.oncomplete = () => {
          console.log("db closing");
          db.close();
        };
        setProccessing(false);
        window.location.reload();
      };
    };
  };
  return (
    <div>
      <p
        style={{
          textAlign: "center",
          color: "red",
          fontSize: "1.2rem",
          marginTop: "1rem",
        }}
      >
        I could not give by best in this task due to physical illness. I hope
        you will consider... thanks.!
      </p>
      <div
        className={toggleform ? `${style.disabled}` : `${style.task__button}`}
      >
        <Link className="button" onClick={() => setToggleForm(true)}>
          Create Task
        </Link>
      </div>
      <div
        className={
          toggleform ? `${style.task__form__wrapper}` : `${style.disabled}`
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.input__group}>
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Task Name"
              {...register("taskname", {
                required: {
                  value: true,
                  message: "Task name is required",
                },
              })}
            />
            <label>
              {errors.taskname?.type === "required" && (
                <span className={style.form__message}>
                  {errors.taskname.message}
                </span>
              )}
            </label>
          </div>
          <div className={style.input__group}>
            <label>Due Date</label>
            <input
              type="date"
              {...register("duedate", {
                required: {
                  value: true,
                  message: "Due date is required",
                },
              })}
            />
            <label>
              {errors.duedate?.type === "required" && (
                <span className={style.form__message}>
                  {errors.duedate.message}
                </span>
              )}
            </label>
          </div>
          <div className={style.input__group}>
            <label>Priority Level</label>
            <select {...register("priority")}>
              <option value="Normal">Normal</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className={style.input__group}>
            <label>Task Description</label>
            <textarea
              cols="30"
              rows="5"
              placeholder="Task Description"
              {...register("description", {
                required: {
                  value: true,
                  message: "Task description is required",
                },
              })}
            ></textarea>
            <label>
              {errors.description?.type === "required" && (
                <span className={style.form__message}>
                  {errors.description.message}
                </span>
              )}
            </label>
          </div>
          <div>
            <input
              type="submit"
              value={proccessing ? "creating..." : "create"}
              className="button"
            />
            <button
              className="button__light"
              style={{ marginLeft: "20px" }}
              onClick={() => setToggleForm(false)}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
      <Tasks />
    </div>
  );
};

export default Home;
