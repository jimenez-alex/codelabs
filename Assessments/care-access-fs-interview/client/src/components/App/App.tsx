import React from "react";
import Logo from "../../klogo.js";
import NewLogo from "../../newLogo.js";
import UsersTable from "../Users/UsersTable";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-white">
          <NewLogo />
        </div>
        <h1 className="App-title">Welcome to Kyruus</h1>
      </header>
      <main>
        <UsersTable />
      </main>
      <footer>
        <Logo />
      </footer>
    </div>
  );
};

export default App;
