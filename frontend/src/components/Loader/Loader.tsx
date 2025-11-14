import { FC } from "react";
import "./Loader.css";

const Loader: FC = () => {
  return (
    <div className="preloader-container">
      <div className="spinner" />
    </div>
  );
};

export default Loader;
