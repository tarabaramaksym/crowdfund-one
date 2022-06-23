import { useEffect, useRef } from "react";

const ModalWindow = (props) => {

  const ref = useRef();
  useOnClickOutside(ref, () => props.close());

  return (
    <div ref={ref}>
      {props.children}
    </div>
  );
}
// Hook
function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target) || event.key == 'Shift') {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("keydown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("keydown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    [ref, handler]
  );
}

export default ModalWindow