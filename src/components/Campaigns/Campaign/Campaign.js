import axios from 'axios';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { canAccessChat, contribute, getCampaignInfo } from '../../../services/web3';
import Button from '../../shared-components/Button/Button';
import LargeLoader from '../../shared-components/Loader/LargeLoader';
import ProgressBar from '../../shared-components/ProgressBar/ProgressBar';
import './Campaign.css';
import Chat from './Chat/Chat';
import Details from './Details/Details';
import RenderStaticPage from './RenderStaticPage/RenderStaticPage';
import Requests from './Requests/Requests';

const Campaign = props => {

  const navigate = useNavigate();
  const params = useParams();
  const [state, setState] = useState({ campaign: [], active: 0, contribution: 0, loading: false, summary: '', canAccess: false });

  const nav = [
    {
      value: 'Page',
      func: <RenderStaticPage elements={state.campaign.elements || []} />
    },
    {
      value: 'Details',
      func: <Details summary={state.summary} />
    },
    {
      value: 'Requests',
      func: <Requests summary={state.summary} />,
      requiresHardcap: true,
      requiresAccess: true
    },
    {
      value: 'Chat',
      func: <Chat />,
      requiresAccess: true
    }
  ]

  useEffect(async () => {
    setState(prevState => ({ ...prevState, loading: true }));

    try {
      const response = await axios.get(`/campaigns/${params.contract}`)
      if (response == null) {
        navigate(-1);
      }
      else {
        setState(prevState => ({ ...prevState, campaign: response.data }));
      }
    }
    catch {
      navigate(-1);
    }
    setState(prevState => ({ ...prevState, loading: false }));
  }, [params.contract]);


  const getInfo = async () => {
    if (props.account) {
      const res = await getCampaignInfo(params.contract);

      let canAccess = props.account == res.owner;
      if (!canAccess) {
        canAccess = await canAccessChat(props.account, params.contract);
      }
      setState(prevState => ({ ...prevState, summary: res, canAccess }))
    }
  }

  useEffect(getInfo, [props.account]);

  const contributeHandler = async () => {

    if (!isNaN(state.contribution) && state.contribution > 0) {
      const result = await axios.post(`/campaigns/add-approver/${params.contract}`, {
        address: props.account,
        owned: [],
        approverTo: []
      })

      if (result.status == 200) {
        await contribute(props.account, params.contract, state.contribution);
        await getInfo();

      }
    }

  }

  return (
    <div>
      <div>
        {(state.summary && state.summary.hardcap > state.summary.value && state.summary.requestsCount == 0) && (<div className='contribute-container'>

          <ProgressBar filled={state.summary.value} target={state.summary.hardcap} height="35"></ProgressBar>

          {(props.account && props.account.toLowerCase() != state.summary.owner.toLowerCase()) && <Button className='btn contribute-btn' onClick={contributeHandler}>Contribute</Button>}
          {(props.account && props.account.toLowerCase() != state.summary.owner.toLowerCase()) && (<div className="form-control form-control-container">
            <input className="containered-control" onInput={event => setState({ ...state, contribution: event.target.value })} value={state.contribution}></input>
            <p style={{ color: 'white' }}>ONE</p>
          </div>)}

        </div>)}

        <nav className='campaign-navbar'>
          {nav.map((n, index) => {
            if (index == state.active) {
              return <div key={index} className="campaign-nav-item active">{n.value}</div>
            }
            if (!props.account || (n.requiresAccess && !state.canAccess && (state.summary && props.account.toLowerCase() != state.summary.owner.toLowerCase())) || (n.requiresHardcap && state.summary.hardcap > state.summary.value && state.summary.requestsCount == 0)) {
              return <div key={index} className="campaign-nav-item inactive">{n.value}</div>
            }
            return <div key={index} className="campaign-nav-item" onClick={() => { setState({ ...state, active: index }) }}>{n.value}</div>
          })}
        </nav>

      </div>

      {state.loading ? <div style={{ width: '60px', margin: 'auto' }}><LargeLoader /></div> : nav[state.active].func}

    </div>
  )

}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

export default connect(mapStateToProps)(Campaign);