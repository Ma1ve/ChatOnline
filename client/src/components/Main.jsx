import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import styles from '../styles/Main.module.css';

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
};

const Main = () => {
  const { NAME, ROOM } = FIELDS;

  const [values, setValues] = useState({ [NAME]: '', [ROOM]: '' });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const handleClick = (e) => {
    const isDisabled = Object.values(values).some((v) => !v);

    if (isDisabled) e.preventDefault();
  };
  console.log(values);
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>JOIN</h1>
        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="name"
              value={values[NAME]}
              className={styles.input}
              placeholder="name"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              value={values[ROOM]}
              className={styles.input}
              placeholder="Room"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <Link
            className={styles.group}
            to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}
            onClick={handleClick}>
            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;
