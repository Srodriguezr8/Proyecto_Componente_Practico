import { useState } from "react";
import { ImportedAnalysisSection } from "./ImportedAnalysisSection";

interface AnalyticsData {
  deviceId: string;
  timestamp: string;
  kvah: number;
  billing: number;
  kva: number;
  kw: number;
  kwh: number;
  pf: number;
  kvarh_lag: number;
  kvarh_lead: number;
  co2_emissions: number;
}

export function ImportedAnalysisPage() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importValidation, setImportValidation] = useState<{
    status: 'idle' | 'validating' | 'success' | 'error';
    message: string;
    warnings?: string[];
  }>({ status: 'idle', message: '' });
  const [importedData, setImportedData] = useState<AnalyticsData[] | null>(null);
  const [showImportedDataPreview, setShowImportedDataPreview] = useState(false);
  const [showImportedInfo, setShowImportedInfo] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pricePerKwh, setPricePerKwh] = useState(8.5);
  const [selectedGraphType, setSelectedGraphType] = useState("consumption");

  return (
    <div className="p-6 bg-background min-h-full">
      <ImportedAnalysisSection
        showImportDialog={showImportDialog}
        setShowImportDialog={setShowImportDialog}
        importedFile={importedFile}
        setImportedFile={setImportedFile}
        importValidation={importValidation}
        setImportValidation={setImportValidation}
        importedData={importedData}
        setImportedData={setImportedData}
        showImportedDataPreview={showImportedDataPreview}
        setShowImportedDataPreview={setShowImportedDataPreview}
        showImportedInfo={showImportedInfo}
        setShowImportedInfo={setShowImportedInfo}
        showPreviewModal={showPreviewModal}
        setShowPreviewModal={setShowPreviewModal}
        pricePerKwh={pricePerKwh}
        setPricePerKwh={setPricePerKwh}
        selectedGraphType={selectedGraphType}
        setSelectedGraphType={setSelectedGraphType}
      />
    </div>
  );
}
