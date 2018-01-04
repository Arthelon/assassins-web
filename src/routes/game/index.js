import { h, Component } from "preact";
import { getUser, getUserKey, setUserKey, logout } from "../../auth";
import { route } from "preact";
import firebase from "../../firebase";

export default class Game extends Component {
  state = {
    targetName: null
  };

  async componentDidMount() {
    const user = await getUser();
    if (!user) {
      route("/");
      return;
    }
    const database = firebase.database();
    let userKey = getUserKey();
    const snapshot = await database.ref(`gameStarted`).once("value");
    const gameStarted = snapshot.val();
    this.setState({
      gameStarted
    });
    if (!gameStarted && !userKey) {
      userKey = database
        .ref()
        .child("users")
        .push().key;
      setUserKey(userKey);
      database.ref(`users/${userKey}`).set({
        id: userKey,
        displayName: user.displayName
      });
    } else {
      // remember to clear key
      const user = await database
        .ref(`users/${userKey}`)
        .once("value")
        .then(snapshot => {
          return snapshot.val();
        });
      this.setState({
        targetName: user.targetName
      });
    }
    database.ref(`users/${userKey}/targetId`).on("value", async snapshot => {
      const targetId = snapshot.val();
      const targetNameSnapshot = await database
        .ref(`users/${targetId}/displayName`)
        .once("value");
      const targetName = targetNameSnapshot.val();
      this.setState({
        targetName
      });
    });
  }

  handleWithdraw = () => {
    // show withdraw prompt
  };

  render() {
    const { targetName } = this.state;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {targetName ? (
          <h1>Your current target is: {targetName}</h1>
        ) : (
          <h1>Game has not begun</h1>
        )}
        <button onClick={this.handleWithdraw}>Withdraw</button>
      </div>
    );
  }
}
