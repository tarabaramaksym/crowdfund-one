import { useEffect, useState } from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import { useParams } from "react-router-dom"
import { approveRequest, canApprove, createRequest, finalizeRequest, getRequests } from "../../../../services/web3";
import Button from "../../../shared-components/Button/Button";
import LargeLoader from "../../../shared-components/Loader/LargeLoader";
import RequestsTable from "../../../shared-components/RequestsTable/RequestsTable";
import './Requests.css'

const Requests = props => {

  const params = useParams();
  const [state, setState] = useState({
    requests: '',
    loading: true
  })

  const effectRequests = async () => {
    const requests = await getRequests(props.account, params.contract);
    setState(prevState => ({ ...prevState, requests, loading: false }));
  }

  useEffect(effectRequests, [params.contract])

  const approve = async (index) => {
    await approveRequest(props.account, params.contract, index);
    await effectRequests();
  }

  const finalize = async (index) => {
    await finalizeRequest(props.account, params.contract, index);
    await effectRequests();
  }

  const submitRequest = async () => {
    if (state.description != '' && state.value != '' && state.recipient != '' && !isNaN(state.value)) {
      await createRequest(props.account, params.contract, state.description, state.value, state.recipient);
      await effectRequests();
    }
  }

  return (state.loading ?
    <div style={{ width: '100px', margin: 'auto' }}><LargeLoader /> </div>
    :
    state.requests &&
    (<div style={{ marginTop: '25px' }}>

      {props.account.toLowerCase() == props.summary.owner.toLowerCase() && <div className="create-request-form">
        <h4 style={{ marginBottom: '5px' }}>Add request</h4>

        <input className="form-control" placeholder="Description" style={{ marginLeft: '8px', width: '592px' }} value={state.description} onInput={event => { setState({ ...state, description: event.target.value }) }}></input>

        <div className="request-form-row">
          <input className="form-control" placeholder="Recipient" value={state.recipient} onInput={event => { setState({ ...state, recipient: event.target.value }) }}></input>
          <div className="form-control form-control-container" style={{ padding: '10px', height: '41px' }}>
            <input placeholder="Value" className="containered-control" value={state.value} onInput={event => setState({ ...state, value: event.target.value })} value={state.value} onInput={event => { setState({ ...state, value: event.target.value }) }}></input>
            <p style={{ color: 'white' }}>ONE</p>
          </div>
        </div>

        <Button className="btn contribute-btn" onClick={submitRequest} >Submit</Button>
        <div style={{ clear: 'both' }}></div>

      </div>}

      <RequestsTable updateParent={effectRequests} summary={props.summary} requests={state.requests} contract={params.contract} loading={() => { setState(prevState => ({ ...prevState, loading: false })) }} account={props.account} />
    </div >));
}

const mapStateToProps = state => ({ account: state.account })

export default connect(mapStateToProps)(Requests);