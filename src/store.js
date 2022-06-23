import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { requestAccounts } from './actions';


const initState = {
  account: '',
  attemptedConnect: false
}

const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case "CONNECT":
      return {
        ...state,
        account: action.payload.account[0],
        attemptedConnect: true
      }
    case "CAN_ACCESS":
      return {
        ...state,
        accessible: action.payload
      }
    case "LOADING":
      return {
        ...state,
        loading: action.payload
      }
    case "SET_ACCESS":
      return {
        ...state,
        accessible: action.payload
      }
    default: return state;
  }
}



export default createStore(rootReducer, applyMiddleware(thunk));

