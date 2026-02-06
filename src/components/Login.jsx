import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
    isLoginOk: false,
  });

  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin(event) {
    event.preventDefault();
    setControlState((prev) => {
      return {
        ...prev,
        isLoggingIn: true,
      };
    });

    const email = emailRef.current.value;
    const pass = passRef.current.value;

    const result = await login(email, pass);

    setControlState((prev) => {
      return {
        isLoggingIn: false,
        isLoginError: !result,
        isLoginOk: result,
      };
    });
  }

  if (!user.isLoggedIn)
    return (
      <form onSubmit={onLogin}>
        <table>
          <tbody>
            <tr>
              <th>Email</th>
              <td>
                <input type="email" name="email" id="email" ref={emailRef} required />
              </td>
            </tr>
            <tr>
              <th>Password</th>
              <td>
                <input
                  type="password"
                  name="password"
                  id="password"
                  ref={passRef}
                  required
                />{" "}
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" disabled={controlState.isLoggingIn}>
          {controlState.isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {controlState.isLoginError && <div>Login incorrect</div>}
      </form>
    );
  else return <Navigate to="/profile" replace />;
}
