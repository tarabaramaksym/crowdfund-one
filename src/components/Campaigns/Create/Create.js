import { useEffect, useState } from "react";
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import LargeLoader from "../../shared-components/Loader/LargeLoader";
import Toast from "../../shared-components/Toast/Toast";
import Editor from "../../SiteBuilder/Editor";
import SiteBuilder from "../../SiteBuilder/SiteBuilder";

import './Create.css';

const Create = props => {

  const navigate = useNavigate();
  const [state, setState] = useState({
    title: '',
    description: '',
    img: '',
    min: '',
    hardcap: '',
    hint: false,
    error: '',
    siteBuilder: false
  });

  useEffect(() => {
    if (!props.account && props.attemptedConnect) {
      navigate(-1);
    }
  }, [props.account])


  const valid = () => {
    if (!(state.title && state.title.trim()) || !(state.description && state.description.trim) || !state.min) {
      setState({ ...state, error: 'Fill out all fields' });
      return false;
    }
    if (isNaN(state.min)) {
      setState(prevState => { return { ...prevState, error: 'Input valid number' } });
      return false;
    }

    if (!state.img.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)) {
      setState({ ...state, error: 'Incorrect url' });
      return false;
    }
    return true;
  }

  const handleSubmit = event => {
    event.preventDefault();
    if (valid()) {
      setState({ ...state, siteBuilder: true })
    }
  }

  return (
    !props.account ? <LargeLoader /> :
      state.siteBuilder ? <Editor title={state.title} description={state.description} min={state.min} img={state.img} hardcap={state.hardcap} /> :
        <div className="campaign-form-container">
          {state.error ? <Toast close={() => { setState({ ...state, error: '' }) }}>{state.error}</Toast> : null}
          <h4> Start by filling this form</h4 >
          <form className="campaign-form" onSubmit={event => event.preventDefault()}>
            <input className="form-control" placeholder="Campaign title" onInput={event => setState({ ...state, title: event.target.value })}></input>

            <TextareaAutosize className="form-control" placeholder="Campaign description" onInput={event => setState({ ...state, description: event.target.value })}></TextareaAutosize>
            <input className="form-control" placeholder="Image url" onInput={event => setState({ ...state, img: event.target.value })}></input>
            <div className="double-row">

              <div className="form-control form-control-container">
                <input className="containered-control" placeholder="Goal" onInput={event => setState({ ...state, hardcap: event.target.value })}></input>
                <p>ONE</p>
              </div>

              <div className="form-control form-control-container">
                <input className="containered-control" placeholder="Minimal contribution" onInput={event => setState({ ...state, min: event.target.value })}></input>
                <p>ONE</p>
              </div>

            </div>
            <div style={{ float: 'right', position: 'relative' }}>
              <p className="hint" onMouseEnter={() => { setState({ ...state, hint: true }) }} onMouseLeave={() => { setState({ ...state, hint: false }) }}>What is minimal contribution?</p>
              {state.hint ? <div className="hint-container">
                <p>Minimal contribution is the minimal amount backer must contribute to get access to voting and chat features. Backers are free to contribute smaller amounts, but it won't give them any access to aforementioned features.</p>
              </div> : null}
            </div>
            <button className="btn danger-btn " style={{ marginTop: '15px' }} onClick={() => { navigate(-1) }}>Cancel</button>
            <button className="btn success-btn " style={{ marginTop: '15px' }} onClick={handleSubmit}>Proceed</button>
            <div style={{ clear: 'both' }}></div>
          </form>
        </div >
  );


}

const mapStateToProps = (state) => {
  return {
    account: state.account,
    attemptedConnect: state.attemptedConnect
  }
}



export default connect(mapStateToProps)(Create);