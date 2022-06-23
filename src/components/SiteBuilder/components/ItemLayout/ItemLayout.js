
import { useEffect, useRef, useState } from 'react';
import ModalWindow from '../../../shared-components/ModalWindow/ModalWindow';
import Heading from '../Heading/Heading';
import Image from '../Image/Image';
import MainHeading from '../MainHeading/MainHeading';
import Paragraph from '../Paragraph/Paragraph';
import SpaceBlock from '../SpaceBlock/SpaceBlock';
import Youtube from '../Youtube/Youtube';
import './ItemLayout.css';

const ItemLayout = props => {

  let renderChildComponent = () => {
    let childFunctions = {
      flipIsInput: props.functions.flipIsInput,
      onInputChange: props.functions.onInputChange
    };
    switch (props.item.type) {
      case 'paragraph': return <Paragraph functions={childFunctions} item={props.item} />;
      case 'heading': return <Heading functions={childFunctions} item={props.item} />;
      case 'spaceBlock': return <SpaceBlock functions={childFunctions} item={props.item} />;
      case 'image': return <Image functions={childFunctions} item={props.item}></Image>;
      case 'youtube': return <Youtube functions={childFunctions} item={props.item}></Youtube>;
      case 'mainHeading': return <MainHeading functions={childFunctions} item={props.item}></MainHeading>
    }
  }


  const [state, setState] = useState({ changingWidth: false, settings: false });

  const renderSettings = () => {
    return (
      <div className='settings-container' style={{ width: '102px' }}>

        {
          'align' in props.item &&
          <div style={{ width: '100%', textAlign: 'center' }}>
            <button className={`btn align-btn no-padding ${props.item.align === 'left' ? 'align-active' : ''}`}
              onClick={() => { props.functions.onPropertyChange('align', 'left') }}><i className="bi bi-text-left"></i></button>
            <button className={`btn align-btn no-padding ${props.item.align === 'center' ? 'align-active' : ''}`}
              onClick={() => { props.functions.onPropertyChange('align', 'center') }}><i className="bi bi-text-center"></i></button>
            <button className={`btn align-btn no-padding ${props.item.align === 'right' ? 'align-active' : ''}`}
              onClick={() => { props.functions.onPropertyChange('align', 'right') }}><i className="bi bi-text-right"></i></button>
          </div>

        }

        {
          'backgroundColor' in props.item || 'color' in props.item ?
            <div style={{ width: '100%', display: 'flex', paddingBottom: '5px' }}>
              {
                'backgroundColor' in props.item &&
                <div style={{ fontSize: '13px', width: '45%', display: 'flex' }}>
                  <span style={{ fontSize: '13px', marginRight: '5px', width: '25%', color: 'white' }}>Bg:</span>
                  <input style={{ width: '25px', height: '25px', marginLeft: '5px', backgroundColor: 'transparent' }} type="color" value={props.item.backgroundColor} onChange={(event) => { props.functions.onPropertyChange('backgroundColor', event.target.value) }}></input>
                </div>
              }
              {
                'color' in props.item &&
                <div style={{ fontSize: '13px', width: '55%', display: 'flex' }}>
                  <span style={{ fontSize: '13px', color: 'white' }}>Text:</span>
                  <input style={{ width: '25px', height: '25px', backgroundColor: 'transparent', marginLeft: '5px' }} type="color" value={props.item.color} onChange={(event) => { props.functions.onPropertyChange('color', event.target.value) }}></input>
                </div>
              }
            </div>
            :
            null
        }
        <hr className="divider"></hr>
      </div>
    )
  }

  return (
    <div className={`item-container ${props.item.width || 'four'}`}
      onClick={props.functions.onClick}
    >
      <div draggable={true} onDragStart={props.functions.onDragStart} style={{ cursor: 'move' }}
        onDragLeave={props.functions.onDragLeave}
        onDragEnd={props.functions.onDragEnd}
        onDragOver={props.functions.onDragOver}
        onDrop={props.functions.onDrop} className={`item-container ${props.isActive ? 'active' : ''}`}>
        {renderChildComponent()}
      </div>

      {props.isActive ? <div className='item-buttons'>
        <div className='absolute-group'>
          <button className='btn' onClick={props.functions.flipIsInput}><i className="bi bi-pencil-square"></i></button>
          {props.item.type === 'image' || props.item.type === 'youtube' ? <i className="bi bi-gear" style={{ fontSize: '22px', margin: '5px' }}></i> : <button className='btn' onClick={() => setState(prevState => ({ ...prevState, settings: true }))}><i className="bi bi-gear"></i></button>}
          <button className='btn' onMouseDown={event => {
            window.document.body.style.cursor = 'w-resize';
            setState(prevState => ({ ...prevState, changingWidth: true }))
            props.functions.onMouseDownWidth(event);
          }}
            style={{ color: props.changingWidth ? '#FE6542' : 'white', cursor: 'w-resize' }}> <i className="bi bi-arrows-expand flipped-icon" ></i></button>

          {state.settings ? <ModalWindow close={() => setState(prevState => ({ ...prevState, settings: false }))}>{renderSettings()}</ModalWindow> : null}
        </div>

      </div> : null
      }

    </div >
  )
}

export default ItemLayout;