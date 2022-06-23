import { Link } from 'react-router-dom';
import './Message.css'

const Message = props => {

  const getTime = () => {
    var h = new Date(props.time).getHours();
    var m = new Date(props.time).getMinutes();

    h = (h < 10) ? '0' + h : h;
    m = (m < 10) ? '0' + m : m;

    return h + ':' + m;
  }

  return (
    <div className={`message ${props.right ? 'right-message' : 'left-message'}`}>
      <Link to={`/profiles/${props.sender}`} className="sender">{props.sender.substring(0, 4)}...{props.sender.substring(props.sender.length - 2, props.sender.length)}</Link>
      <p>{props.text}</p>
      <p className="time">{getTime()}</p>
    </div>
  )
}

export default Message;