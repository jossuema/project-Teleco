#!/bin/bash

echo "🚀 Configurando proyecto Next.js..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Configurar variables de entorno
if [ ! -f .env ]; then
    echo "📄 Copiando archivo de ejemplo .env..."
    cp .env.example .env
    echo "⚠️  IMPORTANTE: Configura tu DATABASE_URL en el archivo .env"
fi

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

echo "✅ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. Configura tu DATABASE_URL en el archivo .env"
echo "2. Ejecuta: npx prisma db push (para sincronizar con tu DB)"
echo "3. Ejecuta: npm run seed (para crear datos de prueba)"
echo "4. Ejecuta: npm run dev (para iniciar el servidor)"
echo ""
echo "Usuario de prueba:"
echo "- Usuario: admin"
echo "- Contraseña: admin123"