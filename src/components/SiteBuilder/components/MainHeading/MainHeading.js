import InputWindow from "../InputWindow/InputWindow";
import './MainHeading.css';

const MainHeading = (props) => {

  return (
    <div style={{ width: '100%' }}>
      {
        props.item.isInput ?
          <InputWindow style={{ textAlign: props.item.align, width: '100%', backgroundColor: props.item.backgroundColor, color: props.item.color }} item={props.item} close={props.functions.flipIsInput} onInput={props.functions.onInputChange}></InputWindow>
          :
          <h1 className='item' style={{ textAlign: props.item.align, width: '100%', backgroundColor: props.item.backgroundColor, color: props.item.color }} >{props.item.content || "Your Campaign Name"}</h1>
      }

    </div >
  );

}

export default MainHeading;