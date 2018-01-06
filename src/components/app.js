import { h, Component } from "preact";
import { Router } from "preact-router";
import "font-awesome/css/font-awesome.min.css"; // remove me later
import { ThemeProvider } from "preact-fluid";

import Home from "../routes/home";
import Game from "../routes/game";
import Admin from "async!../routes/admin";

const theme = {
  primaryColor: "#d8b88c",
  primaryColorDark: "#c59553",
  primaryColorLight: "#d8cb8c",
  secondaryColor: "#757575",
  secondaryColorDark: "#757575",
  secondaryColorLight: "757575",
  darkColor: "#273756",
  lightColor: "#fff",
  linkColor: "#d8b88c",
  linkColorDark: "#d8b88c",
  grayColor: "#757575",
  grayColorLight: "#757575",
  grayColorDark: "#757575",
  borderColor: "#fff",
  borderColorDark: "#ebebeb",
  bgColor: "#273756",
  bgColorDark: "#172133",
  bgColorLight: "#356176",
  controlSuccessColor: "#8ced7d",
  controlWarningColor: "#fc7373",
  controlErrorColor: "#fb8c50",
  codeColor: "#e06870",
  highlightColor: "#ffe9b3",
  notifyBgColor: "#757575",
  listActiveColor: "#f0f3f5"
};

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
        <ThemeProvider theme={theme}>
          <Router onChange={this.handleRoute}>
            <Home path="/" />
            <Admin path="/admin" />
            <Game path="/game" />
            <Home default />
          </Router>
        </ThemeProvider>
      </div>
    );
  }
}
