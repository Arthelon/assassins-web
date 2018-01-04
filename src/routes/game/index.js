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
import Push from "push.js";

Push.Permission.request();

export default class Game extends Component {
  state = {
    userId: null,
    targetName: null,
    won: false
  };

  componentDidMount = async () => {
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
      const nameSnapshot = await database
        .ref(`users/${user.targetId}/displayName`)
        .once("value");
      this.setState({
        targetName: nameSnapshot.val()
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
      if (targetName) {
        Push.create("CIS Winter Ball", {
          body: "You have a new target!",
          icon: "../../assets/64.png",
          timeout: 4000,
          onClick: function() {
            window.focus();
            this.close();
          }
        });
        this.setState({
          targetName
        });
      }
    });
    database.ref(`users/${userKey}/won`).on("value", async snapshot => {
      const won = snapshot.val();
      if (won) {
        this.setState({ won });
      }
    });
  };

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
    const { targetName, won } = this.state;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {!won &&
          (targetName ? (
            <h1>Your current target is: {targetName}</h1>
          ) : (
            <h1>Game has not begun</h1>
          ))}
        {won && <h1>Congratulations! You have won!</h1>}
        <button onClick={this.handleWithdraw}>Withdraw</button>
      </div>
    );
  }
}
