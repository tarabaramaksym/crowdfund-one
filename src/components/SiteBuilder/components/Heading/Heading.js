import InputWindow from "../InputWindow/InputWindow";

const Heading = (props) => {
  return (
    <div className="input-window-parent">
      {props.item.isInput ?
        <InputWindow style={{ textAlign: props.item.align, width: '100%', backgroundColor: props.item.backgroundColor, color: props.item.color }} item={props.item} close={props.functions.flipIsInput} onInput={props.functions.onInputChange}></InputWindow>
        :
        <h3 className='item'
          style={{ textAlign: props.item.align, width: '100%', backgroundColor: props.item.backgroundColor, color: props.item.color }} >
          {props.item.content || 'Heading'}
        </h3>
      }

    </div >
  );

}

export default Heading;