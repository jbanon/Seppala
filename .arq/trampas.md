---
name: trampas
description: Cosas aprendidas sobre este proyecto que no hay que repetir ni olvidar
metadata:
  type: project
---

# Trampas y aprendizajes (Aluminios Seppala)

Lista viva. Cada entrada: qué pasó, por qué importa, qué hacer en su lugar.

## No asumir el stack .NET habitual de este entorno

Este proyecto **no es ASP.NET Core/.NET**, a diferencia de la mayoría de proyectos con los que el
arquitecto o el programador puedan estar familiarizados en este entorno de trabajo. Es una web estática
HTML/CSS/JS sin build ni framework, con Python usado exclusivamente como herramienta de autoría
(`herramientas/*.py`), nunca como backend de producción. No buscar `.csproj`, `Program.cs` ni nada de
ASP.NET aquí: no existe y no debe introducirse. Primera auditoría (07/10/2026) confirmó que el stack real
cumple esto: `despliegue/*.nginx.conf` sirve HTML estático, `publicar.sh` solo hace `rsync`.

## Verificar datos contra la fuente oficial, no solo contra `INVESTIGACION.md`

El programador encontró el NIF de la empresa (A83404772) en el aviso legal de la web antigua, pero lo marcó
como **pendiente de confirmar por el cliente** en vez de darlo por bueno directamente, precisamente porque
es un dato registral que conviene que confirme el cliente aunque esté publicado. Esa prudencia es el
criterio correcto a seguir: un dato encontrado en una fuente (aunque sea la propia web del cliente) no es
lo mismo que un dato confirmado por el cliente para datos legales/registrales. Para datos técnicos de
fabricantes (cifras de prestaciones), en cambio, si la fuente oficial de la marca lo confirma, se puede
publicar sin esperar al cliente — así se hizo con Kömmerling RolaPlus y Guardian Sun, y la primera
auditoría del arquitecto (07/10/2026) contrastó esas cifras con las fichas oficiales y coinciden
exactamente. Mantener esta distinción en futuras revisiones.

## `sitemap.xml`/`robots.txt`/`canonical` apuntan al dominio de producción real, no a una URL de pruebas

A primera vista puede parecer un error (el sitio no está desplegado ahí todavía), pero es el patrón
correcto y el mismo que usa el proyecto de referencia Marchante: esta web sustituirá a la actual en
`www.aluminioseppala.com`, así que las URLs canónicas ya apuntan ahí. No "corregir" esto a una URL de
pruebas sin que lo pida el usuario.

## Tareas que requieren `sudo` o decisión externa no son tareas normales para el programador

Instalar dependencias de sistema (`sudo .venv/bin/playwright install-deps webkit`) cambia el entorno fuera
del repositorio. Si se asigna como tarea, dejarlo explícito en la tarea para que el programador pida
confirmación si su modo de permisos lo requiere, y no asumir que ya está disponible.

## Una instrucción que contradice el brief ya avanzado se confirma, no se ejecuta directamente

El 07/10/2026 el usuario pidió en mitad de una revisión pasar el stack a .NET + SQL Server "como el resto
de proyectos", lo cual contradecía `CLAUDE.md` y los 9 Goals ya completos. Antes de tocar nada se abrió una
ADR y se preguntó; la respuesta confirmó que era para el futuro (si el área de clientes deja de ser demo),
no un cambio inmediato — ver [[ADR-0002-conflicto-stack-dotnet]]. Si se hubiera ejecutado sin preguntar, se
habría descartado sin necesidad un trabajo completo y verificado. Regla: cuando una instrucción nueva choca
con el brief y el coste de equivocarse es alto (reescribir en vez de seguir), parar y confirmar, aunque la
instrucción sea corta y suene definitiva.
