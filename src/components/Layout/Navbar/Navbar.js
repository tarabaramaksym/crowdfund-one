import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadRequests } from '../../../services/user';
import { getCampaignInfo, getRequests } from '../../../services/web3';
import ConnectModal from '../../ConnectModal/ConnectModal';
import CustomLink from '../../shared-components/Link/Link';
import Toast from '../../shared-components/Toast/Toast';
import './Navbar.css';


const Navbar = props => {


  const [votes, setVotes] = useState('');
  useEffect(async () => {
    if (props.account) {
      let counter = 0;
      const data = await loadRequests(props.account);
      for (let i = 0; i < data.length; i++) {
        const summaryElem = await getCampaignInfo(data[i].contract);
        const requestsElem = await getRequests(props.account, data[i].contract);

        requestsElem.forEach(r => {
          if (r.can && (r.approvalCount / summaryElem.approversCount * 100 < 50 || r.approvalCount == 0)) {
            counter++;
          }
        });
      }
      setVotes(counter);
    }

  }, [props.account]);

  return (
    <div className="navbar-container">
      <h4 className="logo">CROWDFUND.ONE</h4>
      <div className="buttons">
        <CustomLink to="/"><i className="bi bi-house-fill"></i>Home</CustomLink>
        <CustomLink to="/list-campaigns"><i class="bi bi-collection-fill"></i>Campaigns</CustomLink>
        {props.account ?
          <CustomLink to={`/profiles/${props.account}`} ><i className="bi bi-briefcase-fill"></i>Profile</CustomLink> :
          <div className='btn btn-menu btn-menu-disabled'><i className="bi bi-briefcase-fill"></i>Profile</div>
        }
        {props.account ?
          <CustomLink to={'/voting'}><i className="bi bi-check-square-fill"></i>Voting {(votes !== '' && votes != 0) && <span style={{ fontSize: '12px', position: 'relative', top: '-7px' }}>(<span style={{ color: 'red', fontWeight: 'bold' }}>{votes}</span>)</span>}</CustomLink> :
          <div className='btn btn-menu btn-menu-disabled'><i className="bi bi-check-square-fill"></i>Voting</div>
        }

        {props.account ?
          <CustomLink to={'/staking'}><i class="bi bi-piggy-bank-fill"></i>Staking</CustomLink> :
          <div className='btn btn-menu btn-menu-disabled'><i class="bi bi-piggy-bank-fill"></i>Staking</div>
        }
        {props.account ?
          <CustomLink to={'/governance'}><i class="bi bi-megaphone-fill"></i>Governance</CustomLink> :
          <div className='btn btn-menu btn-menu-disabled'><i class="bi bi-megaphone-fill"></i>Governance</div>
        }
        {props.account ?
          <CustomLink to={'/start'}><i className="bi bi-plus-circle-fill"></i>Start campaign</CustomLink> :
          <div className='btn btn-menu btn-menu-disabled'><i className="bi bi-plus-circle-fill"></i>Start campaign</div>
        }
        <CustomLink to={'/about'}> <i className="bi bi-question-circle-fill"></i>About</CustomLink>
      </div>
      <hr className="white-hr"></hr>
      <p style={{ textAlign: 'right', marginRight: '35px', fontWeight: '500' }}>ONE = $0.03 </p>
    </div >
  )
}

const mapStateToProps = state => ({ account: state.account })

export default connect(mapStateToProps)(Navbar);