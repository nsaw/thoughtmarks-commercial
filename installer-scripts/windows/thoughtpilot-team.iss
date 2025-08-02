[Setup]
AppName=ThoughtPilot Team
AppVersion=1.0.0
DefaultDirName={autopf}\ThoughtPilot-Team
DefaultGroupName=ThoughtPilot Team
OutputDir=../distributions/windows-installers
OutputBaseFilename=thoughtpilot-team-installer
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
Source: "../clean-tier-packages/thoughtpilot-team/*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\ThoughtPilot Team"; Filename: "{app}\thoughtpilot.exe"
Name: "{group}\{cm:UninstallProgram,ThoughtPilot Team}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\ThoughtPilot Team"; Filename: "{app}\thoughtpilot.exe"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\ThoughtPilot Team"; Filename: "{app}\thoughtpilot.exe"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\thoughtpilot.exe"; Description: "{cm:LaunchProgram,ThoughtPilot Team}"; Flags: nowait postinstall skipifsilent

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
end; 