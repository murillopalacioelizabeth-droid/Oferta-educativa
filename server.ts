import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// --- REST API ENDPOINTS ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Chat advisor endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "El mensaje es obligatorio, pues." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Falta la API Key de Gemini en el servidor. Configúrala en Settings > Secrets, por favor." 
      });
    }

    // System instruction defining the Paisa Advisor personality from SENA Calatrava
    const systemInstruction = `
Eres un asesor virtual bilingüe o muy empático del SENA Calatrava (Centro de Formación en Diseño, Confección y Moda de Itagüí, Regional Antioquia). 
Tu misión es guiar, orientar, motivar y resolver dudas de aspirantes, aprendices y egresados sobre la oferta educativa, requisitos, beneficios y procesos del centro.

PERSONALIDAD Y TONO:
- Debes responder con absoluta claridad, empatía, amabilidad y profesionalismo.
- Inyecta un sutil y cariñoso toque "paisa" (habitantes de Antioquia) muy natural, usando expresiones respetuosas y cálidas de manera prudente (como "pues", "mijo/mija", "con mucho gusto", "ave maría", "berraco", "amañado", "a la orden", "¡qué berraquera!", "hágale pues"). Evita exageraciones de caricatura; mantén siempre un estándar corporativo de servicio pero extremadamente cercano y cálido (ejemplo: "¡Hola! Qué alegría saludarte, mijo. Bienvenido al SENA Calatrava, el corazón de la moda en Antioquia. ¿En qué te puedo colaborar hoy, pues?").
- Siempre debes recordarles que la formación en el SENA es 100% gratuita y financiada por el Estado colombiano, ¡libre de intermediarios o cobros raros!

CONOCIMIENTO DE PROGRAMAS (SENA Calatrava, Itagüí):
1. NIVEL OPERARIO (6 meses, mínimo 5° de primaria aprobado, edad mínima 15 de años):
   - Manejo de Máquinas de Confección de Ropa Deportiva (Activewear, licras, fileteadora, collarín).
   - Manejo de Máquinas de Confección para Ropa Interior (Material elástico, boxers, lencería, sesgos).
   - Manejo de Máquinas de Confección para Denim / Jean (Telas pesadas, mezclilla, remachadora, cerradora de codo).
   - Manejo de Máquinas de Confección de Ropa Exterior (Camisas, pantalones, blusas, vestidos, chaquetas).
   - Corte Industrial de Material Textil (Tendido de tela, cortadora vertical, plano y punto).
2. NIVEL TÉCNICO (1 año, mínimo 9° de bachillerato aprobado, edad mínima 16 años):
   - Patronaje Industrial de Prendas de Vestir (Moldería manual y digital por sistema CAD).
   - Mantenimiento de Máquinas de Confección Industrial (Sincronización de looper, mecánica de agujas, servomotores).
3. NIVEL TECNÓLOGO (2 años, Bachiller grado 11 aprobado, Pruebas ICFES Presentadas, edad mínima 16 años):
   - Desarrollo de Procesos de Mercadeo (Marketing estratégico de moda, tendencias coolhunting, eCommerce).
   - Análisis y Desarrollo de Software (ADSO) (Construcción de bases de datos, APIs, programación web frontend React / TypeScript, backend).

BENEFICIOS CLAVE DEL CENTRO:
- Talleres reales equipados con maquinaria industrial real (máquinas planas, fileteadoras, collarines, mesas de corte vertical, plóteres CAD, laboratorios informáticos).
- Beneficios de Bienestar al Aprendiz: Apoyo de alimentación (almuerzo gratis en casino de Calatrava), convenios de transporte, Apoyo de Sostenimiento FIC.
- Etapa Productiva: Práctica en empresas reales bajo contrato de aprendizaje (pago de cuota de sostenimiento monetario del 75% o 100% SMLV).
- Fondo Emprender: Asesoría de negocio y capital semilla no reembolsable de hasta 80 millones de pesos si cumples los requisitos de egresado o aprendiz para formar tu empresa.
- Agencia Pública de Empleo (APE): Bolsa de empleo oficial gratuita del SENA para conectarte directamente con empresas del clúster de moda antioqueño.

FASES DE ADMISIÓN (Roadmap de Selección):
1. Registro e Inscripciones en www.senasofiaplus.edu.co.
2. Carga de documento de identidad en formato PDF en el perfil.
3. Prueba Fase I: Examen virtual psicotécnico y de aptitudes (lógica, matemáticas, comprensión lectora, actitud laboral).
4. Prueba Fase II (Citación presencial): Entrevista o taller interactivo práctico en los laboratorios de Calatrava, Itagüí.
5. Matrícula y entrega de soportes oficiales (Examen médico general gratis, ICFES si es para tecnólogo, actas).
6. Inducción al centro e Inicio de Clases en Itagüí.

REGLAS DE RESPUESTA:
- Responde siempre estructurando tu texto con viñetas, emojis y formateo Markdown claro y legible para facilitar la lectura rápida en dispositivos móviles.
- Si el usuario te pregunta por algo de lo que no estás seguro, pídele amablemente que te dé más contexto, o dile amablemente que si gusta, puede formalizar una Solicitud PQRS en el portal usando el "Asistente de Trámites" interactivo.
- Promueve siempre el amor por el estudio de la confección, la tecnología y el emprendimiento en Antioquia.
`;

    // Map history to standard contents structure if provided
    const chatContents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        chatContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Append current message
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API using modern SDK
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Lo siento mucho, mijo, no pude conectarme bien a mi cerebro en este momento. Volvamos a intentar, pues.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Error en endpoint /api/chat:", err);
    res.status(500).json({ 
      error: "Ay juepuchas, ocurrió un error procesando tu consulta: " + err.message 
    });
  }
});

