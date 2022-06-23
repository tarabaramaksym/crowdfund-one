import React, { Component, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Toast from '../shared-components/Toast/Toast';
import './SiteBuilder.css';
import TemplatesMenu from './components/TemplatesMenu/TemplatesMenu';
import AddItemsMenu from './components/AddItemsMenu/AddItemsMenu';
import ItemLayout from './components/ItemLayout/ItemLayout';
import LargeLoader from '../shared-components/Loader/LargeLoader';

import { connect } from 'react-redux';
import { withRouter } from '../../navigation/withRouter';
import Button from '../shared-components/Button/Button';
import { createCampaignContract } from '../../services/web3';

const Editor = props => {

  const [state, setState] = useState({
    form: [
      {
        content: props.title,
        width: 'eight',
        isInput: false,
        settingsCollapsed: true,
        type: 'mainHeading',
        align: 'left',
        backgroundColor: "#FAFAFA",
        color: "#000000",
        order: 0
      },
      {
        content: props.description,
        width: 'four',
        isInput: false,
        settingsCollapsed: true,
        type: 'paragraph',
        align: 'left',
        order: 1
      },
      {
        content: props.img,
        width: 'four',
        isInput: true,
        type: 'image',
        settingsCollapsed: true,
        order: 2
      }
    ],
    min: props.min,
    activeItem: '',
    activeHover: '',
    isAddMenuOpen: false
  })



  const propertyChangeHandler = (index, property, value) => {
    let data = [...state.form];
    data[index][property] = value;
    setState(prevState => ({ ...prevState, form: data }));
  }

  const loadTemplate = (templateId) => {
    setState(prevState => ({ ...prevState, loading: true }));
    let img, mh, p;
    axios.get(`campaigns/${templateId}`).then(response => {
      let form = [];
      response.data.elements.forEach((e, i) => {
        let content =
          (() => {
            if (e.elementType.name == 'mainHeading' && !mh) {
              mh = true;
              return props.title;
            }
            if (e.elementType.name == 'image' && !img) {
              img = true;
              return props.img;
            }
            if (e.elementType.name == 'paragraph' && !p) {
              p = true;
              return props.description;
            }
            return e.content;
          })();

        form.push({
          content,
          width: e.width.name,
          isInput: false,
          settingsCollapsed: true,
          type: e.elementType.name,
          ...(e.textAlign != null && { align: e.textAlign.name }),
          ...(e.backgroundColor != null && { backgroundColor: e.backgroundColor.colorHTML }),
          ...(e.color != null && { color: e.color.colorHTML }),
          order: i
        });
      });
      setState(prevState => ({ ...prevState, form }));
    }).catch(error => {
      console.error(error);
    });
    setState(prevState => ({ ...prevState, loading: false }));
  }

  const sendForm = async () => {
    try {

      let contract = await createCampaignContract(props.account, props.min, props.hardcap);
      let data = {
        contract: contract,
        title: props.title,
        description: props.description,
        image: props.img,
        approvers: [],
        user: {
          address: props.account,
          owned: [],
          approverTo: []
        }, elements: []
      };
      state.form.forEach(item => {
        data.elements.push({
          content: item.content,
          elementType: {
            name: item.type
          },
          width: {
            name: item.width
          },
          textAlign: item.align ? {
            name: item.align
          } : null,
          color: item.color ? {
            colorHTML: item.color
          } : null,
          backgroundColor: item.backgroundColor ? {
            colorHTML: item.backgroundColor
          } : null
        });
      });
      axios.post('campaigns', data)
        .then(response => {
          props.navigate('/list-campaigns/' + contract);
        }).
        catch(error => {
          console.error(error);
        })
    } catch (err) {
      console.error(err);
    }
  }

  const addItem = item => {
    setState(prevState => ({
      ...prevState,
      form: [...prevState.form, { ...item, order: prevState.form.length }]
    }));
  }

  const deleteItem = () => {
    if (state.activeItem === '' || state.activeItem.type === 'mainHeading') {
      return;
    }
    let form = state.form;
    form = form.filter(e => {
      if (e.order > state.activeItem.order) {
        e.order--;
        console.log(e);
        return e;
      }
      else if (e.order < state.activeItem.order) {
        return e;
      }
    });
    setState(prevState => ({ ...prevState, form, activeItem: '' }));
  }

  const dragStartHandler = (event, elem) => {
    setState(prevState => ({ ...prevState, activeItem: elem }));
  }

  const dragEndHandler = event => {
    event.target.parentElement.style.opacity = "100%";
  }

  const dragOverHandler = event => {
    event.preventDefault();
    event.target.parentElement.style.opacity = "75%";
  }

  const dropHandler = (event, elem) => {

    event.preventDefault();
    event.target.parentElement.style.opacity = "100%";
    if (elem != state.activeItem) {

      let bufferForm = { ...state.form };
      console.log(bufferForm);

      let form = state.form;
      let activeItem = state.activeItem;

      let buf = elem.order;
      elem.order = activeItem.order;
      activeItem.order = buf;
      form[elem.order] = elem;
      form[activeItem.order] = activeItem;
      setState(prevState => ({
        ...prevState,
        activeItem: form[activeItem.order],
        form
      }));
    }
  }

  //const ref = useRef();
  //useOnMouseUpOutside(ref, mouseUpWidthHandler);

  const mouseUpWidthHandler = (event, elem) => {
    if (state.changingWith) {
      window.document.body.style.cursor = 'default';
      setState(prevState => ({ ...prevState, changingWith: false }));
    }
  }

  const mouseDownWidthHandler = (event, elem) => {
    setState(prevState => ({ ...prevState, changingWith: true, staticCoordinates: { x: event.clientX, y: event.clientY } }));
  }

  const onMouseMoveWidthHandler = event => {
    if (state.changingWith) {
      if (event.clientX >= state.staticCoordinates.x + 100) {
        let form = state.form;
        switch (form[state.activeItem.order].width) {
          case 'one': form[state.activeItem.order].width = 'two'; break;
          case 'two': form[state.activeItem.order].width = 'three'; break;
          case 'three': form[state.activeItem.order].width = 'four'; break;
          case 'four': form[state.activeItem.order].width = 'five'; break;
          case 'five': form[state.activeItem.order].width = 'six'; break;
          case 'six': form[state.activeItem.order].width = 'seven'; break;
          case 'seven': form[state.activeItem.order].width = 'eight'; break;
        }
        setState(prevState => ({ ...prevState, form, staticCoordinates: { x: event.clientX, y: event.clientY } }));
      }
      if (event.clientX <= state.staticCoordinates.x - 100) {
        let form = state.form;
        switch (form[state.activeItem.order].width) {
          case 'two': form[state.activeItem.order].width = 'one'; break;
          case 'three': form[state.activeItem.order].width = 'two'; break;
          case 'four': form[state.activeItem.order].width = 'three'; break;
          case 'five': form[state.activeItem.order].width = 'four'; break;
          case 'six': form[state.activeItem.order].width = 'five'; break;
          case 'seven': form[state.activeItem.order].width = 'six'; break;
          case 'eight': form[state.activeItem.order].width = 'seven'; break;
        }
        setState(prevState => ({ ...prevState, form, staticCoordinates: { x: event.clientX, y: event.clientY } }));
      }

    }
  }

  const mouseMoveHandler = (event) => {
    if (!state.isHotKeyAddMenuOpen) {
      setState(prevState => ({ ...prevState, x: event.clientX, y: event.clientY }))
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', keyUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mousemove', onMouseMoveWidthHandler);
    window.addEventListener('mouseup', mouseUpWidthHandler);
    return () => {
      window.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousemove', onMouseMoveWidthHandler);
      window.removeEventListener('mouseup', mouseUpWidthHandler);
    }
  });

  const keyUpHandler = (event) => {
    event.preventDefault();
    if (event.ctrlKey) {
      if (event.key === 'c' && state.activeItem) {
        setState(prevState => ({ ...prevState, buffer: state.activeItem }));
      }
      if (event.key === 'v' && state.buffer) {
        let newElement = { ...state.buffer };
        newElement.order = state.form.length;
        newElement.isInput = false;
        setState(prevState => ({ ...prevState, form: [...prevState.form, newElement] }));
      }
    }
    if (event.shiftKey) {
      if (event.key === 'A') {
        setState(prevState => ({ ...prevState, isHotKeyAddMenuOpen: true }));
      }
    }
    if (event.key === 'Delete' && state.activeItem != null) {
      deleteItem();
    }
  }


  const renderForm = () => {
    return state.form.map((item, index) => {
      let functions = {
        onClick: () => setState(prevState => ({ ...prevState, activeItem: item })),
        flipIsInput: () => { propertyChangeHandler(index, 'isInput', !item.isInput); },
        openSettings: () => { propertyChangeHandler(index, 'settingsCollapsed', !item.settingsCollapsed) },
        onInputChange: (value) => { propertyChangeHandler(index, 'content', value) },
        onPropertyChange: (type, value) => { propertyChangeHandler(index, type, value) },
        onDragStart: event => { dragStartHandler(event, item) },
        onDragLeave: dragEndHandler,
        onDragEnd: dragEndHandler,
        onDragOver: dragOverHandler,
        onDrop: event => { dropHandler(event, item) },
        onMouseDownWidth: event => { mouseDownWidthHandler(event, item) }
      };
      return <ItemLayout key={index} item={item} functions={functions} isActive={state.activeItem === item || state.activeHover === item} changingWidth={state.changingWith}></ItemLayout>;
    });
  }




  return (
    <div style={{ display: 'flex', width: '100%' }} >
      <Toast>Click on an item to edit it's content</Toast>
      {state.isHotKeyAddMenuOpen ? <AddItemsMenu positionX={state.x} positionY={state.y} addItem={addItem} close={() => { setState(prevState => ({ ...prevState, isHotKeyAddMenuOpen: false })); }}></AddItemsMenu> : <div></div>}
      <div className="campaigns-container sub"  >
        <div className="top-bar">
          <div className="buttons left">
            <div className="btn-container ">
              <button onClick={() => setState(prevState => ({ ...prevState, isAddMenuOpen: !state.isAddMenuOpen }))} className='btn text-white btn-add btn-with-badge'><i className="bi bi-plus-lg" ></i><p className='badge'>Shift+A</p></button>
              {state.isAddMenuOpen ? <AddItemsMenu addItem={addItem} close={() => { setState(prevState => ({ ...prevState, isAddMenuOpen: false })); }}></AddItemsMenu> : <div></div>}
            </div>
            <div className="btn-container">
              <button className='btn btn-danger btn-delete btn-with-badge' onClick={deleteItem}><i className="bi bi-dash-lg" ></i><p className='badge'>DEL</p></button>
            </div>
          </div>
          <div className='row right' style={{ flexWrap: 'nowrap' }}>
            <Button className="btn btn-proceed text-white btn-finish" onClick={sendForm}>Proceed</Button>
            <TemplatesMenu loadTemplate={loadTemplate}></TemplatesMenu>

          </div>


        </div>
        <div className="form-container">
          <div className="form" onSubmit={event => { event.preventDefault() }}>
            {state.loading ? <LargeLoader /> : renderForm()}
          </div>
        </div>

      </div>
    </div >


  );
}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

export default connect(mapStateToProps)(Editor);
