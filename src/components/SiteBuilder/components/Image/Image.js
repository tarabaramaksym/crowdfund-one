import { useEffect, useRef, useState } from "react";
import InputWindow from "../InputWindow/InputWindow";

const Image = (props) => {

  const [width, setWidth] = useState();
  const ref = useRef();

  useEffect(() => {
    setWidth(ref.current.clientWidth - 10);
  })

  return (
    <div>
      {props.item.isInput && <InputWindow width={width} item={props.item} close={props.functions.flipIsInput} onInput={props.functions.onInputChange} placeholder="Input Image Url"></InputWindow>}
      <img ref={ref} className='item'
        src={props.item.content ||
          'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png'}>
      </img>

    </div>

  );
}



export default Image;