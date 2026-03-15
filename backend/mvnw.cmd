@REM Maven Wrapper script for Windows
@echo off
setlocal

set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6"
set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if exist "%MAVEN_CMD%" goto execute

echo Downloading Maven...
mkdir "%MAVEN_HOME%" 2>nul

for /f "tokens=2 delims==" %%a in ('findstr "distributionUrl" ".mvn\wrapper\maven-wrapper.properties"') do set "DOWNLOAD_URL=%%a"

powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%TEMP%\maven.zip'"
powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"
del "%TEMP%\maven.zip"

:execute
"%MAVEN_CMD%" %*
