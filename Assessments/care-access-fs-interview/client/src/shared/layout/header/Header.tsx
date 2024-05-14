import React from "react";

import NewLogo from "../../logo/newLogo.js";
import "./Header.css";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="App-header">
      <div className="logo-white">
        <NewLogo />
      </div>
      <h1 className="App-title">{title}</h1>
    </header>
  );
};
