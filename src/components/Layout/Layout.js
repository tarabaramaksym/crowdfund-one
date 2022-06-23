import React, { useState } from 'react';
import Breadcrumb from '../shared-components/Breadcrumbs/Breadcrumb';
import './Layout.css';
import Navbar from './Navbar/Navbar';
import ConnectModal from '../ConnectModal/ConnectModal';
import Toast from '../shared-components/Toast/Toast';
import { connect } from 'react-redux';

const Layout = props => {

  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const connectHandler = () => {
    setModal(true);
  }


  return (
    <div className="layout-container">
      {modal ? <ConnectModal toast={() => { setToast(true) }} close={() => { setModal(false) }}></ConnectModal> : null}
      {toast ? <Toast close={() => { setToast(false) }}>Account connected</Toast> : null}
      <Navbar></Navbar>


      <div className='campaigns-container'>
        <div className="top-container" >
          <Breadcrumb>{props.children}</Breadcrumb>
          <button onClick={!props.account ? connectHandler : null} className={`btn ${!props.account ? 'connect-btn' : 'connected-btn'}`}>{props.account ? props.account.substr(0, 6) + '...' + props.account.substr(props.account.length - 3, 3) : 'Connect'}</button>
        </div>

        <hr className='container-divider'></hr>
        {props.children}
      </div>


    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    account: state.account
  }
}

export default connect(mapStateToProps)(Layout);