@echo off
echo --- Iniciando actualizacion del Portafolio ---
echo --- Generando estilos (Tailwind) ---
call npm run build
if errorlevel 1 (
    echo ERROR: no se pudo generar css/tailwind.css. Ejecuta "npm install" una vez y vuelve a intentar.
    pause
    exit /b 1
)
git add .
set /p msg="Introduce el mensaje del commit: "
git commit -m "%msg%"
git push origin main
echo --- Portafolio actualizado con exito ---
pause