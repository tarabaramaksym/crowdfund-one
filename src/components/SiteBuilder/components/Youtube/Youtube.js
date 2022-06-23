import { useEffect, useRef, useState } from "react";
import InputWindow from "../InputWindow/InputWindow";

export default function Youtube(props) {

  const [width, setWidth] = useState();
  const ref = useRef();

  useEffect(() => {
    setWidth(ref.current.clientWidth - 10);
  })
  //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
  return (
    <div style={{ width: '100%', }} className="item">
      {props.item.isInput && <InputWindow width={width} item={props.item} close={props.functions.flipIsInput} onInput={props.functions.onInputChange} placeholder="Input Youtube Url"></InputWindow>}
      <img className="item" style={{ padding: '5px' }} ref={ref} src="https://i.pinimg.com/originals/dc/04/b4/dc04b478d1bf754bbad77320c0831640.png"></img>
    </div>
  )
}
