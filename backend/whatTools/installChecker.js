const fs = require('fs');
const { exec } = require('child_process');

const installerPath = './WeWhaInstaller.exe';
const shortcutPath = './WeWha.lnk';

function checkAndRunInstaller() {
    if (!fs.existsSync(shortcutPath)) {
        console.log('Shortcut not found. Running installer...');
        exec(`"${installerPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing installer: ${error}`);
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`Installer output: ${stdout}`);
        });
    } else {
        console.log('Shortcut found. No need to run installer.');
    }
}

module.exports = checkAndRunInstaller;
