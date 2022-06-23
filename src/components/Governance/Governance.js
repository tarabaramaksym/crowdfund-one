import { useState } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import Toast from "../shared-components/Toast/Toast";


const Governance = () => {

  const [state, setState] = useState({});
  const navigate = useNavigate();

  const handleSubmit = () => {

  }

  return (
    <div className="campaign-form-container">
      {state.error ? <Toast close={() => { setState({ ...state, error: '' }) }}>{state.error}</Toast> : null}
      <h3> Start proposal</h3 >
      <form className="campaign-form" onSubmit={event => event.preventDefault()}>

        <div className="form-control form-control-container">
          <input type="number" className="containered-control" placeholder="Goal" onInput={event => setState({ ...state, value: event.target.value })}></input>
          <p>ONE</p>
        </div>

        <div style={{ float: 'right', position: 'relative' }}>
          <p className="hint" onMouseEnter={() => { setState({ ...state, hint: true }) }} onMouseLeave={() => { setState({ ...state, hint: false }) }}>What is staking?</p>
          {state.hint ? <div className="hint-container">
            <p>Minimal contribution is the minimal amount backer must contribute to get access to voting and chat features. Backers are free to contribute smaller amounts, but it won't give them any access to aforementioned features.</p>
          </div> : null}
        </div>
        <button className="btn danger-btn " style={{ marginTop: '15px' }} onClick={() => { navigate(-1) }}>Cancel</button>
        <button className="btn success-btn " style={{ marginTop: '15px' }} onClick={handleSubmit}>Proceed</button>
        <div style={{ clear: 'both' }}></div>
      </form>
    </div >
  )
}

const mapStateToProps = state => ({ account: state.account, attemptedConnect: state.attemptedConnect });

export default connect(mapStateToProps)(Governance);