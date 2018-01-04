import { h, Component } from "preact";
import { route } from "preact-router";
import { getUser } from "../../auth";
import firebase from "../../firebase";

const provider = new firebase.auth.GoogleAuthProvider();

export default class Home extends Component {
  state = {
    gameStarted: false
  };

  async componentDidMount() {
    const user = await getUser();
    if (user) {
      route("/game");
    }
    const database = firebase.database();
    database.ref("gameStarted").on("value", function(snapshot) {
      this.setState({
        gameStarted: snapshot.val()
      });
    });
  }

  handleClick = async () => {
    try {
      if (!gameStarted) {
        await firebase.auth().signInWithPopup(provider);
        route("/game");
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { gameStarted } = this.state;
    // show message if game has started
    return (
      <div>
        <button onClick={this.handleClick} disabled={gameStarted}>
          Join Now
        </button>
      </div>
    );
  }
}
