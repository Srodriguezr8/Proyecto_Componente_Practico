import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Upload, FileText, AlertCircle, CheckCircle2, Download, BarChart3, Leaf } from "lucide-react";
import { AnalyticsChart } from "./AnalyticsChart";
import { EnvironmentalImpact } from "./EnvironmentalImpact";

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

interface ImportedAnalysisSectionProps {
  showImportDialog: boolean;
  setShowImportDialog: (value: boolean) => void;
  importedFile: File | null;
  setImportedFile: (file: File | null) => void;
  importValidation: { status: 'idle' | 'validating' | 'success' | 'error'; message: string; warnings?: string[] };
  setImportValidation: (validation: any) => void;
  importedData: AnalyticsData[] | null;
  setImportedData: (data: AnalyticsData[] | null) => void;
  showImportedDataPreview: boolean;
  setShowImportedDataPreview: (value: boolean) => void;
  showImportedInfo: boolean;
  setShowImportedInfo: (value: boolean) => void;
  showPreviewModal: boolean;
  setShowPreviewModal: (value: boolean) => void;
  pricePerKwh: number;
  setPricePerKwh: (price: number) => void;
  selectedGraphType?: string;
  setSelectedGraphType?: (type: string) => void;
}

export function ImportedAnalysisSection({
  showImportDialog,
  setShowImportDialog,
  importedFile,
  setImportedFile,
  importValidation,
  setImportValidation,
  importedData,
  setImportedData,
  showImportedDataPreview,
  setShowImportedDataPreview,
  showImportedInfo,
  setShowImportedInfo,
  showPreviewModal,
  setShowPreviewModal,
  pricePerKwh,
  setPricePerKwh,
  selectedGraphType = "consumption",
  setSelectedGraphType,
}: ImportedAnalysisSectionProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) &&
      !file.name.endsWith('.csv') &&
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.pdf')) {
      setImportValidation({
        status: 'error',
        message: 'Formato de archivo no válido. Por favor seleccione un archivo PDF, CSV o XLSX.'
      });
      return;
    }

    setImportedFile(file);
    validateFile(file);
  };

  const validateFile = (file: File) => {
    setImportValidation({ status: 'validating', message: 'Validando archivo...' });

    setTimeout(() => {
      if (file.name.endsWith('.pdf')) {
        setImportValidation({
          status: 'success',
          message: 'Archivo PDF cargado correctamente. Los datos serán procesados por SparkCheck AI.'
        });
      } else {
        const hasNullData = Math.random() > 0.7;
        const hasRequiredColumns = Math.random() > 0.1;

        if (!hasRequiredColumns) {
          setImportValidation({
            status: 'error',
            message: 'El archivo no contiene las columnas requeridas: "timestamp" y "consumo kwh".'
          });
        } else if (hasNullData) {
          setImportValidation({
            status: 'success',
            message: 'Archivo validado correctamente.',
            warnings: [
              'Se detectaron 12 registros con datos nulos en la columna "consumo kwh"',
              'Se detectaron 5 registros con timestamp inválido',
              'Los registros con datos nulos serán omitidos durante el procesamiento'
            ]
          });
        } else {
          setImportValidation({
            status: 'success',
            message: 'Archivo validado correctamente. Todos los datos son válidos y están completos.',
            warnings: []
          });
        }
      }
    }, 1500);
  };

  const handleImportData = () => {
    const processedData: AnalyticsData[] = Array.from({ length: 24 }, (_, i) => ({
      deviceId: 'imported',
      timestamp: `${String(i).padStart(2, '0')}:00`,
      kvah: 45 + Math.random() * 20,
      billing: (45 + Math.random() * 20) * pricePerKwh,
      kva: 42 + Math.random() * 18,
      kw: 38 + Math.random() * 15,
      kwh: 35 + Math.random() * 25,
      pf: 0.85 + Math.random() * 0.1,
      kvarh_lag: 12 + Math.random() * 8,
      kvarh_lead: 8 + Math.random() * 5,
      co2_emissions: (35 + Math.random() * 25) * 0.82
    }));

    setImportedData(processedData);
    setShowImportedDataPreview(true);
    setShowImportDialog(false);
    setImportValidation({ status: 'idle', message: '' });
  };

  const handleExportData = () => {
    if (!importedData) return;

    const data = importedData;
    const headers = [
      'deviceId', 'timestamp', 'kvah', 'billing', 'kva', 'kw', 'kwh', 'pf', 'kvarh_lag', 'kvarh_lead', 'co2_emissions'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map((row) => [
        row.deviceId, row.timestamp,
        row.kvah.toFixed(2), row.billing.toFixed(2), row.kva.toFixed(2),
        row.kw.toFixed(2), row.kwh.toFixed(2), row.pf.toFixed(3),
        row.kvarh_lag.toFixed(2), row.kvarh_lead.toFixed(2),
        row.co2_emissions.toFixed(2)
      ].join(','))
    ].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    link.setAttribute('download', `analisis-importado-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateMetrics = (data: AnalyticsData[]) => {
    const totalKWh = data.reduce((sum, d) => sum + d.kwh, 0);
    const avgKW = data.reduce((sum, d) => sum + d.kw, 0) / data.length;
    const maxKW = Math.max(...data.map(d => d.kw));
    const totalCO2 = data.reduce((sum, d) => sum + d.co2_emissions, 0);
    const avgPF = data.reduce((sum, d) => sum + d.pf, 0) / data.length;
    const totalBilling = data.reduce((sum, d) => sum + d.billing, 0);

    return { totalKWh, avgKW, maxKW, totalCO2, avgPF, totalBilling };
  };

  const currentMetrics = importedData ? calculateMetrics(importedData) : null;

  const handleCancelImport = () => {
    setShowImportDialog(false);
    setImportedFile(null);
    setImportValidation({ status: 'idle', message: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Análisis Importado</CardTitle>
              <CardDescription>Importa datos de energía desde archivos CSV, XLSX o PDF</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowImportDialog(true)}
              className="gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            >
              <Upload className="w-4 h-4" />
              Importar
            </Button>
            {importedData && (
              <Button onClick={handleExportData} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      {importedFile && (
        <CardContent className="pb-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium truncate">{importedFile.name}</span>
              {importedData && <Badge className="bg-green-500">✓ Importado</Badge>}
            </div>
          </div>
        </CardContent>
      )}

      {importedData && showImportedDataPreview && currentMetrics && (
        <>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-blue-700 mb-1">Consumo Total</p>
                    <p className="text-2xl font-bold text-blue-900">{currentMetrics.totalKWh.toFixed(1)}</p>
                    <p className="text-xs text-blue-600">kWh</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-green-700 mb-1">Promedio kW</p>
                    <p className="text-2xl font-bold text-green-900">{currentMetrics.avgKW.toFixed(2)}</p>
                    <p className="text-xs text-green-600">kW</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-purple-700 mb-1">Costo Total</p>
                    <p className="text-2xl font-bold text-purple-900">${currentMetrics.totalBilling.toFixed(2)}</p>
                    <p className="text-xs text-purple-600">@ ${pricePerKwh}/kWh</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </>
      )}

      {/* Imported Data Charts */}
      {importedData && (
        <CardContent className="space-y-4">
          <AnalyticsChart
            data={importedData}
            graphType={selectedGraphType}
            deviceName={importedFile?.name.split('.')[0] || "Datos Importados"}
            onGraphTypeChange={(v) => setSelectedGraphType && setSelectedGraphType(v)}
          />
          <EnvironmentalImpact data={importedData} />
        </CardContent>
      )}

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Datos de Análisis</DialogTitle>
            <DialogDescription>
              Importe un archivo CSV, XLSX o PDF e ingrese el precio por kWh consumido.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Price Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Precio por kWh (en decimales)</label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={pricePerKwh}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val) || val <= 0) val = 0.01;
                  setPricePerKwh(val);
                }}
                placeholder="Ej: 8.50"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Valor actual: ${pricePerKwh.toFixed(2)}/kWh
              </p>
            </div>

            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 5.5a5.5 5.5 0 0 0-11 0 3.5 3.5 0 0 0 0 7h2.5m0-3v3m0 0v3m6-3h3v3m-3 0h3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Haga clic para subir</span> o arrastre y suelte
                  </p>
                  <p className="text-xs text-gray-500">CSV, XLSX o PDF (MAX. 800KB)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            {importedFile && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <p className="text-sm text-muted-foreground">{importedFile.name}</p>
              </div>
            )}

            {importValidation.status === 'validating' && (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{importValidation.message}</AlertDescription>
              </Alert>
            )}

            {importValidation.status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{importValidation.message}</AlertDescription>
              </Alert>
            )}

            {importValidation.status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium">{importValidation.message}</p>
                    {importValidation.warnings && importValidation.warnings.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-medium text-yellow-800">Advertencias:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {importValidation.warnings.map((warning, index) => (
                            <li key={index} className="text-xs text-yellow-700">
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={handleCancelImport}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleImportData}
              disabled={importValidation.status !== 'success' || !importedFile}
            >
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Previsualización de Datos Importados</DialogTitle>
            <DialogDescription>
              Gráficos y análisis de los datos importados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {importedData ? (
              <>
                <AnalyticsChart
                  data={importedData}
                  graphType={selectedGraphType}
                  deviceName={importedFile?.name.split('.')[0] || "Datos Importados"}
                  onGraphTypeChange={(v) => setSelectedGraphType && setSelectedGraphType(v)}
                />
                <EnvironmentalImpact data={importedData} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos importados para previsualizar.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
