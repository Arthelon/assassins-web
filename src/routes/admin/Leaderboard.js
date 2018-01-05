import { h, Component } from "preact";
import { List } from "preact-fluid";
import "react-table/react-table.css";
import ReactTable from "react-table";
import firebase from "../../firebase";

const columns = [
  { Header: "Name", accessor: "displayName" },
  { Header: "Kills", accessor: "kills" }
];

export default class LeaderboardTable extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    const db = firebase.database();
    db
      .ref("users")
      .orderByChild("kills")
      .on("value", snapshot => {
        const users = snapshot.val() || {};
        this.setState({
          users: Object.keys(users).map(userId => ({ ...users[userId] }))
        });
      });
  }

  render() {
    return <ReactTable data={this.state.users} columns={columns} />;
  }
}
