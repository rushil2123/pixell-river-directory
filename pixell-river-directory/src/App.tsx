import { useState } from "react";
import EmployeesPage from "./pages/EmployeesPage";
import OrganizationPage from "./pages/OrganizationPage";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import"./App.css";
import "./styles.css"
type Tab = "employees" | "organization";

function App() {
  const [tab, setTab] = useState<Tab>("employees");

  return (
    <div className="app-shell">
      {/* Top Navigation (always visible) */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.25rem",
          borderBottom: "1px solid var(--border)",
          marginBottom: "1rem",
          background: "var(--card-bg)",
        }}
      >
        <div className="logo-container">
          <img className="logo" src="logo.png" alt="Pixell River Directory" /><span>Pixell River Directory</span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Show nav tabs only when signed in */}
          <SignedIn>
            <button
              type="button"
              onClick={() => setTab("employees")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: tab === "employees" ? 600 : 400,
              }}
            >
              Employees
            </button>
            <button
              type="button"
              onClick={() => setTab("organization")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: tab === "organization" ? 600 : 400,
              }}
            >
              Organization
            </button>
          </SignedIn>

          {/* Auth controls on the right */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary" type="button">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>

      <main style={{ padding: "0 1.25rem 1.5rem 1.25rem" }}>
        {/* If signed out → show full-page sign-in */}
        <SignedOut>
          <div
            style={{
              maxWidth: 420,
              margin: "3rem auto",
              textAlign: "center",
            }}
          >
            <h2>Please sign in to access the directory</h2>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              You must be logged in to view employees and organization roles.
            </p>
            <SignIn routing="hash" />
          </div>
        </SignedOut>

        {/* If signed in → show the actual app */}
        <SignedIn>
          {tab === "employees" ? <EmployeesPage /> : <OrganizationPage />}
        </SignedIn>
      </main>
    </div>
  );
}

export default App;
