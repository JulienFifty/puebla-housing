# 📦 Instrucciones para Restaurar Backup

## Ubicación de los Backups

Los backups están guardados en: `/Users/julienthibeault/`

### Backups Disponibles:

1. **`puebla-housing-backup-20251128-000831.tar.gz`** (12MB)
   - Backup ligero sin `node_modules` ni `.next`
   - Ideal para restaurar código fuente
   - Fecha: 28 de noviembre de 2025, 00:08:31

2. **`puebla-housing-backup-complete-20251128-000839.tar.gz`** (136MB)
   - Backup completo con `node_modules` incluido
   - Ideal para restaurar todo el proyecto tal como está
   - Fecha: 28 de noviembre de 2025, 00:08:39

## 🔄 Cómo Restaurar un Backup

### Opción 1: Restaurar Backup Ligero (Recomendado)

```bash
# 1. Detener el servidor si está corriendo
pkill -f "next dev"

# 2. Hacer backup del proyecto actual (por si acaso)
cd /Users/julienthibeault
tar -czf puebla-housing-current-backup-$(date +%Y%m%d-%H%M%S).tar.gz puebla-housing

# 3. Eliminar el proyecto actual (o renombrarlo)
mv puebla-housing puebla-housing-old

# 4. Extraer el backup
tar -xzf puebla-housing-backup-20251128-000831.tar.gz

# 5. Instalar dependencias
cd puebla-housing
npm install

# 6. Iniciar el servidor
npm run dev
```

### Opción 2: Restaurar Backup Completo

```bash
# 1. Detener el servidor si está corriendo
pkill -f "next dev"

# 2. Hacer backup del proyecto actual
cd /Users/julienthibeault
tar -czf puebla-housing-current-backup-$(date +%Y%m%d-%H%M%S).tar.gz puebla-housing

# 3. Eliminar el proyecto actual
mv puebla-housing puebla-housing-old

# 4. Extraer el backup completo
tar -xzf puebla-housing-backup-complete-20251128-000839.tar.gz

# 5. Iniciar el servidor (no necesitas npm install)
cd puebla-housing
npm run dev
```

## ⚠️ Importante

- **No elimines los backups** hasta estar seguro de que todo funciona correctamente
- Los backups **NO incluyen** el archivo `.env.local` (por seguridad)
- Si necesitas restaurar las variables de entorno, cópialas manualmente desde tu backup anterior

## 📝 Verificar el Backup

Para verificar que el backup se creó correctamente:

```bash
# Ver contenido del backup
tar -tzf /Users/julienthibeault/puebla-housing-backup-20251128-000831.tar.gz | head -20

# Ver tamaño y detalles
ls -lh /Users/julienthibeault/puebla-housing-backup*.tar.gz
```

## 🔐 Restaurar Variables de Entorno

Si necesitas restaurar tu archivo `.env.local`:

1. Busca en tus backups anteriores o en otro lugar seguro
2. Cópialo manualmente a `/Users/julienthibeault/puebla-housing/.env.local`
3. Asegúrate de que tenga todas las variables necesarias:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_PLACES_API_KEY`
   - etc.

## 📅 Fecha del Backup

- **Fecha de creación:** 28 de noviembre de 2025, 00:08
- **Estado del proyecto:** Funcionando correctamente en local
- **Último commit:** f2673d2 - Fix: Remove Prisma/bcrypt dependencies

