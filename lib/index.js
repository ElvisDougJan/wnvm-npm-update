const { exec } = require('child_process')
const fs = require('fs')

let userFolder = ''
let nodeVersion = ''

function successMessage() {
  exec('npm -v', (err, stoud) => {
    err
      ? console.log(err)
      : console.log(`NPM updated successfully to ${stoud.trim()} version!`)
  })
}

function removeNpmOldFolder() {
  console.log('Removing older NPM version...')
  exec(`rd /s /q ${userFolder}\\AppData\\Roaming\\nvm\\${nodeVersion}\\node_modules\\npm_old`, err => {
    err
      ? console.log(err)
      : successMessage()
  })
}

function runUpdateNpmCommand() {
  console.log('Downloading latest NPM version...')
  exec(`node ${userFolder}\\AppData\\Roaming\\nvm\\${nodeVersion}\\node_modules\\npm_old\\bin\\npm-cli.js i -g npm@latest`,
    err => {
      err
        ? console.log(err)
        : removeNpmOldFolder()
    })
}

function renameOriginalNpmFolder() {
  fs.rename(`${userFolder}\\AppData\\Roaming\\nvm\\${nodeVersion}\\node_modules\\npm`,
    `${userFolder}\\AppData\\Roaming\\nvm\\${nodeVersion}\\node_modules\\npm_old`, err =>
      err
        ? console.log('NVM for Windows not installed!')
        : runUpdateNpmCommand()
  )
}

function collectUserFolderAndNodeVersion() {
  exec('echo %USERPROFILE%', (err, stoud) => {
    if (err) {
      console.log(err)
    } else {
      userFolder = stoud.trim()
      exec('node -v', (err, stoud) => {
        if (err) {
          console.log(err)
        } else {
          nodeVersion = stoud.trim()
          renameOriginalNpmFolder()
        }
      })
    }
  })
}

function detectOperatingSystem() {
  process.platform === 'win32'
    ? collectUserFolderAndNodeVersion()
    : console.log('This package is for Windows system only!')
}

detectOperatingSystem()