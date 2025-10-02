# 🤝 Contribuir a Word Impostor

¡Gracias por tu interés en contribuir a Word Impostor! Este documento proporciona pautas para contribuir al proyecto.

## 🚀 Cómo Empezar

1. **Fork el repositorio**
2. **Clona tu fork**:
   ```bash
   git clone https://github.com/tu-usuario/WordImpostor.git
   cd WordImpostor
   ```
3. **Instala las dependencias**:
   ```bash
   npm run install-all
   ```
4. **Crea una rama para tu feature**:
   ```bash
   git checkout -b feature/mi-nueva-feature
   ```

## 💻 Desarrollo

### Estructura del Código

- `server/` - Backend Node.js con Express y Socket.io
- `client/src/components/` - Componentes React del juego
- `client/src/context/` - Contextos de React (Socket, Game)
- `client/src/pages/` - Páginas principales de la app

### Convenciones de Código

#### JavaScript/React
- Usa nombres descriptivos para variables y funciones
- Componentes en PascalCase (ej: `GameLobby.jsx`)
- Funciones en camelCase (ej: `handleSubmit`)
- Usa comentarios para lógica compleja
- Mantén los componentes pequeños y enfocados

#### CSS/Tailwind
- Usa clases de Tailwind CSS cuando sea posible
- Clases personalizadas en `index.css` con el prefijo apropiado
- Mobile-first design (diseña primero para móvil)

### Testing

Antes de enviar un PR:

1. **Prueba el flujo completo del juego**:
   - Crear sala
   - Unir múltiples jugadores (abre múltiples pestañas)
   - Iniciar juego
   - Completar rondas
   - Votación
   - Fin del juego

2. **Prueba en dispositivos móviles**:
   - Chrome DevTools mobile emulation
   - Dispositivos reales si es posible

3. **Verifica que no haya errores en consola**

## 🐛 Reportar Bugs

Si encuentras un bug:

1. **Verifica que no esté ya reportado** en Issues
2. **Crea un nuevo Issue** con:
   - Título descriptivo
   - Pasos para reproducir el bug
   - Comportamiento esperado vs actual
   - Screenshots o videos si es relevante
   - Información del navegador/dispositivo

## ✨ Sugerir Features

Para sugerir nuevas características:

1. **Abre un Issue** con la etiqueta `enhancement`
2. **Describe la feature** claramente:
   - ¿Qué problema resuelve?
   - ¿Cómo funcionaría?
   - ¿Por qué es importante?

## 📝 Pull Requests

### Proceso

1. **Asegúrate de que tu código funciona**
2. **Actualiza la documentación** si es necesario
3. **Commit con mensajes descriptivos**:
   ```
   feat: Agregar modo de juego rápido
   fix: Corregir reconexión de jugadores
   docs: Actualizar README con nuevas instrucciones
   style: Mejorar UI del lobby
   ```
4. **Push a tu fork**:
   ```bash
   git push origin feature/mi-nueva-feature
   ```
5. **Abre un Pull Request** en GitHub

### Checklist para PR

- [ ] El código funciona sin errores
- [ ] Probado en navegador de escritorio
- [ ] Probado en navegador móvil
- [ ] No hay warnings en consola
- [ ] Documentación actualizada
- [ ] Commit messages descriptivos

## 🎨 Ideas de Mejoras

Algunas áreas donde puedes contribuir:

### Features
- [ ] Modo espectador mejorado
- [ ] Sistema de puntuación
- [ ] Salas privadas con contraseña
- [ ] Chat de texto durante el juego
- [ ] Temas personalizables
- [ ] Sonidos y música
- [ ] Estadísticas de jugador
- [ ] Replay de partidas

### Mejoras Técnicas
- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Playwright
- [ ] Progressive Web App (PWA)
- [ ] Persistencia en base de datos
- [ ] Sistema de cuentas de usuario
- [ ] Internacionalización (i18n)
- [ ] Optimización de rendimiento
- [ ] Accesibilidad mejorada

### UI/UX
- [ ] Animaciones más fluidas
- [ ] Mejor feedback visual
- [ ] Modo oscuro
- [ ] Avatares personalizables
- [ ] Tutorial interactivo
- [ ] Efectos de sonido
- [ ] Mejores transiciones

## 📜 Código de Conducta

- Sé respetuoso y constructivo
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores

## 🎉 Reconocimientos

Todos los contribuidores serán reconocidos en el README.

## 📞 Preguntas

Si tienes preguntas, abre un Issue con la etiqueta `question`.

---

¡Gracias por hacer Word Impostor mejor! 🎭✨


