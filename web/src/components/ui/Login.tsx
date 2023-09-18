import { FormEvent } from "react";

export default function Login() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    const username = e.target[0].value;
    const password = e.target[1].value;
  };

  const Input = ({ type, name }: any) => {
    return (
      <div className="flex flex-col gap-2 ">
        <label>{name}</label>
        <input className="text-black" type={type} />
      </div>
    );
  };

  return (
    <form className="flex flex-col gap-8" method="submit" onSubmit={onSubmit}>
      <Input type="text" name="Username" />
      <Input type="password" name="Password" />

      <button type="submit">Login</button>
    </form>
  );
}
