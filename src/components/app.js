import { h, Component } from "preact";
import { Router } from "preact-router";
import firebase from "../firebase";

import Home from "../routes/home";
import Admin from "../routes/admin";
import Game from "../routes/game";
// import Home from 'async!../routes/home';
// import Admin from 'async!../routes/admin';

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Admin path="/admin" />
          <Game path="/game" />
          <Home default />
        </Router>
      </div>
    );
  }
}
