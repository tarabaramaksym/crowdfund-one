import { useEffect, useRef, useState } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import Toast from "../shared-components/Toast/Toast";
import '../Campaigns/Create/Create.css';


const Staking = () => {

  const [state, setState] = useState({});

  const handleSubmit = () => {

  }

  return (
    <div>
      <div className="row">
        <h3> Staking CRS</h3 >
        <p>Crowdshare or CRS is a token representing part of the ownership of this site, a share if you will. After acquiring it you will need to stake it to get a share of profits and access to the governance voting.</p>
      </div>

      <div className="row">



      </div>
      <div className="row">
        <div className="col-sm-4">
          <h4 style={{ marginBottom: '0' }}> Stake</h4 >
          <div className="campaign-form-container" style={{ height: '12rem', borderRadius: '8px', marginTop: '8px' }}>
            {state.error ? <Toast close={() => { setState({ ...state, error: '' }) }}>{state.error}</Toast> : null}

            <form className="campaign-form" style={{ minWidth: 'auto', maxWidth: 'auto' }} onSubmit={event => event.preventDefault()}>
              <div className="form-control form-control-container">
                <input type="number" className="containered-control" placeholder="Amount" onInput={event => setState({ ...state, value: event.target.value })}></input>
                <p>CRS</p>
              </div>
              <button className="btn success-btn " style={{ marginTop: '15px' }} onClick={handleSubmit}>Deposit</button>
              <div style={{ clear: 'both' }}></div>
            </form>
          </div >
        </div>


        <div className="col-sm-4">
          <h4 style={{ marginLeft: '45px', marginBottom: '0' }} >Statistics</h4>
          <div className="campaign-form-container" style={{ height: '12rem', marginLeft: '45px', borderRadius: '8px', marginTop: '8px' }}>

            <table>

              <tbody>
                <tr>
                  <td>Your balance</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Your stake</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Your profit</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Your profit share</td>
                  <td>0 %</td>
                </tr>
                <tr>
                  <td>Total stake</td>
                  <td>-</td>
                </tr>


              </tbody>
            </table>
          </div >
        </div>


        <div className="col-8">
          <h4 style={{ width: '25rem', marginBottom: '0', marginTop: '10px' }} >Withdraw</h4>
          <div className="campaign-form-container" style={{ width: '28rem', borderRadius: '8px', marginTop: '8px' }}>
            {state.error ? <Toast close={() => { setState({ ...state, error: '' }) }}>{state.error}</Toast> : null}

            <form className="campaign-form" style={{ minWidth: 'auto', maxWidth: 'auto' }} onSubmit={event => event.preventDefault()}>
              <div className="row">
                <p style={{ marginBottom: '0', padding: '10px', height: '45.6px', marginTop: '15px', width: '50%' }}><b>Profit: 2223 ONE</b></p>
                <div className="form-control form-control-container" style={{ width: '12rem' }}>
                  <input type="number" className="containered-control" placeholder="Amount" onInput={event => setState({ ...state, value: event.target.value })}></input>
                  <p>CRS</p>
                </div>
                <div style={{ clear: 'both' }}></div>
              </div>
              <div className="row">
                <button className="btn btn-add text-white" style={{ marginTop: '15px', width: '39%', height: '42px', margin: '15px 15px 0 0', padding: '8px 18px' }} onClick={handleSubmit}>Withdraw profit</button>
                <button className="btn success-btn" style={{ marginTop: '15px', marginRight: '0' }} onClick={handleSubmit}>Withdraw profit and stake</button>
              </div>


            </form>
          </div >
        </div>

      </div>


    </div >


  )
}

const mapStateToProps = state => ({ account: state.account, attemptedConnect: state.attemptedConnect });

export default connect(mapStateToProps)(Staking);