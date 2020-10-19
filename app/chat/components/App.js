import React from "react";
import PropTypes from 'prop-types';
// import { NavLink, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";
import ChatController from './containers/ChatController';
import "../assets/scss/theme.scss";
import 'simplebar/dist/simplebar.min.css';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  // <Route exact path="/" component={HomePage} />
  render() {
    return (
      <ChatController />
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
