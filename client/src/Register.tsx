import { useState } from "react";
import apiClient from "./utils/apiClient";

type RegisterData = {
  username: string;
  password: string;
  isAdmin: boolean;
};

function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    password: "",
    isAdmin: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    const response = await apiClient
      .post("auth/register", {
        json: formData,
      })
      .json();

    console.log(response);
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>사용자명</label>
          <input
            id='username'
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>비밀번호</label>
          <input
            id='password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              name='isAdmin'
              checked={formData.isAdmin} // checked 속성으로 상태 관리
              onChange={handleChange}
            />
            관리자 여부
          </label>
        </div>
        <button type='submit'>회원가입</button>
      </form>
      <a href='/login'>로그인</a>
    </div>
  );
}

export default RegisterPage;
