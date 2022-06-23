import React, { Component, PropTypes, useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { initialConnect } from './actions';
import Layout from './components/Layout/Layout';
import routes from './routes';

const App = props => {

  useEffect(() => {
    props.initialConnect();
  });

  return (
    <Layout>
      <Routes>
        {routes.map(({ path, Component }, key) => (
          <Route exact path={path} key={key} element={Component} />
        ))}
      </Routes>
    </Layout>
  );

}


const mapStateToProps = (state) => {
  return { account: state.account }
}

const mapDispatchToProps = {
  initialConnect: initialConnect
}

export default connect(mapStateToProps, mapDispatchToProps)(App);