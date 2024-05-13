# Get the directory of the script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Change to the directory of the script
Set-Location -Path $scriptPath

# Run the build command
npm run bundle

# Pause the script
Read-Host -Prompt "Press Enter to exit"