#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "  CONFIGURACIÓN DE VARIABLES DE ENTORNO PARA SUPABASE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

read -p "Project URL (ej: https://xxxxx.supabase.co): " SUPABASE_URL
read -p "Anon/Public Key: " ANON_KEY
read -sp "Service Role Key: " SERVICE_KEY
echo ""

cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}
EOF

echo ""
echo "✅ Archivo .env.local creado exitosamente!"
echo ""
echo "Próximos pasos:"
echo "1. Ejecuta el SQL en Supabase (scripts/supabase-schema.sql)"
echo "2. Crea un usuario administrador"
echo "3. Ejecuta: npm run dev"
echo ""

