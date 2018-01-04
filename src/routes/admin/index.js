import { h, Component } from "preact";
import http from "../../http";

export default class Home extends Component {
  handleGameStart = () => {
    http.get("/start");
  };

  render() {
    return (
      <div>
        <button onClick={this.handleGameStart}>Start Game</button>
      </div>
    );
  }
}
