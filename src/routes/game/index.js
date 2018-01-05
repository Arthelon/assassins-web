import { h, Component } from "preact";
import { getUser, getUserKey, setUserKey, clearUserKey } from "../../auth";
import { route } from "preact-router";
import firebase from "../../firebase";
import http from "../../http";
import Push from "push.js";
import { Button, Grid, Cell } from "preact-fluid";
import style from "./style";

Push.Permission.request();

async function logout(userId, gameStarted) {
  clearUserKey();
  const { status } = await http.post("/withdraw", {
    userId,
    gameStarted
  });
  console.log(`Logout status: ${status}`);
  await firebase.auth().signOut();
}

export default class Game extends Component {
  removeUserListener = null;

  state = {
    userId: null,
    targetName: null,
    won: false,
    pendingWithdraw: false
  };

  componentDidMount = async () => {
    let user = null;
    this.removeUserListener = firebase
      .auth()
      .onAuthStateChanged(function(info) {
        user = info;
        if (!user) {
          route("/");
        }
      });
    let gameState = null;
    firebase
      .database()
      .ref("gameState")
      .on("value", snapshot => {
        gameState = snapshot.val();
        if (gameState === 0) {
          route("/");
        }
      });
    const database = firebase.database();
    let userKey = getUserKey();
    let userRecord = await database
      .ref(`users/${userKey}`)
      .once("value")
      .then(snapshot => {
        return snapshot.val();
      });

    if (!userRecord || !userKey) {
      if (gameState === 1) {
        user;
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
        route("/");
      }
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
        await logout(this.state.userId, !!this.state.targetName);
      }
    });
  };

  componentWillUnmount() {
    this.removeUserListener();
  }

  cancelWithdraw = () => {
    this.setState({
      pendingWithdraw: false
    });
  };

  handleWithdraw = async () => {
    const { pendingWithdraw } = this.state;
    if (!pendingWithdraw) {
      this.setState({
        pendingWithdraw: true
      });
    } else {
      try {
        await logout(this.state.userId, !!this.state.targetName);
        route("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { targetName, won, pendingWithdraw } = this.state;

    return (
      <Grid columns={1}>
        <Cell center middle>
          {!won &&
            (targetName ? (
              <h2 class={style.title}>Your current target is: {targetName}</h2>
            ) : (
              <h2 class={style.title}>Game has not begun</h2>
            ))}
          {won && <h1>Congratulations! You have won!</h1>}
        </Cell>
        <Cell center middle>
          <div>
            {pendingWithdraw ? (
              <div>
                <p>Are you sure you want to withdraw?</p>
                <div>
                  <Button primary onClick={this.handleWithdraw}>
                    Yes
                  </Button>
                  <Button secondary onClick={this.cancelWithdraw}>
                    No
                  </Button>
                </div>
              </div>
            ) : (
              <Button secondary onClick={this.handleWithdraw}>
                Withdraw
              </Button>
            )}
          </div>
        </Cell>
      </Grid>
    );
  }
}
