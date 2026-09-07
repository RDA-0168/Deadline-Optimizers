$tempPdf = "$env:TEMP\RAILMARK_AI_PRESENTATION_SPEECH_AND_QA.pdf"
$htmlPath = "file:///C:/Users/dheer/OneDrive/Documents/SIH%20DEMO/presentation_speech.html"
$destPdf = "C:\Users\dheer\OneDrive\Documents\SIH DEMO\RAILMARK_AI_PRESENTATION_SPEECH_AND_QA.pdf"

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
}

Write-Host "Rendering PDF using: $chromePath"
& $chromePath --headless --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf=$tempPdf $htmlPath

Start-Sleep -Seconds 2

if (Test-Path $tempPdf) {
    Copy-Item $tempPdf $destPdf -Force
    Write-Host "PDF successfully generated and saved to: $destPdf"
    Get-Item $destPdf | Format-List FullName, Length, LastWriteTime
} else {
    Write-Error "Failed to generate temporary PDF at $tempPdf"
}
