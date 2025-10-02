@echo off
echo 🎭 Word Impostor - Inicio Rapido
echo ================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
node --version

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias raiz (concurrently)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error al instalar dependencias raiz
        pause
        exit /b 1
    )
)

if not exist "server\node_modules" (
    echo 📦 Instalando dependencias...
    call npm run install-all
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
)

if not exist "client\node_modules" (
    echo 📦 Instalando dependencias del cliente...
    call npm run install-all
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
)

REM Verificar archivos .env
if not exist "server\.env" (
    echo ⚙️ Creando archivo .env para el servidor...
    if exist "server\.env.example" (
        copy server\.env.example server\.env
    ) else (
        (
            echo PORT=3001
            echo NODE_ENV=development
            echo CLIENT_URL=http://localhost:3000
        ) > server\.env
    )
    echo ✅ Archivo .env creado
)

echo.
echo 🚀 Iniciando Word Impostor...
echo.
echo Servidor: http://localhost:3001
echo Cliente:  http://localhost:3000
echo.
echo Presiona Ctrl+C para detener
echo.

REM Iniciar ambos servicios
call npm run dev


