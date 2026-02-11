import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Calendar, TrendingUp, Zap } from "lucide-react";

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

interface SummaryReportTableProps {
  data: AnalyticsData[];
  deviceName: string;
}

export function SummaryReportTable({ data, deviceName }: SummaryReportTableProps) {
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Calculate summary metrics
  const calculateSummary = () => {
    const totalKWH = data.reduce((sum, item) => sum + item.kwh, 0);
    const averageKW = data.reduce((sum, item) => sum + item.kw, 0) / data.length;
    const maxKW = Math.max(...data.map(item => item.kw));
    const totalBilling = data.reduce((sum, item) => sum + item.billing, 0);
    const averagePF = data.reduce((sum, item) => sum + item.pf, 0) / data.length;
    const totalCO2 = data.reduce((sum, item) => sum + item.co2_emissions, 0);

    // Mock data for different time periods
    const todayKWH = totalKWH * 0.3; // 30% of total for "today"
    const yesterdayKWH = totalKWH * 0.25; // 25% for "yesterday"  
    const thisMonthKWH = totalKWH; // Full total for "this month"
    const lastReading = data[data.length - 1];

    return {
      todayKWH,
      yesterdayKWH,
      thisMonthKWH,
      lastReading,
      totalKWH,
      averageKW,
      maxKW,
      totalBilling,
      averagePF,
      totalCO2
    };
  };

  const summary = calculateSummary();

  const reportData = [
    {
      period: "Hoy",
      kwh: summary.todayKWH,
      billing: summary.todayKWH * 8.5,
      peakKW: summary.maxKW * 0.8,
      avgPF: summary.averagePF,
      co2: summary.todayKWH * 0.82,
      status: "Activo",
      icon: Calendar
    },
    {
      period: "Ayer", 
      kwh: summary.yesterdayKWH,
      billing: summary.yesterdayKWH * 8.5,
      peakKW: summary.maxKW * 0.75,
      avgPF: summary.averagePF * 0.95,
      co2: summary.yesterdayKWH * 0.82,
      status: "Completado",
      icon: TrendingUp
    },
    {
      period: "Este Mes",
      kwh: summary.thisMonthKWH,
      billing: summary.totalBilling,
      peakKW: summary.maxKW,
      avgPF: summary.averagePF,
      co2: summary.totalCO2,
      status: "En Progreso",
      icon: Calendar
    },
    {
      period: "Última Lectura",
      kwh: summary.lastReading.kwh,
      billing: summary.lastReading.billing,
      peakKW: summary.lastReading.kw,
      avgPF: summary.lastReading.pf,
      co2: summary.lastReading.co2_emissions,
      status: "En Vivo",
      icon: Zap
    }
  ];

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    
    try {
      const summary = calculateSummary();
      const reportData = [
        {
          period: "Hoy",
          kwh: summary.todayKWH,
          billing: summary.todayKWH * 8.5,
          peakKW: summary.maxKW * 0.8,
          avgPF: summary.averagePF,
          co2: summary.todayKWH * 0.82,
          status: "Activo",
        },
        {
          period: "Ayer", 
          kwh: summary.yesterdayKWH,
          billing: summary.yesterdayKWH * 8.5,
          peakKW: summary.maxKW * 0.75,
          avgPF: summary.averagePF * 0.95,
          co2: summary.yesterdayKWH * 0.82,
          status: "Completado",
        },
        {
          period: "Este Mes",
          kwh: summary.thisMonthKWH,
          billing: summary.totalBilling,
          peakKW: summary.maxKW,
          avgPF: summary.averagePF,
          co2: summary.totalCO2,
          status: "En Progreso",
        },
        {
          period: "Última Lectura",
          kwh: summary.lastReading.kwh,
          billing: summary.lastReading.billing,
          peakKW: summary.lastReading.kw,
          avgPF: summary.lastReading.pf,
          co2: summary.lastReading.co2_emissions,
          status: "En Vivo",
        }
      ];

      if (format === 'pdf') {
        // Exportar a PDF con estructura de tabla
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        let yPosition = 15;
        const margin = 12;
        const contentWidth = pageWidth - 2 * margin;

        // Título
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('REPORTE RESUMIDO DE ENERGÍA', margin, yPosition);
        
        yPosition += 10;
        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`Dispositivo: ${deviceName}`, margin, yPosition);
        yPosition += 6;
        pdf.text(`Generado: ${new Date().toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`, margin, yPosition);

        // Línea separadora
        yPosition += 10;
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Tabla de métricas
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('HISTORIAL DE CONSUMO', margin, yPosition);
        yPosition += 8;

        // Encabezados de tabla
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setFillColor(50, 100, 150);
        pdf.setTextColor(255, 255, 255);

        const col1 = margin;
        const col2 = margin + 35;
        const col3 = margin + 65;
        const col4 = margin + 95;
        const col5 = margin + 125;
        const col6 = margin + 150;
        const col7 = margin + 170;

        const headerY = yPosition;
        pdf.rect(col1, headerY - 5, contentWidth, 6, 'F');
        
        pdf.text('Período', col1 + 1, headerY);
        pdf.text('kWh', col2 + 1, headerY);
        pdf.text('₹ Fact.', col3 + 1, headerY);
        pdf.text('Pico kW', col4 + 1, headerY);
        pdf.text('FP Prom', col5 + 1, headerY);
        pdf.text('CO₂ kg', col6 + 1, headerY);
        pdf.text('Estado', col7 + 1, headerY);

        yPosition += 7;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(8);

        // Filas de datos
        reportData.forEach((row, idx) => {
          // Fondo alternado
          if (idx % 2 === 0) {
            pdf.setFillColor(240, 245, 250);
            pdf.rect(col1, yPosition - 5, contentWidth, 6, 'F');
          }

          pdf.text(row.period, col1 + 1, yPosition);
          pdf.text(row.kwh.toFixed(1), col2 + 1, yPosition);
          pdf.text(row.billing.toFixed(2), col3 + 1, yPosition);
          pdf.text(row.peakKW.toFixed(1), col4 + 1, yPosition);
          pdf.text(row.avgPF.toFixed(3), col5 + 1, yPosition);
          pdf.text(row.co2.toFixed(1), col6 + 1, yPosition);
          pdf.text(row.status, col7 + 1, yPosition);

          yPosition += 6;
        });

        // Tabla de Totales y Promedios
        yPosition += 8;
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('RESUMEN DE MÉTRICAS', margin, yPosition);
        yPosition += 8;

        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(9);

        const metrics = [
          ['Consumo Total', `${summary.totalKWH.toFixed(1)} kWh`],
          ['Consumo Promedio', `${summary.averageKW.toFixed(2)} kW`],
          ['Demanda Máxima', `${summary.maxKW.toFixed(2)} kW`],
          ['Costo Total', `₹${summary.totalBilling.toFixed(2)}`],
          ['Factor de Potencia Promedio', `${summary.averagePF.toFixed(3)}`],
          ['Emisiones CO₂', `${summary.totalCO2.toFixed(2)} kg`]
        ];

        metrics.forEach((metric, idx) => {
          if (idx % 2 === 0) {
            pdf.setFillColor(240, 245, 250);
            pdf.rect(margin, yPosition - 5, contentWidth, 6, 'F');
          }

          pdf.setFont('Helvetica', 'bold');
          pdf.text(metric[0], margin + 2, yPosition);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(metric[1], pageWidth - margin - 40, yPosition);
          yPosition += 6;
        });

        // Footer
        yPosition = pdf.internal.pageSize.getHeight() - 10;
        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('SparkCheck Energy Management System - Reporte generado automáticamente', pageWidth / 2, yPosition, { align: 'center' });

        // Descargar PDF
        pdf.save(`reporte-resumido-${deviceName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);

      } else if (format === 'excel') {
        // Exportar a CSV (Excel compatible)
        const headers = ['Período', 'Energía (kWh)', 'Facturación (₹)', 'Demanda Pico (kW)', 'Factor Potencia Prom.', 'Emisiones CO₂ (kg)', 'Estado'];
        
        let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
        csvContent += `REPORTE RESUMIDO DE ENERGÍA\n`;
        csvContent += `Dispositivo:,${deviceName}\n`;
        csvContent += `Generado:,${new Date().toLocaleDateString('es-ES')}\n`;
        csvContent += '\n';
        csvContent += headers.join(',') + '\n';
        
        reportData.forEach(row => {
          csvContent += [
            row.period,
            row.kwh.toFixed(2),
            row.billing.toFixed(2),
            row.peakKW.toFixed(2),
            row.avgPF.toFixed(3),
            row.co2.toFixed(2),
            row.status
          ].join(',') + '\n';
        });

        csvContent += '\n';
        csvContent += 'RESUMEN DE MÉTRICAS\n';
        csvContent += ['Métrica', 'Valor'].join(',') + '\n';
        csvContent += ['Consumo Total', `${summary.totalKWH.toFixed(1)} kWh`].join(',') + '\n';
        csvContent += ['Consumo Promedio', `${summary.averageKW.toFixed(2)} kW`].join(',') + '\n';
        csvContent += ['Demanda Máxima', `${summary.maxKW.toFixed(2)} kW`].join(',') + '\n';
        csvContent += ['Costo Total', `₹${summary.totalBilling.toFixed(2)}`].join(',') + '\n';
        csvContent += ['Factor de Potencia Promedio', summary.averagePF.toFixed(3)].join(',') + '\n';
        csvContent += ['Emisiones CO₂', `${summary.totalCO2.toFixed(2)} kg`].join(',') + '\n';

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `reporte-${deviceName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error(`Error exportando a ${format.toUpperCase()}:`, error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Activo":
      case "En Vivo":
        return "default";
      case "Completado":
        return "secondary";
      case "En Progreso":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Reporte Resumido
            </CardTitle>
            <CardDescription>
              Métricas agregadas de energía para {deviceName}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting} className="gap-2">
                <Download className="w-4 h-4" />
                {isExporting ? "Exportando..." : "Descargar Reporte"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Exportar como Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                <FileText className="w-4 h-4" />
                Exportar como PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={tableRef} className="space-y-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Período</TableHead>
                  <TableHead>Energía (kWh)</TableHead>
                  <TableHead>Facturación (₹)</TableHead>
                  <TableHead>Demanda Pico (kW)</TableHead>
                  <TableHead>Factor de Potencia Promedio</TableHead>
                  <TableHead>Emisiones CO₂ (kg)</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((row, index) => {
                  const Icon = row.icon;
                  return (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          {row.period}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.kwh.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">kWh</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">₹{row.billing.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">INR</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.peakKW.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">kW</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.avgPF.toFixed(3)}</div>
                        <div className="text-xs text-muted-foreground">
                          {row.avgPF >= 0.95 ? "Excelente" : row.avgPF >= 0.85 ? "Bueno" : "Pobre"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{row.co2.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">kg CO₂</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Consumo Total</span>
              </div>
              <div className="text-2xl font-bold">{summary.totalKWH.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">kWh</div>
            </div>
            
            <div className="p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-chart-3" />
                <span className="text-sm font-medium">Facturación Total</span>
              </div>
              <div className="text-2xl font-bold">₹{summary.totalBilling.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">INR</div>
            </div>
            
            <div className="p-4 bg-accent/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-chart-2" />
                <span className="text-sm font-medium">Demanda Pico</span>
              </div>
              <div className="text-2xl font-bold">{summary.maxKW.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">kW</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}