import { useState } from "react";
import Loader from "../Loader/Loader";

const Button = (props) => {

  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await props.onClick();
    }
    catch { }

    setLoading(false);
  }

  return <button className={props.className} onClick={onClick}>{loading ? <Loader /> : props.children}</button>
}

export default Button;