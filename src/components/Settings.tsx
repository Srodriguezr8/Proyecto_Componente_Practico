import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Activity, 
  Zap,
  Eye,
  EyeOff,
  Edit2,
  Check,
  X
} from "lucide-react";
import { Separator } from "./ui/separator";

export function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Liam Gallagher",
    email: "liam.gallagher@controlems.com",
    password: "••••••••",
    userType: "Administrador del Sistema",
    activeDevices: 12,
    standbyDevices: 8,
    totalDevices: 20
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardaría la información
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí se revertiría los cambios
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Ajustes y Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil de Usuario
              </CardTitle>
              <CardDescription>Información principal de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-3xl">LG</span>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    <Shield className="w-3 h-3 mr-1" />
                    {userData.userType}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Device Stats */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Estado de Dispositivos
                </h4>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Activos</span>
                    </div>
                    <span className="font-semibold text-green-700">{userData.activeDevices}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">En Espera</span>
                    </div>
                    <span className="font-semibold text-gray-700">{userData.standbyDevices}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Total</span>
                    </div>
                    <span className="font-semibold text-blue-700">{userData.totalDevices}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI Assistant Info */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-blue-900">SparkCheck</span>
                </div>
                <p className="text-sm text-blue-700">
                  Tu asistente de inteligencia artificial para análisis energético
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings */}
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Información de la Cuenta
                  </CardTitle>
                  <CardDescription>Actualiza tus datos personales y de acceso</CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  disabled={!isEditing}
                  className="disabled:opacity-60"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  disabled={!isEditing}
                  className="disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    disabled={!isEditing}
                    className="disabled:opacity-60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Deja el campo vacío si no deseas cambiar la contraseña
                  </p>
                )}
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Tipo de Usuario
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="userType"
                    value={userData.userType}
                    disabled
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="px-3 py-1">
                    No Editable
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Solo un super administrador puede cambiar el tipo de usuario
                </p>
              </div>

              {isEditing && (
                <div className="pt-4 border-t">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Importante</p>
                        <p>Los cambios en tu información personal serán efectivos inmediatamente después de guardar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
