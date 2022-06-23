import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LargeLoader from "../Loader/LargeLoader";
import ProgressBar from "../ProgressBar/ProgressBar";
import './PaginationContainer.css';

const PaginationContainer = props => {

  const [state, setState] = useState({
    loading: false,
    selectedPage: 1,
    search: ''
  });




  const loadData = async page => {
    setState(prevState => ({ ...prevState, loading: true, selectedPage: page }));
    await props.loadCampaigns(page);
    setState(prevState => ({ ...prevState, loading: false }));
  }

  const renderCampaigns = () => {
    return props.campaigns.map((c, index) => {
      return (
        <div key={index} className="card" style={{ width: '302px' }}>
          <Link to={`/list-campaigns/${c.contract}`}>
            <div className="img-progress-bar-container">
              <img className="card-img-top" src={c.image}></img>
              <div style={{ width: '75%', alignSelf: 'flex-end' }} className="progress-bar">
                <ProgressBar contract={c.contract} height="30"></ProgressBar>
              </div>
            </div>

            <div className="card-body">
              <h5>{c.title}</h5>
              <p>{c.description.substr(0, 120)}...</p>
            </div>
          </Link >
        </div >
      )
    });
  }

  const renderPageControls = () => {
    let controls = [];
    if (state.selectedPage >= 3 && props.pages >= 3) {
      controls.push(<li onClick={async () => { await loadData(1) }} className={state.selectedPage == 1 ? 'active' : ''} key={1} > {1}</li >);
      controls.push(<li className='no-hover' key={-1} >...</li >)
    }
    for (let i = state.selectedPage - 1; i <= state.selectedPage + 1; i++) {
      if (i < 1) {
        continue;
      }
      if (i > props.pages) {
        break;
      }
      controls.push(<li onClick={state.selectedPage == i ? null : async () => { await loadData(i) }} className={state.selectedPage == i ? 'active' : ''} key={i} > {i}</li >)
    }
    if (state.selectedPage <= props.pages - 2) {
      controls.push(<li className='no-hover' key={'end'} >...</li >)
      controls.push(<li onClick={state.selectedPage == props.pages ? null : async () => { await loadData(props.pages) }} className={state.selectedPage == props.pages ? 'active' : ''} key={props.pages} > {props.pages}</li >);
    }
    return <ul>{controls}</ul>
  }

  return (
    <div style={{ marginTop: '15px' }}>
      {props.campaigns.length > 1 && <div className="page-controls">
        {renderPageControls()}
      </div>}


      <div className="campaigns-list-container">
        {state.loading ? <div style={{ width: '150px', margin: 'auto' }}><LargeLoader /></div> : renderCampaigns()}
      </div>


    </div>)

}

const mapStateToProps = state => ({ account: state.account });

export default connect(mapStateToProps)(PaginationContainer);