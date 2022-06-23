import React, { Component } from 'react';
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

class SiteBuilder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      form: [
        {
          content: this.props.title,
          width: 'four',
          isInput: false,
          settingsCollapsed: false,
          type: 'mainHeading',
          align: 'left',
          backgroundColor: "#FAFAFA",
          color: "#000000"
        },
        {
          content: this.props.description,
          width: 'two',
          isInput: false,
          settingsCollapsed: false,
          type: 'paragraph',
          align: 'left'
        },
        {
          content: this.props.img,
          width: 'two',
          isInput: false,
          type: 'image',
          settingsCollapsed: false
        }
      ],
      min: this.props.min,
      activeItem: '',
      activeHover: '',
      isAddMenuOpen: false
    }
  }

  render() {
    return (

      <div style={{ display: 'flex', width: '100%' }}>
        <Toast>Click on an item to edit it's content</Toast>

        <div className="item-navbar">
          <div className="list-manager">
            <div className="btn-container ">
              <button onClick={() => { this.setState({ isAddMenuOpen: !this.state.isAddMenuOpen }); }} className='btn text-white btn-add'><i className="bi bi-plus-lg" ></i></button>
              {this.state.isAddMenuOpen ? <AddItemsMenu addItem={this.addItem} close={() => { this.setState({ isAddMenuOpen: false }); }}></AddItemsMenu> : <div></div>}
            </div>
            <div className="row-buttons">
              <button className='btn btn-danger btn-delete' onClick={this.deleteItem}><i className="bi bi-dash-lg" ></i></button>
              <div className="column-buttons">
                <button className='btn btn-secondary' onClick={this.moveLeft}><i className="bi bi-arrow-up-short" ></i></button>
                <button className='btn btn-secondary' onClick={this.moveRight} style={{ marginTop: '-14px' }}><i className="bi bi-arrow-down-short" ></i></button>
              </div>
            </div>

          </div>

          <div className="item-list">
            {this.renderItemsList()}
          </div>

        </div>
        <div className="campaigns-container sub"  >
          <div className="top-bar">
            <TemplatesMenu loadTemplate={this.loadTemplate}></TemplatesMenu>
            <Button className="btn btn-add text-white btn-finish" onClick={this.sendForm}>Proceed</Button>

          </div>
          <div className="form-container">
            <div className="form" onSubmit={event => { event.preventDefault() }}>
              {this.state.loading ? <LargeLoader /> : this.renderForm()}
            </div>
          </div>

        </div>
      </div >


    );
  }

  renderForm = () => {
    return this.state.form.map((item, index) => {
      let functions = {
        flipIsInput: () => { this.propertyChangeHandler(index, 'isInput', !item.isInput); },
        onInputChange: (value) => { this.propertyChangeHandler(index, 'content', value) }
      };
      return <ItemLayout key={index} item={item} functions={functions} isActive={this.state.activeItem === item || this.state.activeHover === item}></ItemLayout>;
    });
  }

  renderItemsList = () => {
    return this.state.form.map((item, index) => {
      return (
        <div key={index} className={`item-position ${this.state.activeItem === item ? 'active' : ''}`} onClick={() => { this.setState({ activeItem: item }); }} onMouseEnter={() => { this.setState({ activeHover: item }) }} onMouseLeave={() => { this.setState({ activeHover: '' }) }} >
          <table>
            <tbody>
              <tr >
                <td className="item-data" style={{ paddingBottom: '4px', paddingTop: '4px', width: '90%' }}>{(item.type.charAt(0).toUpperCase() + item.type.slice(1)).replace(/([a-z](?=[A-Z]))/g, '$1 ')}</td>
                <td className="item-data" style={{ paddingBottom: '4px', paddingTop: '4px', width: '10%' }}>
                  <button className='btn collapse-arrow-btn' style={{ fontSize: '14px', padding: '2px' }} onClick={() => {
                    let data = [...this.state.form];
                    data[index].settingsCollapsed = !data[index].settingsCollapsed;
                    this.setState({ form: data });
                  }}>
                    {item.settingsCollapsed ? <i className="bi bi-caret-down-fill orange-text"></i> : <i className="bi bi-caret-up-fill orange-text "></i>}
                  </button></td>
              </tr>
            </tbody>
          </table>
          {
            !item.settingsCollapsed &&
            <div className="no-padding" >
              <div className="row-container">
                <div style={{ fontSize: '13px', paddingBottom: '5px', width: '30%', display: 'flex' }}>
                  w:
                  <select value={item.width} onChange={(event) => { this.propertyChangeHandler(index, 'width', event.target.value) }}>
                    <option value={'one'} >25%</option>
                    <option value={'two'} >50%</option>
                    <option value={'three'}>75%</option>
                    <option value={'four'}>100%</option>
                  </select>
                </div>
                {
                  'align' in item &&
                  <div style={{ width: '70%', textAlign: 'right' }}>
                    <button className={`btn align-btn no-padding ${item.align === 'left' ? 'align-active' : ''}`} onClick={() => { this.propertyChangeHandler(index, 'align', 'left') }}><i className="bi bi-text-left"></i></button>
                    <button className={`btn align-btn no-padding ${item.align === 'center' ? 'align-active' : ''}`} onClick={() => { this.propertyChangeHandler(index, 'align', 'center') }}><i className="bi bi-text-center"></i></button>
                    <button className={`btn align-btn no-padding ${item.align === 'right' ? 'align-active' : ''}`} onClick={() => { this.propertyChangeHandler(index, 'align', 'right') }}><i className="bi bi-text-right"></i></button>
                  </div>
                  ||
                  <div style={{ width: '70%' }}></div>
                }

                {
                  'backgroundColor' in item || 'color' in item ?
                    <div style={{ width: '100%', display: 'flex', paddingBottom: '5px' }}>
                      {
                        'backgroundColor' in item &&
                        <div style={{ fontSize: '13px', width: '40%', display: 'flex' }}>
                          <span style={{ fontSize: '13px', marginRight: '5px' }}>Bg:</span>
                          <input style={{ width: '20px', height: '20px', marginLeft: '5px' }} type="color" value={item.backgroundColor} onChange={(event) => { this.propertyChangeHandler(index, 'backgroundColor', event.target.value) }}></input>
                        </div>
                      }
                      {
                        'color' in item &&
                        <div style={{ width: '40%', display: 'flex' }}>
                          <span style={{ fontSize: '13px' }}>Text:</span>
                          <input style={{ width: '20px', height: '20px', marginLeft: '5px' }} type="color" value={item.color} onChange={(event) => { this.propertyChangeHandler(index, 'color', event.target.value) }}></input>
                        </div>
                      }
                    </div>
                    :
                    null
                }

                <hr className="divider"></hr>
              </div>

            </div>
          }

        </div >)
    });
  }

  propertyChangeHandler = (index, property, value) => {
    let data = [...this.state.form];
    data[index][property] = value;
    this.setState({ form: data });
  }

  loadData = () => {
    axios.get('campaigns').then(response => {
    }).catch(error => {
      console.error(error);
    });
  }

  loadTemplate = (templateId) => {
    this.setState({ ...this.state, loading: true });
    let img, mh, p;
    axios.get(`campaigns/${templateId}`).then(response => {
      let form = [];
      response.data.elements.forEach(e => {
        let content =
          (() => {
            if (e.elementType.name == 'mainHeading' && !mh) {
              mh = true;
              return this.props.title;
            }
            if (e.elementType.name == 'image' && !img) {
              img = true;
              return this.props.img;
            }
            if (e.elementType.name == 'paragraph' && !p) {
              p = true;
              return this.props.description;
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
          ...(e.color != null && { color: e.color.colorHTML })
        });
      });
      this.setState({ form });
    }).catch(error => {
      console.error(error);
    });
    this.setState({ ...this.state, loading: false });
  }

  sendForm = async () => {
    try {

      let contract = await createCampaignContract(this.props.account, this.props.min, this.props.hardcap);
      let data = {
        contract: contract,
        title: this.props.title,
        description: this.props.description,
        image: this.props.img,
        approvers: [],
        user: {
          address: this.props.account,
          owned: [],
          approverTo: []
        }, elements: []
      };
      this.state.form.forEach(item => {
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
          this.props.navigate('/list-campaigns/' + contract);
        }).
        catch(error => {
          console.error(error);
        })
    } catch (err) {
      console.error(err);
    }
  }

  moveLeft = () => {
    if (this.state.activeItem.type === 'mainHeading') {
      return;
    }
    let index = this.state.form.indexOf(this.state.activeItem);
    if (index > 0 && this.state.form.length > 1) {
      let data = this.state.form;
      let tmp = data[index - 1];
      data[index - 1] = data[index];
      data[index] = tmp;
      this.setState({ form: data });
    }
  }

  moveRight = () => {
    if (this.state.activeItem.type === 'mainHeading') {
      return;
    }
    let index = this.state.form.indexOf(this.state.activeItem);
    if (index < this.state.form.length - 1 && index >= 0) {
      let data = this.state.form;
      let tmp = data[index + 1];
      data[index + 1] = data[index];
      data[index] = tmp;
      this.setState({ form: data });
    }
  }

  addItem = item => {
    this.setState(prevState => ({
      form: [...prevState.form, item]
    }));
  }

  deleteItem = () => {
    if (this.state.activeItem === '' || this.state.activeItem.type === 'mainHeading') {
      return;
    }
    this.setState(prevState => ({
      form: prevState.form.filter(obj => { return obj !== this.state.activeItem })
    }));
  }

}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

export default withRouter(connect(mapStateToProps)(SiteBuilder));
