# Debug - Página Blanca

Si ves una página blanca, sigue estos pasos:

## 1. Verificar que el servidor esté corriendo

```bash
cd /Users/julienthibeault/puebla-housing
npm run dev
```

Deberías ver algo como:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3001
- Ready in Xs
```

## 2. Verificar errores en la terminal

Busca errores en rojo en la terminal donde ejecutaste `npm run dev`.

## 3. Verificar errores en el navegador

1. Abre http://localhost:3001/es
2. Presiona F12 (o Cmd+Option+I en Mac) para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Busca errores en rojo

## 4. Errores comunes

### Error: "Cannot find module"
- Solución: Ejecuta `npm install` de nuevo

### Error: "next-intl" o problemas de traducción
- Verifica que los archivos `messages/es.json` y `messages/en.json` existan
- Verifica que `i18n.ts` esté configurado correctamente

### Error: "Module not found" o problemas de importación
- Verifica que todos los archivos estén en las rutas correctas
- Verifica que `tsconfig.json` tenga la configuración de paths correcta

## 5. Limpiar y reinstalar

Si nada funciona:

```bash
cd /Users/julienthibeault/puebla-housing
rm -rf .next node_modules
npm install
npm run dev
```

## 6. Verificar estructura de archivos

Asegúrate de que existan:
- `app/layout.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `messages/es.json`
- `messages/en.json`
- `i18n.ts`
- `middleware.ts`

