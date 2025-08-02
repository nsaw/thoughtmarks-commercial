[Setup]
AppName=ThoughtPilot Enterprise
AppVersion=1.0.0
DefaultDirName={autopf}\ThoughtPilot-Enterprise
DefaultGroupName=ThoughtPilot Enterprise
OutputDir=../distributions/windows-installers
OutputBaseFilename=thoughtpilot-enterprise-installer
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1; Check: not IsAdminInstallMode

[Files]
Source: "../clean-tier-packages/thoughtpilot-enterprise/*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\ThoughtPilot Enterprise"; Filename: "{app}\thoughtpilot.exe"
Name: "{group}\{cm:UninstallProgram,ThoughtPilot Enterprise}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\ThoughtPilot Enterprise"; Filename: "{app}\thoughtpilot.exe"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\ThoughtPilot Enterprise"; Filename: "{app}\thoughtpilot.exe"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\thoughtpilot.exe"; Description: "{cm:LaunchProgram,ThoughtPilot Enterprise}"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
end; 