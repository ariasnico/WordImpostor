#!/bin/bash

echo "🎭 Word Impostor - Inicio Rápido"
echo "================================"
echo ""

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js encontrado: $(node --version)${NC}"

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias raíz (concurrently)...${NC}"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar dependencias raíz${NC}"
        exit 1
    fi
fi

if [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias de servidor y cliente...${NC}"
    npm run install-all
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar dependencias${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
fi

# Verificar archivos .env
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚙️  Creando archivo .env para el servidor...${NC}"
    cp server/.env.example server/.env 2>/dev/null || echo "PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000" > server/.env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
fi

echo ""
echo -e "${GREEN}🚀 Iniciando Word Impostor...${NC}"
echo ""
echo -e "${YELLOW}Servidor:${NC} http://localhost:3001"
echo -e "${YELLOW}Cliente:${NC}  http://localhost:3000"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
echo ""

# Iniciar ambos servicios
npm run dev


