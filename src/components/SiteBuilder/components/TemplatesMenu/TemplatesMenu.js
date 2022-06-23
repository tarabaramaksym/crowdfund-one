import { useState } from "react";
import Select from "../../../shared-components/Select/Select";
import './TemplatesMenu.css';

const TemplatesMenu = props => {

  const [selected, setSelected] = useState('Select Template');
  return (
    <Select selected={selected}>
      <ul className="templates-menu" style={{ listStyle: 'none', width: '167.47px' }} onClick={props.close}>
        <li><button className="btn btn-list" onClick={() => { props.loadTemplate('0x'); setSelected('Minimalistic'); }}>Minimalistic</button></li>
        <li><button className="btn btn-list" onClick={() => { props.loadTemplate('1x'); setSelected('Extended'); }}>Extended</button></li>
        <li><button className="btn btn-list" onClick={() => { props.loadTemplate('2x'); setSelected('Images!'); }}>Images!</button></li>
      </ul>
    </Select>
  )
}

export default TemplatesMenu;