import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Users, 
  Zap, 
  Target, 
  Award, 
  Mail, 
  Lightbulb,
  LineChart,
  Shield
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

export function About() {
  const teamMembers = [
    {
      name: "Cristian Xavier Montoya Patin",
      role: "Director General (CEO)",
      specialty: "Gestión Estratégica y Sistemas de Control"
    },
    {
      name: "Nayeli Gabriela Figueroa Ramirez",
      role: "Subdirectora General (COO)",
      specialty: "Coordinación de Operaciones y Análisis de Datos"
    },
    {
      name: "Santiago Sebastian Rodriguez Romero",
      role: "Director de Ingeniería de Hardware",
      specialty: "Infraestructura y Monitoreo en Tiempo Real"
    },
    {
      name: "Santiago Enrique Romero Quinteros",
      role: "Director de Tecnología (CTO)",
      specialty: "Arquitectura de Software e Inteligencia Artificial"
    }
  ];

  const features = [
    {
      icon: LineChart,
      title: "Monitoreo en Tiempo Real",
      description: "Sistema avanzado de monitoreo que proporciona datos actualizados de consumo energético cada segundo."
    },
    {
      icon: Lightbulb,
      title: "Inteligencia Artificial",
      description: "SparkCheck AI analiza patrones de consumo y proporciona recomendaciones personalizadas para optimización."
    },
    {
      icon: Shield,
      title: "Gestión Proactiva",
      description: "Detección temprana de anomalías y alertas predictivas para prevenir fallas en el sistema."
    },
    {
      icon: Award,
      title: "Reportes Detallados",
      description: "Generación de reportes completos con análisis de tendencias, costos y oportunidades de ahorro."
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
            <Zap className="w-12 h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Sistema de Gestión de Emergencias</h1>
          <p className="text-xl text-muted-foreground">Control EMS - Energy Management System</p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Target className="w-6 h-6" />
              Nuestra Misión
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p>
              Proporcionar una solución integral de gestión energética que permita a las organizaciones 
              monitorear, analizar y optimizar su consumo de energía eléctrica de manera eficiente, 
              contribuyendo a la sostenibilidad ambiental y la reducción de costos operativos.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <Lightbulb className="w-6 h-6" />
              Nuestra Visión
            </CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-800">
            <p>
              Ser la plataforma líder en gestión energética inteligente, integrando tecnologías de 
              vanguardia como inteligencia artificial y análisis predictivo para revolucionar la forma 
              en que las empresas gestionan su energía y reducen su huella de carbono.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* About the System */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            Acerca del Sistema EMS
          </CardTitle>
          <CardDescription>Sistema de Gestión de Energía de Última Generación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Control EMS es un sistema avanzado de gestión energética diseñado para proporcionar 
            visibilidad completa y control sobre el consumo de energía en instalaciones industriales, 
            comerciales y residenciales. Utilizando tecnología de punta en monitoreo en tiempo real, 
            análisis de datos e inteligencia artificial, nuestro sistema ayuda a identificar 
            oportunidades de ahorro, prevenir fallas y optimizar el uso de energía.
          </p>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Nuestro Equipo de Ingenieros
          </CardTitle>
          <CardDescription>
            Equipo multidisciplinario comprometido con la excelencia en gestión energética
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <Badge className="bg-blue-100 text-blue-700 mb-2">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Especialidad: {member.specialty}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Info */}
      <Card className="border-2 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Mail className="w-6 h-6" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800 space-y-2">
          <p className="font-medium">Control EMS - Sistema de Gestión Energética</p>
          <p className="text-sm">Versión 1.0.0 • Enero 2026</p>
          <p className="text-sm">© 2026 Control EMS. Desarrollado por un equipo de ingenieros especializados.</p>
          <div className="mt-4 pt-4 border-t border-yellow-200">
            <p className="text-xs text-yellow-700">
              Este sistema ha sido desarrollado como parte de un proyecto de investigación y desarrollo 
              en gestión energética inteligente, aplicando las mejores prácticas de la industria y 
              tecnologías emergentes en el campo de la eficiencia energética.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