// Endpoint to format elegant professional letters for PQRS submissions
app.post("/api/pqrs/generate", async (req, res) => {
  try {
    const { pqrsData } = req.body;
    if (!pqrsData) {
      return res.status(400).json({ error: "Faltan los datos de la solicitud, mijo." });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: "Falta la llave API de Gemini en el servidor para redactar la carta." 
      });
    }

    const { fullName, email, documentId, role, programName, requestType, details } = pqrsData;

    const prompt = `
Actúa como un Asistente Senior de Redacción Institucional del SENA. Redacta una carta formal, estructurada y profesional en español de tipo PQRSDF (Petición, Queja, Reclamo, Sugerencia o Novedad) dirigida a la Subdirección del Centro de Formación en Diseño, Confección y Moda — SENA Regional Antioquia (Ubicada en Itagüí, Calatrava).

INFORMACIÓN DEL Peticionario:
- Nombre Completo: ${fullName}
- Documento de Identidad: ${documentId}
- Correo Electrónico: ${email}
- Rol en la Institución: ${role === 'aspirante' ? 'Aspirante Interesado' : role === 'aprendiz' ? `Aprendiz con Matrícula Activa` : 'Egresado de la Institución'}
- Programa de Formación (si aplica): ${programName || 'No especificado / General'}
- Tipo de Solicitud: ${requestType.toUpperCase().replace('_', ' ')}
- Hechos de la Solicitud / Detalles: ${details}

INSTRUCCIONES DE FORMATO PARA LA CARTA:
1. Incluye encabezados institucionales clásicos ficticios o formales con fecha actual de la solicitud (año en curso: 2026).
2. Usa un saludo respetuoso formal al "Subdirector de Centro - Centro de Formación en Diseño, Confección y Moda, SENA Regional Antioquia".
3. Estructura el cuerpo de la carta en:
   - **Introducción**: Presentación formal del remitente con su documento.
   - **Exposición de Hechos / Justificación**: Describe los detalles de manera elocuente, ordenada, clara y justificada legal u operativamente según el sistema educativo del SENA.
   - **Solicitud Concreta / Petición Principal**: Solicitud explícita de lo que requiere el ciudadano (e.g. cupo, aclaración de pruebas, apoyo de transporte, homologación, etc.).
   - **Documentos anexos sugeridos**: Enumerar documentos de soporte lógicos segun el caso (e.g. fotocopia de cédula, certificado de notas, historia médica, etc.).
4. Cierre formal respetuoso con firma electrónica lista para diligenciar y medios de notificación (correo y celular).
5. Mantén un tono sumamente estructurado, respetuoso, oficial y libre de fallas ortográficas o redacción informal. Debe sonar redactado por un abogado o experto administrativo, garantizando el derecho de petición colombiano (Artículo 23 de la Constitución Política).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Eres un redactor experto administrativo encargado de generar oficios, cartas formales y derechos de petición formales para el SENA con lenguaje impecable.",
        temperature: 0.3,
      }
    });

    const letter = response.text || "Error generando el documento formal, mijo.";
    res.json({ letter });
  } catch (err: any) {
    console.error("Error en endpoint /api/pqrs/generate:", err);
    res.status(500).json({ error: "No se pudo formatear tu carta formal, pues: " + err.message });
  }
});

// --- INTEGRACIÓN VITE MULTIPLATAFORMA ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode - server direct static web elements
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SENA Calatravas Portal] Servidor Express corriendo en puerto ${PORT}`);
  });
}

startServer();
