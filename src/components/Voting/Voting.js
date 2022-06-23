import { useEffect, useState } from "react";
import { connect } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { loadRequests } from "../../services/user";
import { approveRequest, finalizeRequest, getCampaignInfo, getRequests } from "../../services/web3";
import Button from "../shared-components/Button/Button";
import LargeLoader from "../shared-components/Loader/LargeLoader";
import RequestsTable from "../shared-components/RequestsTable/RequestsTable";


import './Voting.css';

const Voting = props => {

  const navigate = useNavigate();
  const [state, setState] = useState({
    campaigns: '',
    requests: '',
    summary: '',
    loading: false,
    selected: ''
  });



  const loadData = async (index) => {

    setState(prevState => ({ ...prevState, loading: true, selected: index }));

    let summary, requests;
    if (index == -1) {
      summary = [];
      requests = [];
      for (let i = 0; i < state.campaigns.length; i++) {
        const summaryElem = await getCampaignInfo(state.campaigns[i].contract);
        const requestsElem = await getRequests(props.account, state.campaigns[i].contract);
        const voteRequests = [];

        requestsElem.forEach(r => {
          if (r.can && (r.approvalCount / summaryElem.approversCount * 100 < 50 || r.approvalCount == 0)) {
            voteRequests.push(r);
          }
        });
        summary.push(summaryElem);
        requests.push(voteRequests);
      }
    }
    else {
      summary = await getCampaignInfo(state.campaigns[index].contract);
      requests = await getRequests(props.account, state.campaigns[index].contract);
    }

    setState(prevState => ({ ...prevState, summary, requests, selected: index, loading: false }));

  }

  useEffect(async () => {
    if (!props.account && props.attemptedConnect) {
      navigate('/');
    }
    else if (props.attemptedConnect) {
      setState({ ...state, loading: true });
      const data = await loadRequests(props.account);
      let summary = [];
      let requests = [];
      for (let i = 0; i < data.length; i++) {
        const summaryElem = await getCampaignInfo(data[i].contract);
        const requestsElem = await getRequests(props.account, data[i].contract);
        const voteRequests = [];

        requestsElem.forEach(r => {
          if (r.can && (r.approvalCount / summaryElem.approversCount * 100 < 50 || r.approvalCount == 0)) {
            voteRequests.push(r);
          }
        });
        summary.push(summaryElem);
        requests.push(voteRequests);
      }
      setState({ ...state, campaigns: data, summary, requests, selected: -1, loading: false });
    }
  }, [props.account]);


  const renderList = () => {
    return state.campaigns.map((l, index) => {
      return (<li key={index} onClick={index == state.selected ? null : async () => { await loadData(index) }} className={`${index == state.selected ? 'selected-li' : ''}`}>
        <h5>{l.title}</h5>
        <p>{l.contract.substr(0, 25)}...</p>
      </li>)
    });
  }

  const renderTables = () => {

    if (state.loading) {
      return <div style={{ margin: 'auto', width: '150px' }}><LargeLoader /></div>
    }

    if (state.selected == -1) {
      let flag = false;
      state.requests.map(req => {
        if (req.length == 0) {
          flag = true;
        }
      });
      if (flag) {
        return <h3>No campaigns that require attention</h3>
      }
      return (state.requests.map((req, index) => {
        if (req.length == 0) {
          return null;
        }
        return (
          <div key={index}>
            <h3 style={{ marginBottom: '0' }}>{state.campaigns[index].title}</h3>
            <Link to={'/voting/' + state.campaigns[index].contract} >{state.campaigns[index].contract}</Link>
            <RequestsTable
              updateParent={() => { loadData(state.selected) }}
              requireVote={true}
              summary={state.summary[index]} requests={req}
              contract={state.campaigns[index].contract}
              loading={() => { setState(prevState => ({ ...prevState, loading: false })) }}
              account={props.account} />
          </div>

        )
      }));
    }
    return (<div>
      <h3 style={{ marginBottom: '0' }}>{state.campaigns[state.selected].title}</h3>
      <Link to={'/voting/' + state.campaigns[state.selected].contract} >{state.campaigns[state.selected].contract}</Link>
      <RequestsTable
        updateParent={() => { loadData(state.selected) }}
        summary={state.summary} requests={state.requests}
        contract={state.campaigns[state.selected].contract}
        loading={() => { setState(prevState => ({ ...prevState, loading: false })) }}
        account={props.account} />
    </div>)
  }


  return (
    state.campaigns === '' ? <div style={{ margin: 'auto', width: '150px' }}><LargeLoader /></div> :
      <div className="voting-container">
        <ul className="voting-list">
          <li onClick={-1 == state.selected ? null : async () => { await loadData(-1) }} className={`${-1 == state.selected ? 'selected-li' : ''}`} >
            <h5>Requires Attention</h5>
          </li>
          {renderList()}

        </ul>
        <div style={{ width: '100%' }}>
          {renderTables()}
        </div>

      </div >
  );


}

const mapStateToProps = (state) => {
  return {
    account: state.account,
    attemptedConnect: state.attemptedConnect
  }
}



export default connect(mapStateToProps)(Voting);