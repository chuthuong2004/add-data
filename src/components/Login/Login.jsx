import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/login";

const Login = () => {
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const res = await authApi.login({ email, password });
      console.log(res);
      if (res.isAdmin) {
        localStorage.setItem(
          "authTokens",
          JSON.stringify({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })
        );
        navigate("/");
      }
      setError("Vui lòng đăng nhập tài khoản admin mới có thể thêm product !");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    SetEmail("");
    setPassword("");
  };
  return (
    <div className="logout-container">
      {error && <span>{error}</span>}
      <div className="login">
        <input
          type="text"
          onChange={(e) => SetEmail(e.target.value)}
          placeholder="Nhập email admin"
          value={email}
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập password admin"
          value={password}
        />
        <button onClick={handleClick}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default Login;
