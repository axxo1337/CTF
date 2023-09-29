import { ChangeEvent, FormEvent, useState } from "react";

import { Input, Checkbox, user } from "@nextui-org/react";
import axios from "axios";
import { Regexs, api_base_url } from "@/utils/utils";

export default function Login({ onSuccess }: any) {
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const onInputChange = (e) => {
    const target = e.target;

    switch (parseInt(target.name)) {
      case 0:
        {
          const username = target.value.trim();

          if (Regexs.username.match(username) != null) {
            if (!usernameInvalid) setUsernameInvalid(true);
            return;
          }

          setUsernameInvalid(false);
        }
        break;
      case 1:
        {
          const password = target.value;

          if (password == "") {
            if (!passwordInvalid) setPasswordInvalid(true);
            return;
          }

          setPasswordInvalid(false);
        }
        break;
      default:
        console.log("[-] Something is wrong with inputs");
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const username = e.target[0].value;
    const password = e.target[1].value;

    axios
      .get(
        api_base_url +
          "/v1/auth/signin?a=" +
          username +
          "&b=" +
          password +
          "&c=0"
      )
      .then((res) => {
        onSuccess(res.data);
      })
      .catch((e) => {
        alert("Failed to login");
      });
  };

  return (
    <form
      className="flex flex-col gap-8 w-[260px]"
      method="submit"
      onSubmit={onSubmit}
    >
      <Input
        name="0"
        type="text"
        label="Username"
        variant="bordered"
        className="max-w-xs"
        color="primary"
        onChange={onInputChange}
      />

      <Input
        name="1"
        type="password"
        label="Password"
        variant="bordered"
        className="max-w-xs"
        color="primary"
        onChange={onInputChange}
      />

      <button type="submit" disabled={usernameInvalid && passwordInvalid}>
        Login
      </button>
    </form>
  );
}
