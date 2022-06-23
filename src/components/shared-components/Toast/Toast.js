import { useEffect, useRef, useState } from 'react'
import './Toast.css'

const Toast = props => {


  const [state, setState] = useState({
    show: false,
    timer: false
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!state.timer) {
        setState({
          show: true,
          timer: true
        })
      }
    }, 1000);
    return () => clearTimeout(timeout);
  });

  return (
    <div aria-live="assertive" aria-atomic="true" className={`toast ${state.show || props.show ? 'show' : ''}`} id="test">
      <div className="toast-body text-white">
        <div style={{ width: '90%' }}>
          {props.children}
        </div>

        <button onClick={() => {
          if (props.close) {
            props.close()
          }

          setState({
            ...state,
            show: false
          });

        }} type="button" className="btn btn-close btn-close-white " data-bs-dismiss="toast" aria-label="Close"><i className="bi bi-x"></i>
        </button>
      </div>

    </div>
  );
}

export default Toast;