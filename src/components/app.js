import { h, Component } from "preact";
import { Router } from "preact-router";
import "font-awesome/css/font-awesome.min.css"; // remove me later

import Home from "../routes/home";
import Game from "../routes/game";
import Admin from "async!../routes/admin";

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
      <div id="app" style={{ padding: "40px 20px" }}>
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
