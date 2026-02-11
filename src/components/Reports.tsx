import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Zap,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileDown
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface ReportData {
  totalConsumption: number;
  averageConsumption: number;
  peakDemand: number;
  totalCost: number;
  activeDevices: number;
  alerts: number;
  period: string;
  generatedDate: string;
  devices: {
    name: string;
    consumption: number;
    status: string;
  }[];
  hourlyData: {
    hour: string;
    consumption: number;
  }[];
}

export function Reports() {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<"monthly" | "annual">("monthly");
  const previewContentRef = useRef<HTMLDivElement>(null);

  // Datos de ejemplo para el reporte
  const reportData: ReportData = {
    totalConsumption: 24567.8,
    averageConsumption: 1023.7,
    peakDemand: 2847.3,
    totalCost: 3247.89,
    activeDevices: 12,
    alerts: 3,
    period: "Enero 2026",
    generatedDate: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    devices: [
      { name: "Sistema HVAC Principal", consumption: 8234.5, status: "Activo" },
      { name: "Iluminación LED Torre A", consumption: 3421.2, status: "Activo" },
      { name: "Servidores Data Center", consumption: 5678.9, status: "Activo" },
      { name: "Equipos de Oficina", consumption: 2345.6, status: "Activo" },
      { name: "Sistema de Seguridad", consumption: 1234.5, status: "Activo" }
    ],
    hourlyData: [
      { hour: "00:00", consumption: 456.2 },
      { hour: "06:00", consumption: 678.5 },
      { hour: "12:00", consumption: 1234.8 },
      { hour: "18:00", consumption: 2145.3 },
      { hour: "23:00", consumption: 789.4 }
    ]
  };

  // Datos para reporte anual
  const annualReportData: ReportData = {
    totalConsumption: 294813.6,
    averageConsumption: 24567.8,
    peakDemand: 3456.7,
    totalCost: 38976.54,
    activeDevices: 12,
    alerts: 28,
    period: "Año 2025",
    generatedDate: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    devices: [
      { name: "Sistema HVAC Principal", consumption: 98814.0, status: "Activo" },
      { name: "Iluminación LED Torre A", consumption: 41054.4, status: "Activo" },
      { name: "Servidores Data Center", consumption: 68146.8, status: "Activo" },
      { name: "Equipos de Oficina", consumption: 28147.2, status: "Activo" },
      { name: "Sistema de Seguridad", consumption: 14814.0, status: "Activo" }
    ],
    hourlyData: [
      { hour: "Enero", consumption: 24567.8 },
      { hour: "Febrero", consumption: 22145.3 },
      { hour: "Marzo", consumption: 25678.9 },
      { hour: "Abril", consumption: 23456.1 },
      { hour: "Mayo", consumption: 24789.5 },
      { hour: "Junio", consumption: 26543.2 },
      { hour: "Julio", consumption: 28234.7 },
      { hour: "Agosto", consumption: 27891.4 },
      { hour: "Septiembre", consumption: 25432.8 },
      { hour: "Octubre", consumption: 24123.6 },
      { hour: "Noviembre", consumption: 23567.2 },
      { hour: "Diciembre", consumption: 24383.1 }
    ]
  };

  const currentReportData = reportType === "monthly" ? reportData : annualReportData;

  const handleGenerateReport = (type: "monthly" | "annual") => {
    setReportType(type);
    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Importar dinámicamente las librerías de PDF
      const jsPDF = (await import('jspdf')).jsPDF;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 15;
      const margin = 12;
      const contentWidth = pageWidth - 2 * margin;
      const lineHeight = 7;

      // Configurar fuentes y colores
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('REPORTE DE CONSUMO ENERGÉTICO', margin, yPosition);
      
      yPosition += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Período: ${currentReportData.period}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Generado: ${currentReportData.generatedDate}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Tipo: Reporte ${reportType === 'annual' ? 'Anual' : 'Mensual'}`, margin, yPosition);
      
      // Línea separadora
      yPosition += 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      // Tabla de Resumen de Métricas
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('RESUMEN DE MÉTRICAS', margin, yPosition);
      yPosition += 8;

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);

      const metrics = [
        ['Consumo Total', `${currentReportData.totalConsumption.toLocaleString()} kWh`],
        ['Consumo Promedio', `${currentReportData.averageConsumption.toLocaleString()} kWh/${reportType === 'annual' ? 'mes' : 'día'}`],
        ['Demanda Pico', `${currentReportData.peakDemand.toLocaleString()} kW`],
        ['Costo Total', `$${currentReportData.totalCost.toLocaleString()}`],
        ['Dispositivos Activos', `${currentReportData.activeDevices}`],
        ['Alertas', `${currentReportData.alerts}`]
      ];

      metrics.forEach((metric, idx) => {
        // Fondo alternado
        if (idx % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(margin, yPosition - 5, contentWidth, lineHeight + 1, 'F');
        }
        
        pdf.setFont('Helvetica', 'bold');
        pdf.text(metric[0], margin + 2, yPosition);
        pdf.setFont('Helvetica', 'normal');
        pdf.text(metric[1], margin + 80, yPosition);
        yPosition += 7;
      });

      // Tabla de Consumo por Dispositivo
      yPosition += 6;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('CONSUMO POR DISPOSITIVO', margin, yPosition);
      yPosition += 8;

      // Encabezados de tabla
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setFillColor(50, 50, 100);
      pdf.setTextColor(255, 255, 255);
      
      const col1X = margin;
      const col2X = margin + 85;
      const col3X = margin + 115;
      const col4X = margin + 140;
      const headerY = yPosition;

      pdf.rect(col1X, headerY - 5, contentWidth, 6, 'F');
      pdf.text('Dispositivo', col1X + 2, headerY);
      pdf.text('Consumo (kWh)', col2X, headerY);
      pdf.text('% Total', col3X, headerY);
      pdf.text('Estado', col4X, headerY);

      yPosition += 7;
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('Helvetica', 'normal');

      // Filas de tabla
      currentReportData.devices.forEach((device, idx) => {
        const percentage = ((device.consumption / currentReportData.totalConsumption) * 100).toFixed(1);
        
        // Fondo alternado
        if (idx % 2 === 0) {
          pdf.setFillColor(240, 240, 240);
          pdf.rect(col1X, yPosition - 5, contentWidth, 6, 'F');
        }

        // Limitar texto de dispositivo si es muy largo
        const deviceName = device.name.length > 35 ? device.name.substring(0, 32) + '...' : device.name;
        
        pdf.text(deviceName, col1X + 1, yPosition);
        pdf.text(device.consumption.toLocaleString(), col2X, yPosition);
        pdf.text(`${percentage}%`, col3X, yPosition);
        pdf.text(device.status, col4X, yPosition);
        yPosition += 6;

        // Agregar nueva página si es necesario
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 15;
        }
      });

      // Tabla de Patrón de Consumo
      yPosition += 8;
      if (yPosition > 240) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`PATRÓN DE CONSUMO ${reportType === 'annual' ? 'MENSUAL' : 'HORARIO'}`, margin, yPosition);
      yPosition += 8;

      // Encabezados
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setFillColor(50, 50, 100);
      pdf.setTextColor(255, 255, 255);
      
      const headerY2 = yPosition;
      pdf.rect(margin, headerY2 - 5, contentWidth, 6, 'F');
      pdf.text('Período', margin + 2, headerY2);
      pdf.text('Consumo (kW)', margin + 70, headerY2);

      yPosition += 7;
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('Helvetica', 'normal');

      // Filas de patrón
      const maxConsumption = Math.max(...currentReportData.hourlyData.map(d => d.consumption));
      currentReportData.hourlyData.forEach((data, idx) => {
        // Fondo alternado
        if (idx % 2 === 0) {
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, yPosition - 5, contentWidth, 6, 'F');
        }

        const percentage = ((data.consumption / maxConsumption) * 100).toFixed(0);
        const barLength = (percentage as any) * 0.8; // Escalar para que quepa

        pdf.text(data.hour, margin + 2, yPosition);
        pdf.text(data.consumption.toLocaleString(), margin + 70, yPosition);

        // Dibuja barra de progreso
        pdf.setDrawColor(200, 200, 200);
        pdf.rect(margin + 100, yPosition - 4, 40, 4);
        pdf.setFillColor(220, 184, 80);
        pdf.rect(margin + 100, yPosition - 4, (barLength as number) / 2.5, 4, 'F');

        yPosition += 6;

        // Agregar nueva página si es necesario
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 15;
        }
      });

      // Recomendaciones finales
      yPosition += 8;
      if (yPosition > 240) {
        pdf.addPage();
        yPosition = 15;
      }

      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('RECOMENDACIONES DE SPARKCHECK', margin, yPosition);
      yPosition += 8;

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);

      const recommendations = reportType === "annual" ? [
        "Comparar tendencias anuales: pico en julio y agosto, oportunidad de optimización en diciembre",
        "Implementar sistemas de control automatizado para mantener consumo en niveles bajos en meses de baja ocupación",
        "Considerar energías renovables - potencial de ahorro anual del 20-25% con instalación de paneles solares",
        "Revisar factores de potencia mensualmente para optimizar costo de facturación reactiva"
      ] : [
        "Considerar ajustar horarios de equipos HVAC para evitar picos de 14:00-18:00",
        "Oportunidad de ahorro del 15% optimizando iluminación en horarios de baja ocupación",
        "Evaluar eficiencia de servidores - consumo 12% sobre promedio esperado"
      ];

      recommendations.forEach((rec, idx) => {
        const lines = pdf.splitTextToSize(`${idx + 1}. ${rec}`, contentWidth - 4);
        lines.forEach(line => {
          pdf.text(line, margin + 2, yPosition);
          yPosition += 5;
          
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 15;
          }
        });
        yPosition += 2;
      });

      // Footer
      yPosition = pdf.internal.pageSize.getHeight() - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('SparkCheck Energy Management System | Reporte generado automáticamente', pageWidth / 2, yPosition, { align: 'center' });

      // Descargar
      const fileName = reportType === "monthly" 
        ? `reporte-mensual-${new Date().toISOString().split('T')[0]}.pdf`
        : `reporte-anual-${new Date().getFullYear()}.pdf`;
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
    } finally {
      setIsGenerating(false);
      setShowPreview(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Reportes</h1>
        <p className="text-muted-foreground">Genera y exporta reportes detallados de consumo energético</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="border-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <Zap className="w-5 h-5" />
              Consumo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-900">{reportData.totalConsumption.toLocaleString()} kWh</p>
            <p className="text-sm text-yellow-700 mt-1">{reportData.period}</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="w-5 h-5" />
              Demanda Pico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">{reportData.peakDemand.toLocaleString()} kW</p>
            <p className="text-sm text-blue-700 mt-1">Máximo registrado</p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <DollarSign className="w-5 h-5" />
              Costo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-900">${reportData.totalCost.toLocaleString()}</p>
            <p className="text-sm text-green-700 mt-1">USD este período</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generar Reporte
          </CardTitle>
          <CardDescription>Crea reportes personalizados con todas las estadísticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 rounded-lg space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Reporte Mensual</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Incluye análisis detallado de consumo, costos, patrones horarios y recomendaciones
              </p>
              <Button 
                onClick={() => handleGenerateReport("monthly")} 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Previsualizar y Descargar
              </Button>
            </div>

            <div className="p-4 border-2 rounded-lg space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Reporte Anual</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Análisis comparativo anual con tendencias y proyecciones
              </p>
              <Button 
                onClick={() => handleGenerateReport("annual")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Previsualizar y Descargar
              </Button>
            </div>
          </div>

          <Separator />

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Información del Reporte</p>
                <p>El reporte incluirá todos los datos del período seleccionado, gráficas de consumo, análisis de dispositivos y recomendaciones de optimización.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Previsualización del Reporte {reportType === "annual" ? "Anual" : "Mensual"}
            </DialogTitle>
            <DialogDescription>
              Revisa los datos antes de descargar el PDF
            </DialogDescription>
          </DialogHeader>

          <div ref={previewContentRef} className="space-y-6 py-4 bg-white p-8">
            {/* Header Info */}
            <div className="text-center pb-4 border-b">
              <h2 className="text-2xl font-bold mb-2">Reporte de Consumo Energético {reportType === "annual" ? "Anual" : "Mensual"}</h2>
              <p className="text-muted-foreground text-lg font-semibold">{currentReportData.period}</p>
              <p className="text-sm text-muted-foreground mt-1">Generado: {currentReportData.generatedDate}</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm font-medium text-yellow-900">Consumo Total</p>
                </div>
                <p className="text-2xl font-bold text-yellow-900">{currentReportData.totalConsumption.toLocaleString()}</p>
                <p className="text-xs text-yellow-700">kWh</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-900">Promedio</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">{currentReportData.averageConsumption.toLocaleString()}</p>
                <p className="text-xs text-blue-700">{reportType === "annual" ? "kWh/mes" : "kWh/día"}</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <p className="text-sm font-medium text-red-900">Pico</p>
                </div>
                <p className="text-2xl font-bold text-red-900">{currentReportData.peakDemand.toLocaleString()}</p>
                <p className="text-xs text-red-700">kW</p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Costo Total</p>
                </div>
                <p className="text-2xl font-bold text-green-900">${currentReportData.totalCost.toLocaleString()}</p>
                <p className="text-xs text-green-700">USD</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-purple-900">Dispositivos</p>
                </div>
                <p className="text-2xl font-bold text-purple-900">{currentReportData.activeDevices}</p>
                <p className="text-xs text-purple-700">Activos</p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <p className="text-sm font-medium text-orange-900">Alertas</p>
                </div>
                <p className="text-2xl font-bold text-orange-900">{currentReportData.alerts}</p>
                <p className="text-xs text-orange-700">{reportType === "annual" ? "Este año" : "Este período"}</p>
              </div>
            </div>

            {/* Devices Table */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                Consumo por Dispositivo
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Dispositivo</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Consumo (kWh)</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">% del Total</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentReportData.devices.map((device, index) => {
                      const percentage = ((device.consumption / currentReportData.totalConsumption) * 100).toFixed(1);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium">{device.name}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium">{device.consumption.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-right">{percentage}%</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {device.status}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consumption Pattern */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-blue-600" />
                Patrón de Consumo {reportType === "annual" ? "Mensual" : "Horario"}
              </h3>
              <div className="space-y-3">
                {currentReportData.hourlyData.map((data, index) => {
                  const maxValue = Math.max(...currentReportData.hourlyData.map(d => d.consumption));
                  const percentage = (data.consumption / maxValue) * 100;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-24 text-right">{data.hour}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs font-bold text-white">{data.consumption.toLocaleString()} kW</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-900 text-lg">
                <CheckCircle2 className="w-5 h-5" />
                Recomendaciones de SparkCheck
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                {reportType === "annual" ? (
                  <>
                    <li>• Comparar tendencias anuales: pico en julio y agosto, oportunidad de optimización en diciembre</li>
                    <li>• Implementar sistemas de control automatizado para mantener consumo en niveles bajos en meses de baja ocupación</li>
                    <li>• Considerar energías renovables - potencial de ahorro anual del 20-25% con instalación de paneles solares</li>
                    <li>• Revisar factores de potencia mensualmente para optimizar costo de facturación reactiva</li>
                  </>
                ) : (
                  <>
                    <li>• Considerar ajustar horarios de equipos HVAC para evitar picos de 14:00-18:00</li>
                    <li>• Oportunidad de ahorro del 15% optimizando iluminación en horarios de baja ocupación</li>
                    <li>• Evaluar eficiencia de servidores - consumo 12% sobre promedio esperado</li>
                  </>
                )}
              </ul>
            </div>

            {/* Report Footer */}
            <div className="border-t pt-4 text-xs text-muted-foreground text-center">
              <p>Este reporte fue generado automáticamente por SparkCheck Energy Management System</p>
              <p>Para soporte, contacte a su administrador de energía</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <FileDown className="w-4 h-4 mr-2 animate-bounce" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}