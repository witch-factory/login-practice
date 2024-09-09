import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h2>메인 페이지</h2>
      <p>메인 페이지입니다.</p>
      <ul>
        <li>
          <Link to='/login'>로그인</Link>
        </li>
        <li>
          <Link to='/register'>회원가입</Link>
        </li>
      </ul>
    </>
  );
}

export default App;
