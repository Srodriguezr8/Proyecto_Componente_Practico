import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./tu-archivo-de-componentes";

const chartConfig = {
  consumo: {
    label: "Consumo Predicho (kWh)",
    color: "hsl(var(--chart-1))",
  },
};

export function EnergyPredictionChart({ data }) {
  // data debe ser un array de objetos: [{ hora: "00:00", kwh: 0.5 }, ...]

  // RF-05: Lógica para identificar picos (30% sobre el promedio)
  const promedio = data.reduce((acc, curr) => acc + curr.kwh, 0) / data.length;
  const umbralPico = promedio * 1.3;

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="hora" tickLine={false} axisLine={false} />
        <YAxis hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="kwh"
          type="monotone"
          stroke="var(--color-consumo)"
          strokeWidth={2}
          dot={({ payload, cx, cy }) => {
            // RF-05: Pintar puntos en rojo si superan el umbral
            const esPico = payload.kwh > umbralPico;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill={esPico ? "red" : "var(--color-consumo)"}
                stroke={esPico ? "red" : "white"}
              />
            );
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
