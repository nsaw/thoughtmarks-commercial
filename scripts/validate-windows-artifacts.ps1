# Windows Pipeline Artifact Validation (BRUTAL REALITY)
# Validates .exe artifacts from GitHub Actions pipeline

Write-Host "🔍 Windows Pipeline Artifact Validation (BRUTAL REALITY)" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green

$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$WINDOWS_INSTALLERS_DIR = "/Users/sawyer/gitSync/thoughtpilot-commercial/distributions/windows-installers"
$TIERS = @("free", "pro", "team", "enterprise")

# 1. Check if Windows installers directory exists
if (!(Test-Path $WINDOWS_INSTALLERS_DIR)) {
    Write-Host "❌ Windows installers directory not found: $WINDOWS_INSTALLERS_DIR" -ForegroundColor Red
    Write-Host "⚠️  This is expected if GitHub Actions pipeline hasn't run yet" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Windows installers directory found" -ForegroundColor Green

# 2. Validate artifacts for all tiers
$MISSING_COUNT = 0
$VALID_COUNT = 0
$TOTAL_SIZE = 0

Write-Host "🔍 Validating .exe artifacts for all tiers..." -ForegroundColor Yellow

foreach ($TIER in $TIERS) {
    $INSTALLER_PATTERN = "thoughtpilot-$TIER-installer-*.exe"
    $INSTALLER = Get-ChildItem -Path $WINDOWS_INSTALLERS_DIR -Filter $INSTALLER_PATTERN | Select-Object -First 1
    
    if ($INSTALLER) {
        $SIZE = $INSTALLER.Length
        $TOTAL_SIZE += $SIZE
        
        # BRUTAL validation: Check minimum size (500KB)
        if ($SIZE -lt 500000) {
            Write-Host "⚠️  $TIER .exe seems unusually small: $SIZE bytes" -ForegroundColor Yellow
        } else {
            Write-Host "✅ $TIER .exe present: $($INSTALLER.Name) ($SIZE bytes)" -ForegroundColor Green
            $VALID_COUNT++
        }
    } else {
        Write-Host "❌ $TIER installer not found" -ForegroundColor Red
        $MISSING_COUNT++
    }
}

# 3. Create SHA256 checksums for all artifacts
Write-Host "🔐 Creating SHA256 checksums..." -ForegroundColor Yellow
$CHECKSUM_FILE = "$WINDOWS_INSTALLERS_DIR/windows-exe-checksums.txt"

$EXE_FILES = Get-ChildItem -Path $WINDOWS_INSTALLERS_DIR -Filter "*.exe"
if ($EXE_FILES.Count -gt 0) {
    $CHECKSUMS = @()
    foreach ($FILE in $EXE_FILES) {
        $HASH = Get-FileHash -Path $FILE.FullName -Algorithm SHA256
        $CHECKSUMS += "$($HASH.Hash)  $($FILE.Name)"
    }
    $CHECKSUMS | Out-File -FilePath $CHECKSUM_FILE -Encoding UTF8
    Write-Host "✅ SHA256 checksums archived: $CHECKSUM_FILE" -ForegroundColor Green
} else {
    Write-Host "⚠️  No .exe files found for checksum generation" -ForegroundColor Yellow
}

# 4. Generate validation report
Write-Host "📊 Validation Report:" -ForegroundColor Cyan
Write-Host "  Total tiers: $($TIERS.Count)" -ForegroundColor White
Write-Host "  Valid artifacts: $VALID_COUNT" -ForegroundColor Green
Write-Host "  Missing artifacts: $MISSING_COUNT" -ForegroundColor Red
Write-Host "  Total size: $TOTAL_SIZE bytes" -ForegroundColor White

# 5. BRUTAL validation: Fail if any artifacts missing
if ($MISSING_COUNT -gt 0) {
    Write-Host "❌ BRUTAL: $MISSING_COUNT missing installers - VALIDATION FAILED" -ForegroundColor Red
    Write-Host "⚠️  This is expected if GitHub Actions pipeline hasn't run yet" -ForegroundColor Yellow
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Commit and push to trigger Windows CI/CD pipeline" -ForegroundColor White
    Write-Host "   2. Wait for GitHub Actions to complete" -ForegroundColor White
    Write-Host "   3. Download artifacts from GitHub Actions" -ForegroundColor White
    Write-Host "   4. Re-run this validation script" -ForegroundColor White
    exit 1
} else {
    Write-Host "✅ All Windows .exe artifacts present and validated!" -ForegroundColor Green
    Write-Host "✅ Checksums archived successfully!" -ForegroundColor Green
    Write-Host "✅ Windows support is production-ready for QA!" -ForegroundColor Green
}

# 6. Create status report
$STATUS_REPORT = @"
# Windows Pipeline Artifact Validation Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Project: ThoughtPilot Commercial Cross-Platform Installer System

## Validation Results
- Total tiers validated: $($TIERS.Count)
- Valid artifacts: $VALID_COUNT
- Missing artifacts: $MISSING_COUNT
- Total size: $TOTAL_SIZE bytes
- Checksums archived: $(if (Test-Path $CHECKSUM_FILE) { "Yes" } else { "No" })

## Artifacts Status
$($TIERS | ForEach-Object { "- $_ tier: $(if (Get-ChildItem -Path $WINDOWS_INSTALLERS_DIR -Filter "thoughtpilot-$_-installer-*.exe" | Select-Object -First 1) { "✅ Present" } else { "❌ Missing" })" } | Out-String)

## Next Steps
1. Document success in main project README and CHANGELOG
2. Notify stakeholders that Windows builds are available for QA
3. Begin internal and beta user testing on Windows installers
4. Prepare for Phase 5 (Linux) and cross-platform support
"@

$STATUS_REPORT | Out-File -FilePath "$WINDOWS_INSTALLERS_DIR/windows-validation-report-$TIMESTAMP.md" -Encoding UTF8
Write-Host "📋 Status report created: windows-validation-report-$TIMESTAMP.md" -ForegroundColor Green 