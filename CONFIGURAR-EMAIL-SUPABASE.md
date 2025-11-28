# 📧 Configurar Email en Supabase

## Problema
Supabase no envía emails de verificación por defecto. Necesitas configurar un proveedor SMTP para que los usuarios reciban emails de verificación.

## Solución 1: Configurar SMTP en Supabase (Recomendado para Producción)

### Paso 1: Obtener credenciales SMTP

Puedes usar cualquier proveedor SMTP. Opciones comunes:

#### Opción A: Gmail (Gratis, fácil)
1. Ve a tu cuenta de Google
2. Activa la "Verificación en 2 pasos"
3. Ve a [Contraseñas de aplicaciones](https://myaccount.google.com/apppasswords)
4. Genera una contraseña de aplicación para "Correo"
5. Usa estos datos:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: Tu email de Gmail
   - **Password**: La contraseña de aplicación generada

#### Opción B: SendGrid (Gratis hasta 100 emails/día)
1. Crea cuenta en [SendGrid](https://sendgrid.com)
2. Verifica tu dominio o usa el dominio de prueba
3. Crea una API Key
4. Usa estos datos:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **Username**: `apikey`
   - **Password**: Tu API Key de SendGrid

#### Opción C: Mailgun (Gratis hasta 5,000 emails/mes)
1. Crea cuenta en [Mailgun](https://www.mailgun.com)
2. Verifica tu dominio
3. Obtén credenciales SMTP del dashboard

### Paso 2: Configurar en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Settings** → **Auth** → **SMTP Settings**
3. Activa **Enable Custom SMTP**
4. Completa los campos:
   - **Sender email**: El email que aparecerá como remitente
   - **Sender name**: Nombre del remitente (ej: "Puebla Housing")
   - **Host**: El host SMTP (ej: `smtp.gmail.com`)
   - **Port**: El puerto (generalmente `587` para TLS)
   - **Username**: Tu usuario SMTP
   - **Password**: Tu contraseña SMTP
5. Click en **Save**

### Paso 3: Probar

1. Intenta crear una nueva cuenta desde el login
2. Revisa tu bandeja de entrada (y spam)
3. Deberías recibir el email de verificación

## Solución 2: Deshabilitar Verificación de Email (Solo para Desarrollo)

⚠️ **ADVERTENCIA**: Esto solo es recomendado para desarrollo. En producción siempre debes verificar emails.

### Opción A: Desde el Dashboard de Supabase

1. Ve a **Settings** → **Auth** → **Email Templates**
2. En **Confirm signup**, puedes personalizar el template
3. Ve a **Settings** → **Auth** → **Providers** → **Email**
4. Desactiva **Confirm email** (solo para desarrollo)

### Opción B: Confirmar usuarios manualmente

1. Ve a **Authentication** → **Users** en Supabase
2. Encuentra el usuario que se registró
3. Click en el usuario
4. Click en **Confirm email** o marca como verificado

## Solución 3: Usar Script para Crear Usuarios (Sin Email)

Si necesitas crear usuarios sin verificación de email, usa el script:

```bash
npx tsx scripts/create-admin-simple-supabase.ts tu-email@ejemplo.com tu-password "Tu Nombre"
```

Este script crea el usuario con el email ya confirmado, así que puedes iniciar sesión inmediatamente.

## Solución 4: Confirmar Email Manualmente con Script

Si un usuario ya se registró pero no recibió el email, puedes confirmar su email manualmente:

```bash
npx tsx scripts/confirm-user-email.ts tu-email@ejemplo.com
```

Este script busca el usuario por email y confirma su cuenta automáticamente.

## Recomendación

- **Para Desarrollo**: Usa la Solución 3 (script) o confirma manualmente desde el dashboard
- **Para Producción**: Configura SMTP (Solución 1) para que los usuarios reciban emails automáticamente

