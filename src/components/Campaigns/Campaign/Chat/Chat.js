import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';
import './Chat.css';
import Message from './Message/Message';
import { db, write } from '../../../../services/chat';


const ChatRoom = props => {

  const navigate = useNavigate();
  const params = useParams();

  const [messages, setMessages] = useState([]);
  const q = query(collection(db, params.contract), orderBy('createdAt'), limit(40));
  useEffect(() => {
    const unsubscribe = onSnapshot(q, snap => {
      const data = snap.docs.map(doc => doc.data())
      setMessages(data)
    });
    return () => unsubscribe()
  }, []);

  useEffect(() => {
    if (props.accessible === false) {
      props.setAccessible()
      navigate(-1);
    }
  }, [props.accessible])


  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  })

  const renderMessages = () => {
    return messages.map(message => {
      return <Message text={message.text} sender={message.address} right={message.address === props.account} time={message.createdAt}></Message>
    })
  }

  const renderChatRoom = () => {
    return (
      <div className="chat-room">
        <div className="chat-area">
          <div className="messages">
            {renderMessages()}
            <div
              ref={ref}>
            </div>
          </div>
        </div>
        <div className="message-input">
          <input onKeyPress={(event) => {
            if (event.code === 'Enter') {
              write(params.contract, props.account, event.target.value)
              event.target.value = '';
            }
          }}></input>
        </div>
      </div>
    )
  }

  return renderChatRoom();
}

const mapStateToProps = (state) => {
  return {
    account: state.account
  }
}

export default connect(mapStateToProps)(ChatRoom);