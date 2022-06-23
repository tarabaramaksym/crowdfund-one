import { useState } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
import './Select.css';

const Select = props => {

  const [modal, setModal] = useState(false);

  return (
    <div>
      <div className="select-control" onClick={() => { setModal(true) }}>
        <p>{props.selected}</p>

        <i className="bi bi-caret-down-fill"></i>
      </div>
      {
        modal && <div onClick={() => { setModal(false) }}>
          <ModalWindow close={() => { setModal(false) }}>
            {props.children}
          </ModalWindow>
        </div>
      }
    </div>

  )
}

export default Select;