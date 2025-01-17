const { exec } = require('child_process');
const path = require('path');

const shortcutPath = './WeWha.lnk';

async function sendMessage() {
    try {
        console.log('Executing shortcut to send WhatsApp message...');
        exec(`"${shortcutPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing shortcut: ${error}`);
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`Shortcut executed successfully: ${stdout}`);
        });
    } catch (error) {
        console.error(`Error in sendMessage function: ${error}`);
    }
}

module.exports = sendMessage;
