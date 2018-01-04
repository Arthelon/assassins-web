import { h, Component } from "preact";
import http from "../../http";

export default class Home extends Component {
  handleGameStart = () => {
    http.get("/start");
  };

  handleGameStop = () => {
    http.get("/stop");
  };

  render() {
    return (
      <div>
        <button onClick={this.handleGameStart}>Start Game</button>
        <button onClick={this.handleGameStop}>Stop Game</button>
      </div>
    );
  }
}
