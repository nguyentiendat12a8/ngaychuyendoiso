Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = [System.Windows.Threading.Dispatcher].Assembly.GetType('System.Windows.Threading.DispatcherExtensions').GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' }

function Await-Async ($asyncOp) {
    $asTask = $asTaskGeneric.MakeGenericMethod($asyncOp.GetType().GetGenericArguments()[0])
    $task = $asTask.Invoke($null, @($asyncOp))
    $task.Wait()
    return $task.Result
}

[Windows.Media.Ocr.OcrEngine, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Foundation.UniversalApiContract, ContentType = WindowsRuntime] | Out-Null

$lang = [Windows.Globalization.Language]::new('vi-VN')
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)
if (-not $engine) {
    $engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
}
Write-Host "Engine language:" $engine.Language.LanguageTag

$outPath = 'D:\CDSQG\Công việc ngày 1010\source\ocr_output.txt'
"" | Out-File -FilePath $outPath -Encoding utf8

1..20 | ForEach-Object {
    $num = '{0:D2}' -f $_
    $imgPath = "D:\CDSQG\Công việc ngày 1010\source\pdf_images\page_$num.png"
    Write-Host "OCRing page $num..."
    $file = Await-Async ([Windows.Storage.StorageFile]::GetFileFromPathAsync($imgPath))
    $stream = Await-Async ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
    $decoder = Await-Async ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
    $bitmap = Await-Async ($decoder.GetSoftwareBitmapAsync())
    $result = Await-Async ($engine.RecognizeAsync($bitmap))
    
    Add-Content -Path $outPath -Value "=== PAGE $_ ===" -Encoding utf8
    Add-Content -Path $outPath -Value $result.Text -Encoding utf8
    Add-Content -Path $outPath -Value "`n" -Encoding utf8
}
Write-Host "Done OCRing 20 pages"
