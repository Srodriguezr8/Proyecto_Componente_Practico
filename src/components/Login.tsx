import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { AlertCircle, Zap } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);

  // Mock user data
  const mockUser = {
    username: "admin",
    password: "password123"
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username === mockUser.username && password === mockUser.password) {
      onLoginSuccess();
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  if (showRecovery) {
    return <PasswordRecovery onBack={() => setShowRecovery(false)} onSuccess={onLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <div className="p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-4 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-gray-900">Sistema EMS</h1>
            <p className="text-gray-600">Gestión de Emergencias</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white shadow-lg"
            >
              Iniciar Sesión
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Demo:</strong> usuario: admin | contraseña: password123
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface PasswordRecoveryProps {
  onBack: () => void;
  onSuccess: () => void;
}

function PasswordRecovery({ onBack, onSuccess }: PasswordRecoveryProps) {
  const [recoveryMethod, setRecoveryMethod] = useState<"sms" | "whatsapp" | "quiz" | null>(null);
  const [step, setStep] = useState<"method" | "verify">("method");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock data
  // Nota: en modo demo se acepta cualquier número válido (solo dígitos y opcionalmente un '+' al inicio)
  const mockCode = "123456";
  const phoneRegex = /^\+?[0-9]{6,15}$/;
  const mockQuizQuestions = [
    { question: "¿Cuál es el nombre de tu primera mascota?", answer: "max" },
    { question: "¿En qué ciudad naciste?", answer: "monterrey" },
    { question: "¿Cuál es tu color favorito?", answer: "azul" }
  ];

  const handleMethodSelect = (method: "sms" | "whatsapp" | "quiz") => {
    setRecoveryMethod(method);
    setError("");
    setSuccess("");

    // When a method is chosen, immediately show the data entry (phone input or quiz)
    if (method === "quiz") {
      setStep("verify");
    } else {
      setStep("method");
    }
  };

  const handleSendCode = () => {
    setError("");
    setSuccess("");

    if (!phoneNumber) {
      setError("Por favor ingrese su número de teléfono");
      return;
    }

    const sanitized = phoneNumber.replace(/\s+/g, '');
    if (!phoneRegex.test(sanitized)) {
      setError("El número de teléfono no es válido. Use solo dígitos y opcionalmente un '+' al inicio");
      return;
    }

    const methodLabel = recoveryMethod === 'sms' ? 'SMS' : 'WhatsApp';
    setSuccess(`Código enviado vía ${methodLabel} a ${sanitized}`);
    // En modo demo el código es siempre el mismo (visible en pantalla)
    setStep('verify');
  };

  const handleVerifyCode = () => {
    setError("");
    setSuccess("");

    if (!code) {
      setError('Ingrese el código de verificación');
      return;
    }

    if (code === mockCode) {
      setSuccess("¡Contraseña recuperada exitosamente!");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError("Código incorrecto. Intente nuevamente.");
    }
  };

  const handleVerifyQuiz = () => {
    const allCorrect = mockQuizQuestions.every((q, i) => 
      quizAnswers[i].toLowerCase().trim() === q.answer
    );

    if (allCorrect) {
      setSuccess("¡Respuestas correctas! Contraseña recuperada exitosamente.");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError("Una o más respuestas son incorrectas. Intente nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <div className="p-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              ← Volver al inicio
            </Button>
            <h2 className="text-2xl text-gray-900">Recuperar Contraseña</h2>
            {/* Show helper text only when no method picked */}
            {!recoveryMethod && (
              <p className="text-gray-600 mt-2">Seleccione un método de recuperación</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">{success}</AlertDescription>
            </Alert>
          )}

          {step === "method" && !recoveryMethod && (
            <div className="space-y-3">
              <Button
                onClick={() => handleMethodSelect("sms")}
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📱</span>
                    <span>Mensaje SMS</span>
                  </div>
                  <p className="text-xs text-gray-500">Recibir código por mensaje de texto</p>
                </div>
              </Button>

              <Button
                onClick={() => handleMethodSelect("whatsapp")}
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">💬</span>
                    <span>WhatsApp</span>
                  </div>
                  <p className="text-xs text-gray-500">Recibir código por WhatsApp</p>
                </div>
              </Button>

              <Button
                onClick={() => handleMethodSelect("quiz")}
                variant="outline"
                className="w-full justify-start h-auto py-4 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">❓</span>
                    <span>Preguntas de Seguridad</span>
                  </div>
                  <p className="text-xs text-gray-500">Responder preguntas de seguridad</p>
                </div>
              </Button>
            </div>
          )}

          {step === "method" && (recoveryMethod === "sms" || recoveryMethod === "whatsapp") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Número de Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+52 1234567890"
                  className="border-gray-300 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Ingrese el número registrado en su cuenta
                </p>
              </div>
              <Button
                onClick={handleSendCode}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
              >
                Enviar Código
              </Button>
            </div>
          )}

          {step === "verify" && (recoveryMethod === "sms" || recoveryMethod === "whatsapp") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-700">
                  Código de Verificación
                </Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="border-gray-300 focus:border-blue-500 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-gray-500">
                  Ingrese el código de 6 caracteres (alfanumérico permitido) recibido
                </p>
              </div>
              <Button
                onClick={handleVerifyCode}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
              >
                Verificar Código
              </Button>
              <Button
                onClick={() => setStep("method")}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Cambiar método
              </Button>
            </div>
          )}

          {step === "verify" && recoveryMethod === "quiz" && (
            <div className="space-y-4">
              {mockQuizQuestions.map((q, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`quiz-${index}`} className="text-gray-700">
                    {q.question}
                  </Label>
                  <Input
                    id={`quiz-${index}`}
                    type="text"
                    value={quizAnswers[index]}
                    onChange={(e) => {
                      const newAnswers = [...quizAnswers];
                      newAnswers[index] = e.target.value;
                      setQuizAnswers(newAnswers);
                    }}
                    placeholder="Su respuesta"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
              ))}
              <Button
                onClick={handleVerifyQuiz}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
              >
                Verificar Respuestas
              </Button>
              <Button
                onClick={() => {
                  setRecoveryMethod(null);
                  setStep("method");
                }}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Cambiar método
              </Button>
              
              {/* Demo hint for quiz */}
              <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Respuestas demo:</strong> max, monterrey, azul
                </p>
              </div>
            </div>
          )}

          {/* Demo code box (visible in recovery flows) */}
          {(recoveryMethod === 'sms' || recoveryMethod === 'whatsapp' || recoveryMethod === null) && (
            <div className="mt-6 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Código demo:</strong> {mockCode} — úsalo para probar la verificación
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
