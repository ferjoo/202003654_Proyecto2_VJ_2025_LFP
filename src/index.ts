import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.route';

// Crear la aplicación Express (el servidor web)
const app = express();

// Configurar el motor de plantillas para mostrar páginas web
app.set('view engine', 'ejs');

// Permitir que el frontend de React se comunique con este servidor
// CORS es como un "permiso" para que diferentes sitios web puedan hablar entre sí
app.use(cors({
  origin: 'http://localhost:3001', // Puerto donde corre React
  credentials: true
}));

// Servir archivos estáticos (CSS, JavaScript, imágenes) desde la carpeta 'public'
app.use(express.static('public'));

// Configurar el servidor para recibir texto plano (código C# del usuario)
app.use(express.text());

// Usar las rutas de análisis (donde se procesa el código C#)
app.use(analyzeRouter);

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("El servidor está funcionando en: http://localhost:3000");
});