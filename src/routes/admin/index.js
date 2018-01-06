import { h, Component } from "preact";
import http from "../../http";
import { setAdmin, isAdmin } from "../../auth";
import { Grid, Cell, Button, TextField, Icon } from "preact-fluid";
import LeaderboardTable from "./Leaderboard";
import firebase from "../../firebase";

const stateMap = ["Closed", "Signups Open", "In Progress"];

export default class Home extends Component {
  state = {
    authenticated: !!isAdmin(),
    inputValue: null,
    error: false,
    gameState: 0
  };

  componentDidMount() {
    if (isAdmin()) {
      this.setState({
        authenticated: true
      });
    }
    firebase
      .database()
      .ref("gameState")
      .on("value", snapshot => {
        console.log(snapshot.val());
        this.setState({
          gameState: snapshot.val()
        });
      });
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
    const { authenticated, error, inputValue, gameState } = this.state;

    return (
      <Grid columns={1}>
        <Cell center middle>
          {authenticated ? (
            <div>
              <h1>Game State: {stateMap[gameState]}</h1>
              <Button
                primary
                onClick={this.handleGameOpen}
                style={{ marginRight: "2rem" }}
                left={<Icon name="pencil-square" />}
              >
                Open Signups
              </Button>
              <Button
                primary
                onClick={this.handleGameStart}
                left={<Icon name="play-circle" />}
              >
                Start Game
              </Button>
              <Button
                secondary
                onClick={this.handleGameStop}
                right={<Icon name="times-circle" />}
              >
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
