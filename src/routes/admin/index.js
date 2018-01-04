import { h, Component } from "preact";
import http from "../../http";
import { setAdmin, isAdmin } from "../../auth";

export default class Home extends Component {
  state = {
    authenticated: !!isAdmin()
  };

  componentDidMount() {
    console.log(isAdmin());
    if (isAdmin()) {
      console.log("IS ADMIN");
      this.setState({
        authenticated: true
      });
    }
  }

  authenticate = () => {
    console.log(this.input);
    if (this.input.value === process.env.PREACT_APP_ADMIN_PASSWORD) {
      this.setState({
        authenticated: true
      });
      setAdmin(true);
    }
  };

  handleGameStart = () => {
    http.get("/start");
  };

  handleGameStop = () => {
    http.get("/stop");
  };

  render() {
    const { authenticated } = this.state;

    return (
      <div>
        {authenticated ? (
          <div>
            <button onClick={this.handleGameStart}>Start Game</button>
            <button onClick={this.handleGameStop}>Stop Game</button>
          </div>
        ) : (
          <div>
            <input ref={ref => (this.input = ref)} />
            <button onClick={this.authenticate}>Authenticate</button>
          </div>
        )}
      </div>
    );
  }
}
