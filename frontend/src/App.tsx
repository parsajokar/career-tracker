import { useEffect, useState } from "react";
import "./App.css";
import { useAuth } from "./hooks/useAuth";
import { useApplications } from "./hooks/useApplications";
import { LoginForm } from "./components/LoginForm";
import { ApplicationForm } from "./components/ApplicationForm";
import { ApplicationList } from "./components/ApplicationList";

export default function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const auth = useAuth();
  const applications = useApplications();

  useEffect(() => {
    (async () => {
      await auth.checkAuth();
    })();
  }, [auth.checkAuth]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    applications.fetchApplications();
  }, [auth.isAuthenticated, applications.fetchApplications]);

  if (!auth.isAuthenticated) {
    return (
      <LoginForm
        mode={mode}
        username={auth.username}
        password={auth.password}
        onUsernameChange={auth.setUsername}
        onPasswordChange={auth.setPassword}
        onSubmit={mode === "login" ? auth.login : auth.register}
        onToggleMode={() => setMode(mode === "login" ? "register" : "login")}
      />
    );
  }

  return (
    <div className="app">
      <button className="logout-btn" onClick={auth.logout}>
        Logout
      </button>

      <div className="container">
        <h1>Career Tracker</h1>

        <ApplicationForm
          title={applications.title}
          company={applications.company}
          city={applications.city}
          onTitleChange={applications.setTitle}
          onCompanyChange={applications.setCompany}
          onCityChange={applications.setCity}
          onSubmit={applications.submitApplication}
        />

        <ApplicationList
          applications={applications.applications}
          onStatusChange={applications.updateStatus}
          onDelete={applications.deleteApplication}
        />
      </div>
    </div>
  );
}
