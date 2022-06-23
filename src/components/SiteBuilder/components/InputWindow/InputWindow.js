import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import ModalWindow from '../../../shared-components/ModalWindow/ModalWindow';
import './InputWindow.css';

const InputWindow = (props) => {

  const [state, setStyle] = useState({ styleIsSet: false });
  if (props.style && !state.styleIsSet) {
    setStyle({ style: props.style, styleIsSet: true });
  }

  return (
    <ModalWindow close={props.close} width={props.item.width} >
      <div className={`form-control ${props.item.type}`} style={{ ...state.style, width: props.width ? props.width : '100%' }}>
        {props.type == 'textarea' ?
          <TextareaAutosize value={props.item.content} onInput={(event) => { props.onInput(event.target.value) }}></TextareaAutosize>
          :
          <input style={state.style} placeholder={props.placeholder} value={props.item.content} onInput={(event) => { props.onInput(event.target.value) }}></input>
        }

      </div>
    </ModalWindow >


  )
}

export default InputWindow