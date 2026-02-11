import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { 
  Settings, 
  DollarSign, 
  Globe, 
  Bell, 
  Zap,
  Monitor,
  Wifi,
  Database,
  Save,
  ChevronDown
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";

export function Configuration() {
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("es");
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock devices data organized by status
  const devicesByStatus = {
    active: [
      { id: "dev-001", name: "Panel de Energía Principal A", location: "Edificio A - Piso 1", power: "2.4 kW" },
      { id: "dev-002", name: "Unidad de Control HVAC", location: "Edificio A - Piso 2", power: "4.5 kW" },
      { id: "dev-003", name: "Línea de Manufactura 1", location: "Piso de Producción", power: "8.2 kW" },
      { id: "dev-004", name: "Circuito de Iluminación B", location: "Edificio B - Todos los Pisos", power: "1.2 kW" },
      { id: "dev-005", name: "UPS Sala de Servidores", location: "Centro de Datos", power: "3.8 kW" },
      { id: "dev-006", name: "Sistema de Seguridad", location: "Perímetro", power: "0.8 kW" },
      { id: "dev-007", name: "Bomba de Agua Principal", location: "Planta Baja", power: "5.5 kW" },
      { id: "dev-008", name: "Elevadores Torre A", location: "Edificio A", power: "12.3 kW" },
      { id: "dev-009", name: "Compresores Industriales", location: "Zona Industrial", power: "15.7 kW" },
      { id: "dev-010", name: "Sistema de Ventilación", location: "Edificio B", power: "2.9 kW" },
      { id: "dev-011", name: "Equipo de Climatización", location: "Sala de Juntas", power: "1.6 kW" },
      { id: "dev-012", name: "Generador de Respaldo", location: "Área de Servicios", power: "25.0 kW" },
    ],
    standby: [
      { id: "dev-013", name: "Panel Auxiliar C", location: "Edificio C - Piso 3", power: "0 kW" },
      { id: "dev-014", name: "Sistema HVAC Secundario", location: "Edificio B - Piso 4", power: "0 kW" },
      { id: "dev-015", name: "Iluminación de Emergencia", location: "Todos los Edificios", power: "0 kW" },
      { id: "dev-016", name: "Bomba Auxiliar", location: "Sótano", power: "0 kW" },
      { id: "dev-017", name: "Transformador Backup", location: "Subestación", power: "0 kW" },
      { id: "dev-018", name: "Equipo de Reserva HVAC", location: "Torre B", power: "0 kW" },
      { id: "dev-019", name: "Panel Solar (Nocturno)", location: "Azotea", power: "0 kW" },
      { id: "dev-020", name: "Sistema de Riego", location: "Jardines", power: "0 kW" },
    ]
  };

  const handleSave = () => {
    // Guardar configuración
    console.log("Configuración guardada");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Configuración</h1>
        <p className="text-muted-foreground">Configuración del sistema y gestión de dispositivos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency & Regional Settings */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Configuración Regional
            </CardTitle>
            <CardDescription>Moneda, idioma y preferencias regionales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                Tipo de Moneda
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">USD</span>
                      <span className="text-muted-foreground">- Dólar Estadounidense ($)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EUR">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">EUR</span>
                      <span className="text-muted-foreground">- Euro (€)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MXN">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">MXN</span>
                      <span className="text-muted-foreground">- Peso Mexicano ($)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COP">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">COP</span>
                      <span className="text-muted-foreground">- Peso Colombiano ($)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ARS">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">ARS</span>
                      <span className="text-muted-foreground">- Peso Argentino ($)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="BRL">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">BRL</span>
                      <span className="text-muted-foreground">- Real Brasileño (R$)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="GBP">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">GBP</span>
                      <span className="text-muted-foreground">- Libra Esterlina (£)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Esta moneda se utilizará para mostrar costos y reportes financieros
              </p>
            </div>

            <Separator />

            {/* Language */}
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Idioma del Sistema
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferencias del Sistema
            </CardTitle>
            <CardDescription>Configuración de notificaciones y visualización</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-600" />
                  Notificaciones
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recibir alertas de energía y sistema
                </p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Separator />

            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-600" />
                  Actualización Automática
                </Label>
                <p className="text-xs text-muted-foreground">
                  Actualizar datos en tiempo real
                </p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>

            <Separator />

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  Modo Oscuro
                </Label>
                <p className="text-xs text-muted-foreground">
                  Activar tema oscuro (próximamente)
                </p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card className="border-2 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Gestión de Dispositivos
            </CardTitle>
            <CardDescription>Configuración y control de dispositivos conectados organizados por estado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">{devicesByStatus.active.length}</p>
                    <p className="text-sm text-green-600">Dispositivos Activos</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-700">{devicesByStatus.standby.length}</p>
                    <p className="text-sm text-gray-600">En Espera</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{devicesByStatus.active.length + devicesByStatus.standby.length}</p>
                    <p className="text-sm text-blue-600">Total Registrados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion for Devices */}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="active" className="border-2 border-green-200 rounded-lg mb-4 px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-green-900">Dispositivos Activos</p>
                      <p className="text-sm text-green-700">{devicesByStatus.active.length} dispositivos en funcionamiento</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {devicesByStatus.active.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            {device.power}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            Activo
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="standby" className="border-2 border-gray-200 rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Dispositivos en Espera</p>
                      <p className="text-sm text-gray-700">{devicesByStatus.standby.length} dispositivos en modo standby</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {devicesByStatus.standby.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{device.name}</p>
                            <p className="text-xs text-muted-foreground">{device.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                            {device.power}
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                            Espera
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700">
          <Save className="w-5 h-5 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}