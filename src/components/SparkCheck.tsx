import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Lightbulb,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Brain,
  FileCheck,
  AlertCircle,
  Send,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

interface UploadedFile {
  name: string;
  size: number;
}

export function SparkCheck() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState("");
  const [aiResponses, setAiResponses] = useState<
    { prompt: string; response: string }[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    // Guardamos el objeto File completo, no solo el nombre
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);

    // 1. Creamos el FormData para el envío de datos mixtos (texto y archivos)
    const formData = new FormData();
    formData.append("prompt", prompt);

    // 2. Adjuntamos los archivos reales.
    // IMPORTANTE: Asegúrate de que 'uploadedFiles' contenga objetos de tipo 'File'
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "http://localhost:8000/api/spark-check-ai/",
        {
          method: "POST",
          // No definas 'Content-Type': el navegador lo pondrá automáticamente
          // con el 'boundary' necesario para multipart/form-data.
          body: formData,
        },
      );

      // 3. Verificamos si la respuesta es JSON antes de procesar
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const errorDetail = await response.text();
        console.error("Error técnico del servidor:", errorDetail);
        // Aquí podrías mostrar una notificación de error al usuario
        return;
      }

      const data = await response.json();

      // 4. Actualizamos el historial de respuestas
      setAiResponses((prev) => [
        ...prev,
        {
          prompt: prompt,
          response: data.response, // 'response' es lo que devuelve tu SparkCheckAIView en Django
        },
      ]);

      // 5. Limpieza de interfaz tras éxito
      setPrompt("");
      setUploadedFiles([]); // IMPORTANTE: Limpia los archivos para la siguiente consulta
    } catch (error) {
      console.error("Error de conexión o de red:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl mb-1 flex items-center gap-2">
            SparkCheck
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Brain className="w-3 h-3 mr-1" />
              IA
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Asistente de Inteligencia Artificial para Análisis Energético
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Area - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Consulta a SparkCheck IA
              </CardTitle>
              <CardDescription>
                Pregunte sobre análisis de fugas, picos de voltaje, optimización
                energética y más
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ejemplo: 'Analiza las fugas de energía en el sistema principal' o 'Identifica los picos de voltaje en las últimas 24 horas'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {uploadedFiles.length > 0 &&
                    `${uploadedFiles.length} archivo(s) adjunto(s)`}
                </p>
                <Button
                  onClick={handleSendPrompt}
                  disabled={!prompt.trim() || isAnalyzing}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Analizar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Responses */}
          {aiResponses.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Análisis Completados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiResponses.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Tu consulta:
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        {item.prompt}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Respuesta de SparkCheck IA:
                      </p>
                      <div className="text-sm text-blue-800 whitespace-pre-line">
                        {item.response}
                      </div>
                    </div>
                    {index < aiResponses.length - 1 && (
                      <div className="border-t my-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Suggestions */}
          <Card className="border-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <TrendingUp className="w-5 h-5" />
                Consultas Sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 bg-white hover:bg-yellow-50"
                onClick={() =>
                  setPrompt(
                    "Analiza las fugas de energía en el sistema principal",
                  )
                }
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 flex-shrink-0" />
                <span className="text-sm">
                  Analiza las fugas de energía en el sistema principal
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 bg-white hover:bg-yellow-50"
                onClick={() =>
                  setPrompt(
                    "Identifica picos de voltaje en las últimas 24 horas",
                  )
                }
              >
                <Zap className="w-4 h-4 mr-2 text-yellow-600 flex-shrink-0" />
                <span className="text-sm">
                  Identifica picos de voltaje en las últimas 24 horas
                </span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 bg-white hover:bg-yellow-50"
                onClick={() =>
                  setPrompt(
                    "Proporciona recomendaciones para optimizar el consumo energético",
                  )
                }
              >
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                <span className="text-sm">
                  Proporciona recomendaciones para optimizar el consumo
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Compact File Upload */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4" />
                Archivos Adjuntos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium mb-1">
                  Arrastra archivos aquí
                </p>
                <p className="text-xs text-muted-foreground">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PDF (MAX. 10MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Archivos subidos:
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                    >
                      <FileText className="w-3 h-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs flex-1 truncate">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card className="border-2 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 text-sm">
                <Zap className="w-4 h-4" />
                Capacidades de SparkCheck
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900">
                    Detección de Fugas
                  </p>
                  <p className="text-xs text-blue-700">
                    Identifica pérdidas energéticas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900">
                    Análisis de Picos
                  </p>
                  <p className="text-xs text-blue-700">
                    Monitorea variaciones de voltaje
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900">
                    Optimización
                  </p>
                  <p className="text-xs text-blue-700">
                    Recomendaciones personalizadas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900">
                    Análisis Predictivo
                  </p>
                  <p className="text-xs text-blue-700">
                    Anticipa problemas futuros
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900 text-sm">
                <AlertCircle className="w-4 h-4" />
                Consejos de Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs text-yellow-800">
              <p>• Sé específico en tus consultas</p>
              <p>• Adjunta reportes para análisis detallados</p>
              <p>• Consulta por periodos específicos</p>
              <p>• Solicita recomendaciones concretas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
