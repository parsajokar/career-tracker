import { type ReactNode } from "react";

interface LoginFormProps {
  mode: "login" | "register";
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export function LoginForm({
  mode,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
}: LoginFormProps): ReactNode {
  return (
    <div className="app">
      <div className="login-card">
        <h1>{mode === "login" ? "Login" : "Register"}</h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        <button onClick={onSubmit}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <button className="link" onClick={onToggleMode}>
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
