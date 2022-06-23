import { useEffect, useState } from 'react';
import { getCampaignInfo, getNumRequests } from '../../../services/web3';
import Loader from '../Loader/Loader';
import './ProgressBar.css';

const ProgressBar = props => {

  const [state, setState] = useState({
    percent: '',
    filled: '',
    target: '',
    loading: false
  });

  useEffect(async () => {

    let calc = '';
    let summary = '';
    setState(prevState => ({ ...state, loading: true }));
    if (props.contract) {
      summary = await getCampaignInfo(props.contract);
      const numrequests = await getNumRequests(props.contract);
      if (numrequests > 0) {
        calc = 'Finished'
      }
      else {
        calc = summary.filled == 0 ? 0 : (summary.value / summary.hardcap * 100);
      }

    }
    else {
      calc = props.filled == 0 ? 0 : (props.filled / props.target * 100);
    }

    if (calc > 100) {
      calc = 100;
    }
    setState(prevState => ({ ...state, percent: calc, filled: props.filled || summary.value, target: props.target || summary.hardcap, loading: false }));

  }, [props.filled, props.contract]);

  return (state.percent === 'Finished' ?
    <div className='progress-bar' style={{ height: `${props.height}px` }}>
      <div className='fill' style={{ height: `${props.height}px`, width: '100%' }}>
        <p >Finished</p>
      </div>
      <p className='target'>{state.target && state.target + ' ONE'}</p>
    </div >
    :
    <div className='progress-bar' style={{ height: `${props.height}px` }}>
      {!state.loading && <div className='fill' style={{ height: `${props.height}px`, width: state.percent !== undefined ? state.percent + '%' : '100%' }}>
        <p >{state.percent !== undefined ? state.percent + '%' : 'Not Connected'}</p>
      </div>}
      <p className='target'>{state.target && state.target + ' ONE'}</p>
    </div >

  )


}

export default ProgressBar;