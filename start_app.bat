@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Инсталиране на зависимости...
  npm install
)
echo Стартиране на приложението...
npm start
