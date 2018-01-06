import { h, Component } from "preact";
import { List } from "preact-fluid";
import "react-table/react-table.css";
import ReactTable from "react-table";
import firebase from "../../firebase";

const columns = [
  { Header: "Name", accessor: "displayName" },
  {
    Header: "Kills",
    accessor: "kills",
    Cell: ({ value }) => (value ? value : "0")
  },
  {
    Header: "Is Alive",
    accesor: "withdrawn",
    id: "withdrawn",
    Cell: ({ value }) => (value ? "No" : "Yes"),
    filterMethod: (filter, row) => {
      if (filter.value === "all") {
        return true;
      } else if (filter.value === "alive") {
        return !row[filter.id];
      }
      return row[filter.id];
    },
    Filter: ({ filter, onChange }) => (
      <select
        onChange={event => onChange(event.target.value)}
        style={{ width: "100%" }}
        value={filter ? filter.value : "all"}
      >
        <option value="all">Show All</option>
        <option value="alive">Show Alive</option>
        <option value="dead">Show Dead</option>
      </select>
    )
  }
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
    return (
      <ReactTable
        filterable={true}
        data={this.state.users}
        columns={columns}
        defaultSorted={[{ id: "kills", desc: true }]}
      />
    );
  }
}
