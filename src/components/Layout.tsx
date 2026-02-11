import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { Analytics } from "./Analytics";
import { ImportedAnalysisPage } from "./ImportedAnalysisPage";
import { Configuration } from "./Configuration";
import { Reports } from "./Reports";
import { Settings } from "./Settings";
import { SparkCheck } from "./SparkCheck";
import { About } from "./About";

interface LayoutProps {
  onLogout: () => void;
}

export function Layout({ onLogout }: LayoutProps) {
  const [currentPage, setCurrentPage] = useState("about");

  const renderContent = () => {
    switch (currentPage) {
      case "about":
        return <About />;
      case "dashboard":
        return <Dashboard />;
      case "analysis":
      case "analysis-realtime":
        return <Analytics />;
      case "analysis-imported":
        return <ImportedAnalysisPage />;
      case "configuration":
        return <Configuration />;
      case "reports":
        return <Reports />;
      case "sparkcheck":
        return <SparkCheck />;
      case "settings":
        return <Settings />;
      default:
        return <About />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-shrink-0">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} onLogout={onLogout} />
      </div>
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}