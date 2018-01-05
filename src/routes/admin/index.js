import { h, Component } from "preact";
import http from "../../http";
import { setAdmin, isAdmin } from "../../auth";
import { Grid, Cell, Button, TextField } from "preact-fluid";
import LeaderboardTable from "./Leaderboard";
import firebase from "../../firebase";

export default class Home extends Component {
  state = {
    authenticated: !!isAdmin(),
    inputValue: null,
    error: false
  };

  componentDidMount() {
    if (isAdmin()) {
      this.setState({
        authenticated: true
      });
    }
  }

  handleInputChange = e => {
    this.setState({
      inputValue: e.target.value
    });
  };

  authenticate = () => {
    if (this.state.inputValue === process.env.PREACT_APP_ADMIN_PASSWORD) {
      this.setState({
        authenticated: true,
        inputValue: null,
        error: false
      });
      setAdmin(true);
    } else {
      this.setState({
        error: true
      });
    }
  };

  handleGameOpen = () => {
    firebase
      .database()
      .ref("gameState")
      .set(1);
  };

  handleGameStart = () => {
    http.get("/start");
  };

  handleGameStop = () => {
    http.get("/stop");
  };

  render() {
    const { authenticated, error, inputValue } = this.state;

    return (
      <Grid columns={1}>
        <Cell center middle>
          {authenticated ? (
            <div>
              <Button primary onClick={this.handleGameOpen}>
                Open Game
              </Button>
              <Button primary onClick={this.handleGameStart}>
                Start Game
              </Button>
              <Button secondary onClick={this.handleGameStop}>
                Stop Game
              </Button>
              <h1>Leaderboard</h1>
              <LeaderboardTable />
            </div>
          ) : (
            <div>
              <TextField
                label="Admin Password"
                ref={ref => (this.input = ref)}
                placeholder="Admin Password"
                onChange={this.handleInputChange}
                value={inputValue}
                errorText={error && "Invalid Password"}
              />
              <Button
                primary
                onClick={this.authenticate}
                style={{ marginTop: "2rem" }}
              >
                Submit
              </Button>
            </div>
          )}
        </Cell>
      </Grid>
    );
  }
}
