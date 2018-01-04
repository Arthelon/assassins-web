import { h, Component } from "preact";
import {
  getUser,
  getUserKey,
  setUserKey,
  clearUserKey,
  logout
} from "../../auth";
import { route } from "preact-router";
import firebase from "../../firebase";
import http from "../../http";

export default class Game extends Component {
  state = {
    userId: null,
    targetName: null
  };

  async componentDidMount() {
    const user = await getUser();
    if (!user) {
      console.log(user);
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
    console.log(userKey);
    if (!gameStarted && !userKey) {
      console.log(userKey);
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
    this.setState({
      userId: userKey
    });
    database.ref(`users/${userKey}/targetId`).on("value", async snapshot => {
      const targetId = snapshot.val();
      const targetNameSnapshot = await database
        .ref(`users/${targetId}/displayName`)
        .once("value");
      // push notif
      const targetName = targetNameSnapshot.val();
      this.setState({
        targetName
      });
    });
  }

  handleWithdraw = async () => {
    // show withdraw prompt
    try {
      clearUserKey();
      const { status } = await http.post("/withdraw", {
        userId: this.state.userId,
        gameStarted: !!this.state.targetName
      });
      console.log(`Logout status: ${status}`);
      await firebase.auth().signOut();
      route("/");
    } catch (err) {
      console.log(err);
    }
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
