import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ConsumptionChartProps {
  selectedDay: string;
  selectedDevice: string;
}

export function ConsumptionChart({ selectedDay, selectedDevice }: ConsumptionChartProps) {
  // Mock data - in real app this would come from API based on filters
  const consumptionData = [
    { name: "Dispositivo 1 - Edificio Principal", value: 2400, color: "#fbbf24" },
    { name: "Dispositivo 2 - Manufactura", value: 4567, color: "#f59e0b" },
    { name: "Dispositivo 3 - Bloque de Oficinas", value: 1890, color: "#d97706" },
    { name: "Sistemas HVAC", value: 3210, color: "#b45309" },
    { name: "Iluminación", value: 1250, color: "#92400e" },
    { name: "Equipamiento", value: 2100, color: "#78350f" },
  ];

  const totalConsumption = consumptionData.reduce((sum, item) => sum + item.value, 0);

  // Prevent rendering if container might not be sized yet
  if (totalConsumption === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalConsumption) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value.toLocaleString()} kWh ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-border/30 shadow-sm bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">Resumen de Consumo de Energía</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución del consumo de energía en todos los dispositivos activos para {selectedDay}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Consumption Summary */}
          <div className="text-center space-y-1 py-2">
            <div className="text-4xl font-bold text-foreground">
              {totalConsumption.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Consumo total kWh
            </div>
          </div>

          {/* Pie Chart with fixed height and responsive container */}
          <div className="flex justify-center">
            <div style={{ width: '100%', maxWidth: '400px', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consumptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {consumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend - Separated from chart */}
          <div className="flex flex-wrap gap-3 justify-center px-2">
            {consumptionData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-foreground">{entry.name}</span>
              </div>
            ))}
          </div>

          {/* Device Status List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium">Estado de Dispositivos</h4>
            <div className="grid grid-cols-1 gap-2">
              {consumptionData.slice(0, 3).map((device, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-sm">{device.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{device.value.toLocaleString()} kWh</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" title="Activo" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}