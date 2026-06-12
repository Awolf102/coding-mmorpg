@echo off
title Ashes of the First Kingdom
cd /d "%~dp0"

rem Try Python launchers in order; fall back to opening the file directly.
where py >nul 2>nul
if %errorlevel%==0 (
    py serve.py
    goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
    python serve.py
    goto :eof
)

echo Python not found - opening the game directly in your browser instead.
start "" "%~dp0index.html"
