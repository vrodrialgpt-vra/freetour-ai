# TOOLS.md

## Qué es este archivo

`TOOLS.md` guarda notas locales y operativas del entorno.
No define la filosofía del asistente.
No sustituye a las skills.
No es memoria curada del usuario.
Su función es muy concreta: reunir valores específicos del entorno que hacen falta para operar bien.

## Qué sí va aquí

- rutas locales
- IDs de canales, grupos, topics o threads
- nombres de hosts, aliases y endpoints
- ubicaciones de logs
- nombres de dispositivos
- preferencias técnicas del entorno
- ubicación de configs y secretos
- reglas prácticas que dependen de la instalación real

## Qué no va aquí

- principios de personalidad
- reglas generales de ejecución
- historia del proyecto
- preferencias humanas que pertenecen a `USER.md` o `MEMORY.md`
- documentación de skills compartidas

## Configuración y secretos

### Rutas de configuración

- `.env` canónico: `/opt/openclaw/.env`
- Config de plataforma: `/opt/openclaw/config.yaml`
- Symlinks o rutas de compatibilidad: `/home/victor/.openclaw -> /opt/openclaw`

### Regla de seguridad

- documenta ubicación y propósito
- evita pegar secretos enteros en el archivo
- si un valor es especialmente sensible, referencia su ubicación, no el contenido

## Mensajería

### Plataforma principal

- Canal o grupo principal: `whatsapp_agent_victor`

### Topics, threads o subcanales

- `leads` → `topic_leads_01`
- `alerts` → `topic_alerts_01`
- `admin` → `topic_admin_01`

### Comportamiento por topic

- `leads`: clasificación automática, respuesta inicial y enriquecimiento de datos
- `alerts`: recordatorios, eventos y notificaciones críticas
- `admin`: ejecución de comandos directos con prioridad alta

### Plataforma secundaria

- `telegram_bot_victor` → `tg_bot_01`
- `email_queue` → `email_inbound_01`

## Proyectos y herramientas externas

### Gestión de proyectos

- Workspace o espacio principal: `Notion_AI_System`
- Proyecto 1: `WhatsApp Inmobiliario - CORE`
- Proyecto 2: `Personal AI Assistant - OPS`

### CLIs y utilidades

- CLI de email: `/usr/bin/email-cli`
- CLI de agente o coding tool: `/usr/bin/openclaw`
- Logs: `/var/log/openclaw/`
- Base de datos o mirror local: `/var/lib/openclaw/db.sqlite`
- Preferencia por defecto en pantallas y diagnóstico: mostrar logs y número de versión cuando ayude a entender el estado interno

## Infraestructura local

### Hosts y aliases

- `openclaw-local` → `http://localhost:3000`
- `openclaw-api` → `http://localhost:8080`
- `openclaw-vps` → `ssh root@vps-ip`

### Paths o endpoints útiles

- `http://localhost:8080/api/run`
- `http://localhost:8080/api/messages`
- `http://localhost:8080/health`

## Reglas operativas del entorno

- Notas de voz: usar `.ogg` < 60s optimizado para WhatsApp
- Navegador o sesión recomendada: Chrome perfil `openclaw-admin`
- Regla de validación antes de enviar: validar contexto + intención antes de ejecutar acciones externas
- Endpoint o conector activo: webhook `/api/messages` conectado a WhatsApp

## Preferencias de contenido técnicas

- formato de audio preferido: `.ogg`
- herramienta de conversión recomendada: `ffmpeg`
- comportamiento de portapapeles: scripts helper para copiar outputs críticos
- stack de prompts activo con fallback automático

## Stack de prompts o runtime

- Stack por defecto: `openclaw + claude-code`
- Stack alternativo o fallback: `gpt-local-runtime`
- Cómo se conmuta: fallback automático tras error o timeout (>2 intentos)

## Backups

- Decisión actual: el backup nocturno cubre solo OpenClaw, no todo el VPS
- Alcance por defecto del backup local nocturno: `/data/.openclaw`
- Motivo: menor ruido, menor tamaño, restauración más simple y menos riesgo de arrastrar datos ajenos al sistema
- Destino de backups: `/data/.openclaw/backups`
- Frecuencia: diario a las `02:00` en `Europe/Madrid`

## Mantenimiento

Un buen `TOOLS.md` debe ser:
- corto
- preciso
- local al entorno
- fácil de escanear
- fácil de actualizar

Si una nota deja de ser específica del entorno, probablemente debe mudarse a otro archivo.

## Principio final

`TOOLS.md` es la chuleta local del asistente.
No debería explicar el mundo.
Solo debería evitar que el asistente pierda tiempo buscando cosas que ya debería tener a mano.
