import axios from "axios";
import { api_base_url } from "@/utils/utils";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";

// VERY BAD CACHING SYSTEM, ONLY GOOD FOR SMALL AMOUNT OF USERS WHICH IS THE CASE IN THIS CASE
let lastFetch = 0;
let cached_users = [];

export default function Scoreboard() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const date = new Date();

    if (lastFetch == 0 || date.getTime() - lastFetch > 120000) {
      axios.get(api_base_url + "/v1/data/scoreboard").then((res) => {
        cached_users = res.data;
        setUsers(res.data);
      });

      lastFetch = date.getTime();
    } else setUsers(cached_users);
  }, []);

  if (users == null)
    return <Spinner color="default" labelColor="foreground" size="lg" />;
  else
    return (
      <table className="scoreboard">
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
        {users.map((user, index) => (
          <tr key={index}>
            <th>{index + 1}</th>
            <th>{user.name}</th>
            <th>{user.score == null ? 0 : user.score}</th>
          </tr>
        ))}
      </table>
    );
}
