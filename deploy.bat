@echo off
echo --- Iniciando actualizacion del Portafolio ---
git add .
set /p msg="Introduce el mensaje del commit: "
git commit -m "%msg%"
git push origin main
echo --- Portafolio actualizado con exito ---
pause