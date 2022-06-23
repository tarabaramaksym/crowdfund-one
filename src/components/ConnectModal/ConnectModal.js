import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { connectWallet } from "../../actions";
import Button from "../shared-components/Button/Button";

import CustomLink from "../shared-components/Link/Link";
import Loader from "../shared-components/Loader/Loader";
import ModalWindow from "../shared-components/ModalWindow/ModalWindow";
import Toast from "../shared-components/Toast/Toast";
import './ConnectModal.css'

const ConnectModal = props => {

  const handleConnect = async () => {
    await props.connectWallet();
    props.close();
    props.toast();
  }
  return (
    <div className="modal">
      <ModalWindow close={props.close}>
        <div className="modal-content">
          <div style={{ display: 'flex' }}>
            <img className="metamask-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png" alt="connect with metamask"></img>
            <Button onClick={handleConnect} className="btn connect-btn">
              Connect with MetaMask
            </Button>
          </div>

          <p className="doc-link">Check out <Link to="/about" className="doc-link">about section</Link> for more info</p>
        </div>
      </ModalWindow >
    </div >

  )
}

const mapStateToProps = (state) => {
  return {
    account: state.account
  }
}


const mapDispatchToProps = {
  connectWallet: connectWallet,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectModal);