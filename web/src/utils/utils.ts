export const api_base_url = "http://localhost:8080";

export const Regexs = {
  username: "/^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/g",
  password: "/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,16}$/g",
};
