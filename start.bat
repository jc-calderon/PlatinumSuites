@echo off
setlocal EnableExtensions
chcp 65001 >nul
rem ------------------------------------------------------------------
rem  Platinum Suites - Guía digital
rem  Doble clic para instalar (la primera vez) e iniciar la guía en el
rem  navegador. Los cambios en Markdown y fotos se ven al guardar.
rem ------------------------------------------------------------------
cd /d "%~dp0"
title Platinum Suites - Guía digital

echo.
echo   Platinum Suites · Guía digital para huéspedes
echo   ==============================================
echo.

rem --- 1. Node.js y npm ---------------------------------------------
where node >nul 2>nul
if errorlevel 1 goto :no_node
where npm >nul 2>nul
if errorlevel 1 goto :no_node

node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=22)?0:1)"
if errorlevel 1 goto :old_node

for /f "delims=" %%v in ('node -v') do echo   Node.js %%v detectado.

rem --- 2. Dependencias (solo si faltan o cambió package.json) ---------
set "NEED_INSTALL=0"
if not exist "node_modules\" set "NEED_INSTALL=1"
if not exist "node_modules\.install-stamp" set "NEED_INSTALL=1"
if "%NEED_INSTALL%"=="0" (
  node -e "const fs=require('fs');const t=f=>fs.existsSync(f)?fs.statSync(f).mtimeMs:0;process.exit(Math.max(t('package.json'),t('package-lock.json'))>t('node_modules/.install-stamp')?1:0)"
  if errorlevel 1 set "NEED_INSTALL=1"
)

if "%NEED_INSTALL%"=="1" (
  echo   Instalando dependencias. La primera vez puede tardar unos minutos...
  echo.
  call npm install
  if errorlevel 1 goto :install_failed
  type nul > "node_modules\.install-stamp"
  echo.
  echo   Dependencias instaladas.
) else (
  echo   Dependencias al día.
)

rem --- 3. Servidor de desarrollo + navegador -------------------------
echo.
echo   Iniciando la guía en http://localhost:4321 ...
echo   Si ese puerto está ocupado, Astro usará otro y lo indicará abajo.
echo   Para detener el servidor, cierre esta ventana o pulse Ctrl+C.
echo.
call npm run dev -- --open
if errorlevel 1 goto :dev_failed
goto :end

rem --- Errores ---------------------------------------------------------
:no_node
echo   [ERROR] No se encontró Node.js o npm.
echo.
echo   Instale Node.js 22.22 o superior, versión LTS recomendada, desde:
echo       https://nodejs.org
echo   Después vuelva a abrir este archivo.
echo.
pause
exit /b 1

:old_node
for /f "delims=" %%v in ('node -v') do set "NODE_VERSION=%%v"
echo   [ERROR] Su versión de Node.js es %NODE_VERSION% y se necesita 22.22 o superior.
echo.
echo   Actualice Node.js, versión LTS recomendada, desde:
echo       https://nodejs.org
echo.
pause
exit /b 1

:install_failed
echo.
echo   [ERROR] No se pudieron instalar las dependencias.
echo   Revise el mensaje de error de arriba y su conexión a Internet.
echo.
pause
exit /b 1

:dev_failed
echo.
echo   [ERROR] El servidor se detuvo con un error. Revise el mensaje de arriba.
echo   Si se trata de un archivo de contenido, el mensaje indica cuál y qué campo corregir.
echo.
pause
exit /b 1

:end
endlocal
