while ($true) {
    git pull
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Git pull successful"
    }
    else {
        Write-Host "Git pull failed"
    }
    $randomSeconds = Get-Random -Minimum 20 -Maximum 400
    Write-Host "Next pull in $randomSeconds seconds"
    Write-Host "Current time is $(Get-Date)"
    Start-Sleep -Seconds $randomSeconds
}