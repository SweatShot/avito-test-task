import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.preloaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
