import { useState, useEffect } from "react";
import { cn } from "./ui/utils";
import { 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  FileText, 
  User,
  Zap,
  X,
  LogOut,
  Lightbulb,
  Info,
  Activity,
  UploadCloud,
  ChevronDown
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onPageChange, onLogout }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openAnalysis, setOpenAnalysis] = useState(false);

  useEffect(() => {
    // If the current page is a child of Analysis, ensure submenu is open
    if (currentPage.startsWith("analysis-")) {
      setOpenAnalysis(true);
      setIsExpanded(true);
    }
  }, [currentPage]);

  const handleNavigationClick = (pageId: string) => {
    // If clicking the analysis parent, toggle submenu instead of navigating
    if (pageId === "analysis") {
      if (!isExpanded) {
        setIsExpanded(true);
        setTimeout(() => setOpenAnalysis(true), 150);
      } else {
        setOpenAnalysis((s) => !s);
      }
      return;
    }

    // Close analysis submenu when navigating elsewhere
    setOpenAnalysis(false);

    if (!isExpanded) {
      setIsExpanded(true);
      // Delay the page change to allow expansion animation
      setTimeout(() => onPageChange(pageId), 150);
    } else {
      onPageChange(pageId);
    }
  };

  const navigationItems = [
    {
      id: "about",
      name: "¿Quiénes Somos?",
      icon: Info,
      description: "Información del sistema"
    },
    {
      id: "dashboard",
      name: "Tablero",
      icon: LayoutDashboard,
      description: "Vista general y monitoreo"
    },
    {
      id: "analysis",
      name: "Análisis",
      icon: BarChart3,
      description: "Análisis",
      children: [
        {
          id: "analysis-realtime",
          name: "Análisis en Tiempo Real",
          icon: Activity,
          description: "Monitoreo en tiempo real"
        },
        {
          id: "analysis-imported",
          name: "Análisis Importado",
          icon: UploadCloud,
          description: "Análisis de datos importados"
        }
      ]
    },
    {
      id: "configuration",
      name: "Configuración",
      icon: Settings,
      description: "Ajustes del sistema"
    },
    {
      id: "reports",
      name: "Reportes",
      icon: FileText,
      description: "Generar reportes"
    },
    {
      id: "sparkcheck",
      name: "SparkCheck",
      icon: Lightbulb,
      description: "Asistente IA"
    },
    {
      id: "settings",
      name: "Ajustes y Perfil",
      icon: User,
      description: "Preferencias de usuario"
    }
  ];

  return (
    <div className="ml-6 my-6">
      <div 
        className={cn(
          "flex flex-col min-h-[calc(100vh-3rem)] transition-all duration-300 ease-in-out rounded-3xl",
          "bg-gradient-to-b from-sidebar via-sidebar to-sidebar-accent shadow-2xl border border-sidebar-border/20 overflow-visible",
          isExpanded ? "w-72" : "w-20"
        )}
      >
        {/* Header with Logo */}
        <div className="p-3 flex flex-col items-center relative">
          {/* Close button when expanded */}
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-2 right-2 w-6 h-6 bg-sidebar-accent/50 hover:bg-sidebar-accent rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <X className="w-3 h-3 text-sidebar-foreground" />
            </button>
          )}
          
          <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {isExpanded && (
            <div className="mt-1.5 text-center">
              <h2 className="text-sidebar-foreground font-semibold text-sm whitespace-nowrap">
                Control EMS
              </h2>
              <p className="text-sidebar-foreground/70 text-xs whitespace-nowrap mt-0.5">
                Gestión de Energía
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-visible">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (item.children && item.children.some((c:any) => c.id === currentPage));
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => handleNavigationClick(item.id)}
                    className={cn(
                      "transition-all duration-300 flex items-center relative overflow-hidden",
                      "hover:scale-110 hover:shadow-lg",
                      isExpanded 
                        ? "w-full px-4 py-3 justify-start rounded-xl" 
                        : "w-12 h-12 justify-center mx-auto rounded-full",
                      isActive
                        ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/30 scale-105"
                        : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
                    )}
                  >
                    <Icon className={cn(
                      "transition-colors duration-300 flex-shrink-0",
                      "w-5 h-5",
                      isActive 
                        ? "text-sidebar-primary-foreground" 
                        : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                    )} />
                    
                    {isExpanded && (
                      <div className="ml-3 overflow-hidden flex items-center justify-between w-full">
                        <div>
                          <div className={cn(
                            "font-medium text-sm whitespace-nowrap transition-colors duration-300",
                            isActive 
                              ? "text-sidebar-primary-foreground" 
                              : "text-sidebar-accent-foreground group-hover:text-sidebar-primary-foreground"
                          )}>
                            {item.name}
                          </div>
                          {isActive && (
                            <div className="text-xs text-sidebar-primary-foreground/70 mt-0.5 whitespace-nowrap">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {/* Chevron for parent with children */}
                        {item.children && (
                          <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            openAnalysis ? "rotate-180" : "rotate-0",
                            isActive ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground"
                          )} />
                        )}
                      </div>
                    )}
                    
                    {/* Active indicator */}
                    {isActive && !isExpanded && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-sidebar-primary opacity-20 animate-pulse" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary rounded-l-full" />
                      </>
                    )}
                    
                    {/* Active indicator for expanded state */}
                    {isActive && isExpanded && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-sidebar-primary-foreground rounded-full animate-pulse" />
                    )}
                  </button>

                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs opacity-75 mt-1">{item.description}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
                    </div>
                  )}

                  {/* Children for Analysis */}
                  {isExpanded && item.children && openAnalysis && (
                    <div className="mt-2 space-y-2 px-2">
                      {item.children.map((child: any) => {
                        const ChildIcon = child.icon;
                        const childActive = currentPage === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => onPageChange(child.id)}
                            className={cn(
                              "flex items-center w-full px-3 py-2 rounded-xl transition-all duration-200",
                              childActive
                                ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-md"
                                : "bg-gradient-to-br from-sidebar-accent to-sidebar-accent/80 hover:from-sidebar-primary/80 hover:to-sidebar-primary/60"
                            )}
                          >
                            <ChildIcon className={cn("w-4 h-4 mr-3", childActive ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground")} />
                            <div className={cn("text-sm font-medium", childActive ? "text-sidebar-primary-foreground" : "text-sidebar-accent-foreground")}>{child.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-3 space-y-2 mt-auto flex-shrink-0">
          {/* User Profile with name and type */}
          {isExpanded && (
            <div className="bg-sidebar-accent/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <div className="text-sidebar-foreground font-medium text-xs whitespace-nowrap">
                Liam Gallagher
              </div>
              <div className="text-sidebar-foreground/70 text-xs whitespace-nowrap">
                Administrador
              </div>
            </div>
          )}

          {/* User Avatar */}
          <div className="relative group flex justify-center">
            <div 
              className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="text-sidebar-primary-foreground font-semibold text-sm">LG</span>
            </div>
            
            {/* Profile tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/90 text-sidebar-primary-foreground rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                <div className="font-medium text-xs">Liam Gallagher</div>
                <div className="text-xs opacity-75 mt-0.5">Administrador</div>
                {/* Tooltip arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-sidebar-primary rotate-45" />
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="relative group">
            <button
              onClick={onLogout}
              className={cn(
                "transition-all duration-300 flex items-center relative overflow-hidden",
                "hover:scale-110 hover:shadow-lg",
                isExpanded 
                  ? "w-full px-3 py-2 justify-start rounded-xl text-sm" 
                  : "w-10 h-10 justify-center mx-auto rounded-full",
                "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              )}
            >
              <LogOut className="w-4 h-4 text-white flex-shrink-0" />
              
              {isExpanded && (
                <span className="ml-2 font-medium text-xs text-white whitespace-nowrap">
                  Cerrar
                </span>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg transform translate-x-2 group-hover:translate-x-0">
                <div className="font-medium text-sm">Cerrar Sesión</div>
                <div className="text-xs opacity-75 mt-1">Salir del sistema</div>
                {/* Tooltip arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-red-500 rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}