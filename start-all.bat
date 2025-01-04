@echo off
echo ================================
echo   Lancement du projet Tunevent
echo ================================

:: Démarrer le Back-End
echo Démarrage du Back-End...
start cmd /k "cd C:\Users\Dell\OneDrive\Bureau\pfe\Back-End && mvn spring-boot:run"

:: Démarrer le Front-End
echo Démarrage du Front-End...
start cmd /k "cd C:\Users\Dell\OneDrive\Bureau\Final\Front-ang-app && ng serve --proxy-config proxy.conf.json"

echo ================================
echo   Les deux services sont lancés
echo ================================
pause
