import * as web3Service from "./services/web3";

const CONNECT = "CONNECT";
const CAN_ACCESS = "CAN_ACCESS";
const LOADING = "LOADING";
const SET_ACCESS = "SET_ACCESS";

const loading = (dispatch) => {
  dispatch({
    type: LOADING,
    payload: true
  })
}

const loaded = (dispatch) => {
  dispatch({
    type: LOADING,
    payload: false
  })
}

export const connectWallet = () => async (dispatch, getState) => {
  const account = await web3Service.requestAccounts()
  dispatch({
    type: CONNECT,
    payload: account
  })
}

export const initialConnect = () => async (dispatch, getState) => {
  const account = await web3Service.getAccountsWithoutPrompt();
  dispatch({
    type: CONNECT,
    payload: account
  })
}

export const canAccessChat = (contract) => async (dispatch, getState) => {
  const result = await web3Service.canAccessChat(getState().account, contract);
  dispatch({
    type: CAN_ACCESS,
    payload: result
  })

}

export const setAccessible = () => (dispatch, getState) => {
  dispatch({
    type: SET_ACCESS,
    payload: !getState().accessible
  })
}