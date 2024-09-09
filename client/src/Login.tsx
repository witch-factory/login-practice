import { useState } from "react";
import apiClient from "./utils/apiClient";

type LoginData = {
  username: string;
  password: string;
};

function LoginPage() {
  const [credentials, setCredentials] = useState<LoginData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(credentials);
    const response = await apiClient
      .post("auth/login", { json: credentials })
      .json();
    console.log(response);
  };

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>사용자명</label>
          <input
            id='username'
            type='text'
            name='username'
            placeholder='사용자명'
            required
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='password'>비밀번호</label>
          <input
            id='password'
            type='password'
            name='password'
            placeholder='비밀번호'
            required
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <button type='submit'>로그인</button>
      </form>
      <a href='/register'>회원가입</a>
    </>
  );
}

export default LoginPage;
