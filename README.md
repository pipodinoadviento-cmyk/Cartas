# 24 cartas (versión propia, 100 % gratis)
GitHub Pages (web) + Supabase (datos, fotos, audios) + Google Apps Script (correo desde tu Gmail y disparador diario).

## Puesta en marcha
1. **Supabase**: crea un proyecto gratis → SQL Editor → pega `supabase/schema.sql` → Run.
   Authentication → Users → *Add user* (tu correo + contraseña: es tu acceso al editor).
   Copia *Project URL* y *anon key* (Settings → API) en `config.js`.
2. **Apps Script**: entra en script.google.com con tu Gmail → Nuevo proyecto → pega `apps-script/Code.gs`.
   Project Settings → *Script properties*: `SUPABASE_URL` (la URL de antes) y `SERVICE_KEY` (la clave **service_role** de Supabase; es secreta, no la pongas en GitHub).
   Ejecuta `installTrigger` una vez y acepta los permisos.
3. **Deploy → New deployment → Web app**: *Execute as: Me*, *Who has access: Anyone*. Copia la URL en `mailUrl` de `config.js`.
   (Cualquiera podría llamarla, pero solo envía si el token es de tu usuario de Supabase.)
4. **GitHub**: sube esta carpeta a un repo → Settings → Pages (rama main, raíz).
5. Abre `https://TU_USUARIO.github.io/TU_REPO/admin.html`: ajustes (correos, dirección de la web, PIN), escribe las cartas, **Vista previa** y **Enviarme prueba**.

## Notas
- Correo diario a las 8:00 (hora de Madrid, entre 8 y 9) del 1 al 24 de diciembre. Límite de Gmail en Apps Script: 100 destinatarios/día, de sobra.
- La web solo entrega las cartas ya abiertas (lo comprueba el servidor) y, si pones PIN, solo con el PIN correcto.
- El primer correo puede caer en spam: pide que lo marquen como seguro.
- Graba los audios desde el iPad (Safari → m4a). Chrome de escritorio graba webm, que Safari puede no reproducir.
- Si ya habías ejecutado el SQL anterior, vuelve a ejecutar este: no borra tus datos.
