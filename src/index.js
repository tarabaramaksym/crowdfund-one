import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import './polyfill'

import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(

  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App></App>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
  ,
  document.getElementById('root')
);

