import { useEffect, useState } from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import { useParams } from "react-router-dom"
import { approveRequest, canApprove, createRequest, finalizeRequest, getRequests } from "../../../services/web3";
import Button from "../Button/Button";
import LargeLoader from "../Loader/LargeLoader";
import './RequestsTable.css'

const RequestsTable = props => {

  const [state, setState] = useState({
    requests: '',
    loading: false
  })



  const effectRequests = async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    const requests = props.requests;
    const tables = {
      vote: [],
      wait: [],
      finalized: []
    };
    requests.map((r, index) => {
      if (r.approvalCount / props.summary.approversCount * 100 < 50 || r.approvalCount == 0) {
        tables.vote.push(r);
      }
      else if (r.complete) {
        if (!props.requireVote) {
          tables.finalized.push(r);
        }

      }
      else {
        if (!props.requireVote) {
          tables.wait.push(r);
        }
      }
    })

    setState(prevState => ({ ...prevState, requests: tables, loading: false }));
  }

  useEffect(effectRequests, [props.requests])

  const approve = async (index) => {
    await approveRequest(props.account, props.contract, index);
    await effectRequests();
    props.updateParent();
  }

  const finalize = async (index) => {
    await finalizeRequest(props.account, props.contract, index);
    await effectRequests();
    props.updateParent();
  }

  const renderTable = (table, status) => {
    const thead = (
      <thead>
        <tr>
          <th>Description</th>
          <th>Value</th>
          <th>Recipient</th>
          <th>Approved by</th>
          <th></th>
        </tr>
      </thead>
    )

    const tbody = (<tbody>
      {

        table.map((r, index) => {

          let button = null
          if (status == 'vote') {
            button = props.account.toLowerCase() == props.summary.owner.toLowerCase() ? null : r.can ? <Button className="btn table-btn" onClick={async () => { await approve(r.index) }}>Approve</Button> : <div className="approved"></div>
          }
          else if (status == 'wait') {
            button = props.account.toLowerCase() == props.summary.owner.toLowerCase() ? <Button className="btn table-btn" onClick={async () => { await finalize(r.index) }}>Finalize</Button> : null;
          }

          return (<tr key={index} className={`table-row`}>
            <td>{r.description}</td>
            <td>{r.value} ONE</td>
            <td>{r.recipient}</td>
            <td>{((r.approvalCount == 0 ? 0 : r.approvalCount / props.summary.approversCount * 100) + '').substr(0, 5)}%</td>
            <td>{button}</td>
          </tr>)
        })
      }
    </tbody >);

    return <table className="table">{thead}{tbody}</table>
  }



  return (state.loading ?
    <div style={{ width: '100px', margin: 'auto' }}><LargeLoader /> </div>
    :
    state.requests &&
    (<div style={{ marginTop: '25px' }}>


      {(state.requests.vote.length > 0 && !props.requireVote) && <h4>In vote</h4>}
      {state.requests.vote.length > 0 && renderTable(state.requests.vote, 'vote')}

      {state.requests.wait.length > 0 && <h4>To be finalized</h4>}
      {state.requests.wait.length > 0 && renderTable(state.requests.wait, 'wait')}

      {state.requests.finalized.length > 0 && <h4>Finalized</h4>}
      {state.requests.finalized.length > 0 && renderTable(state.requests.finalized)}

      {
        (state.requests.finalized.length == 0 && state.requests.vote.length == 0 && state.requests.wait.length == 0) && <h4>There is currently no requests  </h4>
      }
    </div >));
}

const mapStateToProps = state => ({ account: state.account })

export default connect(mapStateToProps)(RequestsTable);