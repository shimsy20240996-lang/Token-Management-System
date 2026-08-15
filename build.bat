@echo off
echo Building Multilingual Token System for Production...

echo.
echo [1/3] Building Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo [2/3] Building Backend...
cd backend
call npm install
call npm run build
cd ..

echo.
echo [3/3] Build Complete!
echo.
echo To start the production server, run:
echo cd backend
echo npm run start
echo.
echo The application will be accessible at http://localhost:3000
echo This single port will serve both the backend API and the frontend customer UI.
pause
