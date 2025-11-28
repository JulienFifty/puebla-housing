#!/bin/bash

# Script para verificar y limpiar las claves de Supabase en .env.local

echo "Verificando formato de las claves en .env.local..."
echo ""

# Verificar Service Role Key
SERVICE_KEY_LINE=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env.local)
SERVICE_KEY_VALUE=$(echo "$SERVICE_KEY_LINE" | cut -d'=' -f2-)

echo "Service Role Key encontrada:"
echo "  Longitud: ${#SERVICE_KEY_VALUE} caracteres"
echo "  Primeros 30: ${SERVICE_KEY_VALUE:0:30}..."
echo "  Últimos 30: ${SERVICE_KEY_VALUE: -30}"
echo ""

# Verificar si tiene espacios o saltos de línea
if [[ "$SERVICE_KEY_VALUE" =~ [[:space:]] ]]; then
  echo "⚠️  ADVERTENCIA: La Service Role Key contiene espacios"
  echo "   Esto puede causar problemas. Asegúrate de que no haya espacios"
  echo "   antes o después del signo = en .env.local"
fi

# Verificar formato JWT
if [[ ! "$SERVICE_KEY_VALUE" =~ ^eyJ ]]; then
  echo "⚠️  ADVERTENCIA: La Service Role Key no parece ser un JWT válido"
  echo "   Debe comenzar con 'eyJ'"
fi

echo ""
echo "Si la clave es incorrecta, puedes:"
echo "1. Ir a Supabase Dashboard → Settings → API"
echo "2. Copiar la 'service_role' key (sin espacios)"
echo "3. Pegarla en .env.local como: SUPABASE_SERVICE_ROLE_KEY=tu_clave_aqui"




