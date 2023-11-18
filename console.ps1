# Get the path to the folder where the script is located
$scriptFolderPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Function to print files and folders recursively
function Print-FilesAndFolders {
    param (
        [string]$folderPath,
        [int]$indentLevel = 0
    )

    # Get the list of files and folders in the current folder
    $items = Get-ChildItem -Path $folderPath

    # Loop through each item
    foreach ($item in $items) {
        # Print the current item with proper indentation
        Write-Host (" " * $indentLevel) -NoNewline
        Write-Host $item.Name

        # If the item is a folder, recursively call the function
        if ($item.PSIsContainer) {
            Print-FilesAndFolders -folderPath $item.FullName -indentLevel ($indentLevel + 2)
        }
    }
}

# Search for "frontend/src" and "backend/src" folders in subfolders
$frontendSrcFolders = Get-ChildItem -Path $scriptFolderPath -Directory -Recurse -Filter ".\frontend\src"
$backendSrcFolders = Get-ChildItem -Path $scriptFolderPath -Directory -Recurse -Filter ".\backend\src"

# Iterate through each "frontend/src" folder and print its contents
foreach ($frontendSrcFolder in $frontendSrcFolders) {
    Write-Host "Found 'frontend/src' folder: $($frontendSrcFolder.FullName)"
    Print-FilesAndFolders -folderPath $frontendSrcFolder.FullName
}

# Iterate through each "backend/src" folder and print its contents
foreach ($backendSrcFolder in $backendSrcFolders) {
    Write-Host "Found 'backend/src' folder: $($backendSrcFolder.FullName)"
    Print-FilesAndFolders -folderPath $backendSrcFolder.FullName
}
