import { useState } from "react";
import { TrendingUp, Zap, Activity, BarChart3, Waves, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { AnalyticsChart } from "./AnalyticsChart";
import { RealtimeDataPanel } from "./RealtimeDataPanel";
import { SummaryReportTable } from "./SummaryReportTable";
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

export function Analytics() {
  const [selectedDevice, setSelectedDevice] = useState("device-001");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedGraphType, setSelectedGraphType] = useState("consumption");

  // Mock devices data
  const devices = [
    { id: "device-001", name: "Panel de Energía Principal A", location: "Edificio A - Piso 1" },
    { id: "device-002", name: "Unidad de Control HVAC", location: "Edificio A - Piso 2" },
    { id: "device-003", name: "Línea de Manufactura 1", location: "Piso de Producción" },
    { id: "device-004", name: "Circuito de Iluminación B", location: "Edificio B - Todos los Pisos" },
    { id: "device-005", name: "UPS Sala de Servidores", location: "Centro de Datos" }
  ];

  const shifts = [
    { id: "all", name: "Todos los Turnos" },
    { id: "morning", name: "Turno Matutino (6AM - 2PM)" },
    { id: "afternoon", name: "Turno Vespertino (2PM - 10PM)" },
    { id: "night", name: "Turno Nocturno (10PM - 6AM)" }
  ];

  const graphTypes = [
    { id: "consumption", name: "Consumo", icon: TrendingUp },
    { id: "parameterized", name: "Vista Parametrizada", icon: BarChart3 },
    { id: "harmonic", name: "Análisis Armónico", icon: Waves }
  ];

  // Mock analytics data
  const mockData: AnalyticsData[] = Array.from({ length: 24 }, (_, i) => ({
    deviceId: selectedDevice,
    timestamp: `${String(i).padStart(2, '0')}:00`,
    kvah: 45 + Math.random() * 20,
    billing: (45 + Math.random() * 20) * 8.5, // ₹8.5 per unit
    kva: 42 + Math.random() * 18,
    kw: 38 + Math.random() * 15,
    kwh: 35 + Math.random() * 25,
    pf: 0.85 + Math.random() * 0.1,
    kvarh_lag: 12 + Math.random() * 8,
    kvarh_lead: 8 + Math.random() * 5,
    co2_emissions: (35 + Math.random() * 25) * 0.82 // kg CO2 per kWh
  }));

  const selectedDeviceInfo = devices.find(d => d.id === selectedDevice);

  const handleExportData = () => {
    const headers = [
      'deviceId',
      'timestamp',
      'kvah',
      'billing',
      'kva',
      'kw',
      'kwh',
      'pf',
      'kvarh_lag',
      'kvarh_lead',
      'co2_emissions'
    ];

    const csvContent = [
      headers.join(','),
      ...mockData.map((row) => [
        row.deviceId,
        row.timestamp,
        row.kvah.toFixed(2),
        row.billing.toFixed(2),
        row.kva.toFixed(2),
        row.kw.toFixed(2),
        row.kwh.toFixed(2),
        row.pf.toFixed(3),
        row.kvarh_lag.toFixed(2),
        row.kvarh_lead.toFixed(2),
        row.co2_emissions.toFixed(2)
      ].join(','))
    ].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    link.setAttribute('download', `analisis-general-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Análisis General</h1>
          <p className="text-muted-foreground mt-1">
            Análisis detallado de energía específico por dispositivo
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleExportData}
            variant="outline" 
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar Datos
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Filtros de Análisis</CardTitle>
          </div>
          <CardDescription>
            Configure sus parámetros de análisis y ajustes de visualización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Device Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Selección de Dispositivo</label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-muted-foreground">{device.location}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Shift Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtro de Turno</label>
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Graph Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Gráfica</label>
              <Select value={selectedGraphType} onValueChange={setSelectedGraphType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de gráfica" />
                </SelectTrigger>
                <SelectContent>
                  {graphTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Device Info */}
          {selectedDeviceInfo && (
            <div className="mt-4 p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium">{selectedDeviceInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedDeviceInfo.location}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">Activo</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <EnvironmentalImpact data={mockData} />

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Section - Takes 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          <AnalyticsChart 
            data={mockData}
            graphType={selectedGraphType}
            deviceName={selectedDeviceInfo?.name || "Dispositivo Desconocido"}
            onGraphTypeChange={(v) => setSelectedGraphType(v)}
          />
        </div>

        {/* Real-time Data Panel - Takes 1/3 width */}
        <div className="space-y-6">
          <RealtimeDataPanel data={mockData[mockData.length - 1]} />
        </div>
      </div>

      {/* Summary Report Table */}
      <SummaryReportTable 
        data={mockData}
        deviceName={selectedDeviceInfo?.name || "Dispositivo Desconocido"}
      />
    </div>
  );
}