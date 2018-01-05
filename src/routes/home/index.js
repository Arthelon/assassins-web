import { h, Component } from "preact";
import { route } from "preact-router";
import { getUser } from "../../auth";
import firebase from "../../firebase";
import style from "../../style";
import { Grid, Cell, Button, Icon } from "preact-fluid";

const provider = new firebase.auth.GoogleAuthProvider();

export default class Home extends Component {
  state = {
    gameStarted: false
  };

  componentDidMount = async () => {
    const user = await getUser();
    if (user) {
      route("/game");
    }
    const database = firebase.database();
    database.ref("gameStarted").on("value", snapshot => {
      this.setState({
        gameStarted: snapshot.val()
      });
    });
  };

  componentWillUnmount() {
    firebase
      .database()
      .ref("gameStarted")
      .off();
  }

  handleClick = async () => {
    try {
      if (!this.state.gameStarted) {
        await firebase.auth().signInWithPopup(provider);
        route("/game");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { gameStarted } = this.state;
    console.log(style.layout);
    // show message if game has started
    return (
      <div style={style.layout}>
        <Grid columns={1}>
          <Cell center middle>
            <div>
              <Button
                onClick={this.handleClick}
                disabled={gameStarted}
                primary
                left={<Icon name="google-plus" size="xsmall" />}
              >
                Join
              </Button>
            </div>
          </Cell>
        </Grid>
      </div>
    );
  }
}
