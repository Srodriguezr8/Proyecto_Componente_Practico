import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, BarChart3, Waves } from "lucide-react";

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

interface AnalyticsChartProps {
  data: AnalyticsData[];
  graphType: string;
  deviceName: string;
  onGraphTypeChange?: (value: string) => void;
}

export function AnalyticsChart({ data, graphType, deviceName }: AnalyticsChartProps) {
  // Add check for empty data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Hay Datos Disponibles</CardTitle>
          <CardDescription>No hay datos de análisis disponibles para este dispositivo</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const renderConsumptionChart = () => (
    <div className="w-full min-h-[400px]" style={{ minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height={400} minHeight={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp" 
            className="text-xs" 
            tick={{ fontSize: 12, fill: '#000000' }}
          />
          <YAxis className="text-xs" tick={{ fontSize: 12, fill: '#000000' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: '#000000'
            }}
            labelFormatter={(value) => `Hora: ${value}`}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} ${name === 'kwh' ? 'kWh' : name === 'kw' ? 'kW' : name === 'billing' ? '₹' : name.toUpperCase()}`,
              name === 'kwh' ? 'Consumo de Energía' : 
              name === 'kw' ? 'Potencia Activa' :
              name === 'billing' ? 'Monto de Facturación' : name.toUpperCase()
            ]}
          />
          <Legend wrapperStyle={{ color: '#000000' }} />
          <Area
            type="monotone"
            dataKey="kwh"
            stroke="#fbbf24"
            strokeWidth={2}
            fill="url(#consumptionGradient)"
            name="Energía (kWh)"
          />
          <Line
            type="monotone"
            dataKey="kw"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Potencia (kW)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderParameterizedChart = () => (
    <div className="w-full min-h-[400px]" style={{ minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height={400} minHeight={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp" 
            className="text-xs" 
            tick={{ fontSize: 12, fill: '#000000' }}
          />
          <YAxis className="text-xs" tick={{ fontSize: 12, fill: '#000000' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: '#000000'
            }}
            labelFormatter={(value) => `Hora: ${value}`}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} ${
                name === 'kvah' ? 'KVAH' :
                name === 'kva' ? 'KVA' :
                name === 'kw' ? 'KW' :
                name === 'pf' ? '' :
                name === 'kvarh_lag' ? 'KVARh' :
                name === 'kvarh_lead' ? 'KVARh' : ''
              }`,
              name === 'kvah' ? 'Energía Aparente' :
              name === 'kva' ? 'Potencia Aparente' :
              name === 'kw' ? 'Potencia Activa' :
              name === 'pf' ? 'Factor de Potencia' :
              name === 'kvarh_lag' ? 'Energía Reactiva (Retraso)' :
              name === 'kvarh_lead' ? 'Energía Reactiva (Adelanto)' : name
            ]}
          />
          <Legend wrapperStyle={{ color: '#000000' }} />
          <Line
            type="monotone"
            dataKey="kvah"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="KVAH"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="kva"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="KVA"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="kw"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            name="KW"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pf"
            stroke="hsl(var(--chart-4))"
            strokeWidth={2}
            name="Factor de Potencia"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderHarmonicChart = () => (
    <div className="w-full min-h-[400px]" style={{ minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height={400} minHeight={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="timestamp" 
            className="text-xs" 
            tick={{ fontSize: 12, fill: '#000000' }}
          />
          <YAxis className="text-xs" tick={{ fontSize: 12, fill: '#000000' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: '#000000'
            }}
            labelFormatter={(value) => `Hora: ${value}`}
            formatter={(value: number, name: string) => [
              `${value.toFixed(2)} KVARh`,
              name === 'kvarh_lag' ? 'Energía Reactiva (Retraso)' : 'Energía Reactiva (Adelanto)'
            ]}
          />
          <Legend wrapperStyle={{ color: '#000000' }} />
          <Bar
            dataKey="kvarh_lag"
            fill="#fbbf24"
            name="KVARh (Retraso)"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="kvarh_lead"
            fill="#f59e0b"
            name="KVARh (Adelanto)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const getChartTitle = () => {
    switch (graphType) {
      case "consumption":
        return "Tendencias de Consumo de Energía";
      case "parameterized":
        return "Análisis de Potencia Parametrizado";
      case "harmonic":
        return "Análisis Armónico - Potencia Reactiva";
      default:
        return "Análisis de Energía";
    }
  };

  const getChartDescription = () => {
    switch (graphType) {
      case "consumption":
        return "Monitoreo en tiempo real de consumo de energía y potencia activa";
      case "parameterized":
        return "Parámetros de potencia integrales incluyendo KVAH, KVA, KW y Factor de Potencia";
      case "harmonic":
        return "Análisis de potencia reactiva mostrando componentes de retraso y adelanto";
      default:
        return "Análisis del sistema de energía";
    }
  };

  const getChartIcon = () => {
    switch (graphType) {
      case "consumption":
        return TrendingUp;
      case "parameterized":
        return BarChart3;
      case "harmonic":
        return Waves;
      default:
        return TrendingUp;
    }
  };

  const ChartIcon = getChartIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartIcon className="w-5 h-5 text-primary" />
          {getChartTitle()}
        </CardTitle>
        <CardDescription>
          {getChartDescription()} para {deviceName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Controls */}
          <Tabs value={graphType} onValueChange={(v) => onGraphTypeChange && onGraphTypeChange(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consumption" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Consumo
              </TabsTrigger>
              <TabsTrigger value="parameterized" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Parámetros
              </TabsTrigger>
              <TabsTrigger value="harmonic" className="flex items-center gap-2">
                <Waves className="w-4 h-4" />
                Armónico
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Chart Display */}
          <div className="w-full">
            {graphType === "consumption" && renderConsumptionChart()}
            {graphType === "parameterized" && renderParameterizedChart()}
            {graphType === "harmonic" && renderHarmonicChart()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}