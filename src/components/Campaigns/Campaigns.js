import axios from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux"
import { connectWallet } from "../../actions"
import { getCampaignInfo } from "../../services/web3";
import LargeLoader from "../shared-components/Loader/LargeLoader";
import PaginationContainer from "../shared-components/PaginationContainer/PaginationContainer";
import './Campaigns.css';

const Campaigns = props => {


  const [state, setState] = useState({
    campaigns: '',
    pages: '',
    initialLoad: false
  });
  const loadCampaigns = async page => {
    try {
      const campaigns = await axios.get('campaigns/paged/' + page);
      setState(prevState => ({ ...prevState, campaigns: campaigns.data, initialLoad: true }));
    }
    catch (err) {
      console.error(err);
    }


  }

  useEffect(async () => {
    if (props.account || props.attemptedConnect) {
      const response = await axios.get('campaigns/paged/' + 1);
      const pages = await axios.get('campaigns/get-page-amount-overall');
      setState(prevState => ({ ...prevState, campaigns: response.data, pages: pages.data, initialLoad: true }));
    }
  }, [props.account])

  return (
    <div >
      {state.campaigns === '' ? <div style={{ width: '150px', margin: 'auto' }}><LargeLoader /></div>
        : <PaginationContainer pages={state.pages} loadCampaigns={loadCampaigns} campaigns={state.campaigns} />}
    </div>)
}

const mapStateToProps = (state) => {
  return {
    account: state.account,
    attemptedConnect: state.attemptedConnect
  }
}

export default connect(mapStateToProps)(Campaigns);