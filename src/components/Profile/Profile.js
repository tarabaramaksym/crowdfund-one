import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LargeLoader from "../shared-components/Loader/LargeLoader";
import PaginationContainer from "../shared-components/PaginationContainer/PaginationContainer";
import './Profile.css';

const Profile = props => {

  const [state, setState] = useState({
    loading: false,
    backer: '',
    author: '',
    campaigns: '',
    pages: '',
    type: 0
  })

  const navigate = useNavigate();
  const params = useParams();

  useEffect(async () => {
    if (!props.account && props.attemptedConnect) {
      navigate('/');
    }
    else if (props.attemptedConnect) {
      setState({ ...state, loading: true });
      const ownerCount = await axios.get('/campaigns/user-owner-to/count/' + params.address);
      const ownerCampaigns = await axios.get(`/campaigns/user-owner-to/campaigns/${params.address}/1`);
      const ownerPages = await axios.get('/campaigns/user-owner-to/pages/' + params.address);

      const approverCount = await axios.get('/campaigns/user-approver-to/count/' + params.address);
      //const approverCampaigns = await axios.get(`/campaigns/user-approver-to/campaigns/${params.address}/1`);
      // const approverPages = await axios.get('/campaigns/user-approver-to/count/' + params.address);

      setState({ ...state, loading: false, backer: approverCount.data, author: ownerCount.data, campaigns: ownerCampaigns.data, pages: ownerPages.data });
    }
  }, [props.account]);

  const loadCampaigns = async page => {
    if (state.type === 0) {
      const ownerCampaigns = await axios.get(`/campaigns/user-owner-to/campaigns/${params.address}/${page}`);
    }
    else {
      const approverCampaigns = await axios.get(`/campaigns/user-approver-to/campaigns/${params.address}/${page}`);
    }
  }

  const typeChange = async type => {

    setState(prevState => ({ ...prevState, loading: true, type }));
    let link
    if (type == 0) {
      link = '/campaigns/user-owner-to';
    }
    else {
      link = '/campaigns/user-approver-to';
    }

    const campaigns = await axios.get(`${link}/campaigns/${params.address}/1`);
    const pages = await axios.get(`${link}/pages/${params.address}`);

    setState(prevState => ({ ...prevState, loading: false, campaigns: campaigns.data, pages: pages.data }));
  }

  return (<div>
    {
      state.backer === '' ? <div style={{ margin: 'auto', width: '150px' }}><LargeLoader /></div> :
        <div>
          <div className="profile-details">
            <i className="bi bi-person-circle"></i>
            <div className="card" style={{ width: '450px' }}>
              <div className="card-body">
                <h6 className="card-title">User {params.address}</h6>
                <hr></hr>
                <h6 className="card-subtitle mb-2 text-muted">Is backer to {state.backer} campaigns</h6>
                <h6 className="card-subtitle mb-2 text-muted">Is author to {state.author} campaigns</h6>
              </div>
            </div>
          </div>
          <nav className='campaign-navbar'>
            <div key={0} className={`campaign-nav-item ${state.type == 0 ? ' active' : ''}`} onClick={state.type == 0 ? null : () => { typeChange(0); }}>Owner</div>
            <div key={1} className={`campaign-nav-item ${state.type == 1 ? ' active' : ''}`} onClick={state.type == 1 ? null : () => { typeChange(1); }}>Backer</div>
          </nav>
          {
            state.loading ? <div style={{ margin: 'auto', width: '150px' }}><LargeLoader /></div> :
              state.campaigns.length == 0 ? <h4 style={{ marginTop: '15px' }}>There is currently no campaigns here.</h4> : <PaginationContainer pages={state.pages} loadCampaigns={loadCampaigns} campaigns={state.campaigns} />
          }
        </div >

    }</div >);
}

const mapStateToProps = state => ({ account: state.account, attemptedConnect: state.attemptedConnect });

export default connect(mapStateToProps)(Profile);