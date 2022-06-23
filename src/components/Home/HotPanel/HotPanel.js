import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { getCampaignInfo } from "../../../services/web3";
import ProgressBar from "../../shared-components/ProgressBar/ProgressBar";
import './HotPanel.css';

const HotPanel = props => {

  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({ filled: 0, target: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setInterval(() => setSelected((selected + 1) % props.campaigns.length), 4000);
    return () => clearInterval(timerId);
  });

  useEffect(async () => {
    if (props.account != '') {
      const res = await getCampaignInfo(props.campaigns[selected].contract);
      setSummary(res);
    }
  }, [selected]);

  const renderCampaigns = () => {
    return (
      <div className="hot-campaigns">
        <NavLink end to={`/${props.campaigns[selected].contract}`} >
          <div className="card hot-selected" >
            <img className="card-img-top" src={props.campaigns[selected].image}></img>
            <div className="hot-selected-body card-body">
              <h3>{props.campaigns[selected].title}</h3>
              <p>{props.campaigns[selected].description.substr(0, 120)}...</p>
              <div style={{ width: '75%', alignSelf: 'flex-end' }}>
                <ProgressBar contract={props.campaigns[selected].contract} height="30"></ProgressBar>
              </div>

            </div>

          </div>
        </NavLink>

        <div className="hot-not-selected">
          {props.campaigns.map((c, index) => {
            if (index == selected) {
              return null;
            }
            return (
              <NavLink key={index} end to={`/${c.contract}`}>
                <div className="card hot-element" >
                  <img className="card-img-top" src={c.image}></img>
                  <div className="hot-element-body card-body">
                    <h6>{c.title}</h6>
                  </div>
                </div>
              </NavLink>)
          })}
        </div>
      </div >
    );
  }

  return renderCampaigns();

}

export default HotPanel;