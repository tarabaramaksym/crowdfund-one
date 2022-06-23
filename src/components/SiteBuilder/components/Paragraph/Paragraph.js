import InputWindow from '../InputWindow/InputWindow';
import './Paragraph.css';

const Paragraph = (props) => {
  return (
    <div className="input-window-parent paragraph">
      {
        props.item.isInput ?
          <InputWindow item={props.item} close={props.functions.flipIsInput} onInput={props.functions.onInputChange} type="textarea"></InputWindow>
          :
          <pre><p className='item' style={{ textAlign: props.item.align, width: '100%', backgroundColor: props.item.backgroundColor, color: props.item.color }} >
            {props.item.content.trim() !== '' ? props.item.content :
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nulla enim, viverra ac egestas nec, pellentesque et nisi. Vivamus diam justo, tincidunt sit amet auctor et, iaculis vitae erat. Mauris auctor nisi eu purus tristique, in condimentum dui aliquet. Sed et felis fermentum nunc imperdiet pharetra et eu purus. Sed in tincidunt arcu. Vestibulum ultricies, velit in pretium fringilla, tellus elit laoreet diam, id ultrices mi mi nec diam. Sed lacinia vulputate ante consequat tempus. Phasellus condimentum nisi a elementum elementum. Sed fringilla elit lorem, sed tincidunt odio suscipit non. Morbi sollicitudin eget quam et pellentesque.'
            }</p>

          </pre>
      }
    </div>

  );
}


export default Paragraph;