import React from "react";

import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { StatusUpdateProvider } from "../statusupdate/StatusUpdate";
import "./AppFrame.css";

interface AppFrameProps {
  title: string;
  children: React.ReactNode;
}

export const AppFrame: React.FC<AppFrameProps> = ({ title, children }) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <StatusUpdateProvider>
      <div className="App">
        <Header title={title} />
        <main>{children}</main>
        <Footer />
      </div>
    </StatusUpdateProvider>
  );
};
