<#
.SYNOPSIS
Updates packages in package.json files.

.DESCRIPTION
This script updates packages in package.json files found in the current directory and its subdirectories, excluding node_modules directories. It retrieves the package names from the dependencies and devDependencies sections of each package.json file and updates them to the latest version using npm install.

.PARAMETER None

.EXAMPLE
.\packagesnapper.ps1
Updates packages in all package.json files found in the current directory and its subdirectories.


#>

# Get all package.json files in the current directory and its subdirectories, excluding node_modules directories
$packageFiles = Get-ChildItem -Path . -Filter package.json -Recurse -File | Where-Object { $_.DirectoryName -notmatch 'node_modules' }

# Loop through each package.json file
foreach ($packageFile in $packageFiles) {
    # Navigate to the directory containing the package.json file
    Set-Location $packageFile.DirectoryName

    Write-Host "Updating packages in $packageFile..."

    # Get the package names from the dependencies and devDependencies sections
    $packageNames = (Get-Content -Path $packageFile.Name | ConvertFrom-Json).PSObject.Properties.Name | Where-Object { $_ -eq 'dependencies' -or $_ -eq 'devDependencies' } | ForEach-Object { (Get-Content -Path $packageFile.Name | ConvertFrom-Json).$_ | Get-Member -MemberType NoteProperty | ForEach-Object { $_.Name } }

    # Update each package to the latest version
    foreach ($packageName in $packageNames) {
        Write-Host "Updating $packageName to the latest version..."
        npm install $packageName@latest
    }

    # Navigate back to the original directory
    Set-Location -Path $PSScriptRoot
}
