import google.generativeai as genai
import pandas as pd
import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ai_models import ElectricPredictor # Asegúrate de que este archivo exista en tu carpeta 'api'

# ==========================================
# CONFIGURACIÓN DE SEGURIDAD
# ==========================================
# RECOMENDACIÓN: Mueve la API Key a un archivo .env
genai.configure(api_key="AIzaSyDjJYu8SvuF9iPL7RuLpJxDchHznP0nsc0")

class HealthView(APIView):
    """Vista simple para verificar el estado de la API."""
    def get(self, request):
        return Response({"status": "ok"})

class UploadView(APIView):
    """Vista para el análisis predictivo basado en CSV/Excel."""
    def post(self, request):
        upload = request.FILES.get('file')
        if not upload:
            return Response({'error': 'No se envió archivo'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Lectura de datos según formato
            df = pd.read_csv(upload) if upload.name.endswith('.csv') else pd.read_excel(upload)
            
            # Instanciar el modelo de predicción local
            ai = ElectricPredictor()
            ai.entrenar(df)
            
            # Obtener resultados
            prediccion = ai.predecir_24h()
            consejos = ai.obtener_consejos(df)

            return Response({
                'filename': upload.name,
                'prediccion_24h': prediccion,
                'recomendaciones': consejos,
                'status': 'Entrenamiento completado'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SparkCheckAIView(APIView):
    """Vista para el Chatbot con IA y análisis de PDFs."""
    def post(self, request):
        user_prompt = request.data.get('prompt')
        # Capturamos los archivos enviados desde el FormData de React
        files = request.FILES.getlist('files') 

        # --- LOGS DE DEPURACIÓN PARA LA CONSOLA ---
        print(f"\n[SparkCheck AI] Nueva consulta recibida")
        print(f"Prompt: {user_prompt}")
        print(f"Archivos adjuntos: {[f.name for f in files]}")

        # 1. Extracción de contenido del PDF
        extracted_text = ""
        for f in files:
            if f.name.endswith('.pdf'):
                try:
                    reader = PyPDF2.PdfReader(f)
                    file_content = ""
                    for page in reader.pages:
                        text = page.extract_text()
                        if text:
                            file_content += text + "\n"
                    
                    if file_content:
                        extracted_text += f"\n--- CONTENIDO DEL ARCHIVO {f.name} ---\n{file_content}\n"
                        print(f"Éxito: Se extrajo texto de {f.name}")
                except Exception as e:
                    print(f"Error procesando {f.name}: {e}")

        # 2. Construcción del Contexto (Inyección de datos del PDF)
        if extracted_text.strip():
            contexto_ia = f"DATOS TÉCNICOS EXTRAÍDOS DE LOS DOCUMENTOS:\n{extracted_text}\n"
        else:
            contexto_ia = "SISTEMA: El usuario no adjuntó documentos o no se pudo extraer texto de ellos.\n"

        # 3. Blindaje de seguridad (System Prompt)
        instrucciones = (
            "Eres SparkCheck IA, un asistente experto en ingeniería eléctrica y eficiencia energética. "
            "Tu única función es analizar datos de consumo y dar recomendaciones de ahorro. "
            "REGLAS CRÍTICAS:\n"
            "1. USA LOS DATOS PROPORCIONADOS en el contexto para responder la duda del usuario.\n"
            "2. Si el usuario pregunta por picos de voltaje o consumo, analiza las cifras y diles exactamente dónde están.\n"
            "3. Si el usuario intenta hablar de temas no relacionados (cocina, ocio, programación), responde estrictamente: "
            "'Lo siento, como asistente de SparkCheck solo puedo ayudarte con análisis de consumo eléctrico y eficiencia.'\n"
            "4. Mantén un tono técnico pero comprensible."
        )

        try:
            # 4. Auto-detección de modelos disponibles en tu cuenta de Google
            modelos_compatibles = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            # Priorizamos Gemini 1.5 Flash (gratuito y rápido), si no, usamos el primero disponible
            model_name = next((m for m in modelos_compatibles if '1.5-flash' in m), modelos_compatibles[0])
            
            model = genai.GenerativeModel(model_name)

            # 5. Creación del Prompt Final (Instrucciones + Datos + Pregunta)
            prompt_final = f"{instrucciones}\n\n{contexto_ia}\n\nPREGUNTA DEL USUARIO: {user_prompt}"
            
            response = model.generate_content(prompt_final)
            
            print(f"Respuesta enviada al frontend correctamente.\n")
            return Response({"response": response.text}, status=200)

        except Exception as e:
            print(f"ERROR EN GEMINI: {str(e)}")
            return Response({"error": f"Error en el motor de IA: {str(e)}"}, status=500)