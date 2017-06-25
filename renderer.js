// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { remote } = require('electron')
const currentWindow = remote.getCurrentWindow()

const startWorkViewEl = document.querySelector('#startWorkView')
const startBreakViewEl = document.querySelector('#startBreakView')
const breakActiveViewEl = document.querySelector('#breakActiveView')
const leftBreakEl = document.querySelector('#leftBreak')

const workLength = 50 * 60 * 1000;
const breakLength = 5 * 60 * 1000;
const updateBreakTimerLength = 1000;

let updateBreakInterval;
let breakTimeLeft = breakLength;

function startWork() {
  clearInterval(updateBreakInterval)
  breakTimeLeft = breakLength
  setLeftBreakEl()
  setTimeout(showBreakNotification, workLength)
  currentWindow.hide()
  startWorkViewEl.style = 'display:none';
  startBreakViewEl.style = '';
  breakActiveViewEl.style = 'display:none';
}

function startBreak() {
  updateBreakInterval = setInterval(updateBreakTimer, updateBreakTimerLength)
  startWorkViewEl.style = 'display:none';
  startBreakViewEl.style = 'display:none';
  breakActiveViewEl.style = '';
}

function updateBreakTimer() {
  breakTimeLeft -= updateBreakTimerLength;
  setLeftBreakEl()
}

function setLeftBreakEl() {
  let minutes = breakTimeLeft / (60 * 1000)
  minutes = (breakTimeLeft < 0) ? Math.ceil(minutes) : Math.floor(minutes)
  let seconds = Math.abs(parseInt(((breakTimeLeft - (minutes * 60 * 1000))) / 1000))
  minutes = Math.abs(parseInt(minutes))
  leftBreakEl.innerHTML = `${breakTimeLeft < 0 ? '-' : ''}${minutes}:${seconds}`
}

function showBreakNotification() {
  let myNotification = new Notification('Pause', {
    body: 'Hey du solltest unbedingt eine Pause machen'
  })

  myNotification.onclick = () => {
    currentWindow.show()
    startBreak()
  }
}

document.querySelector('#startWork').addEventListener('click', startWork)
document.querySelector('#startBreak').addEventListener('click', startBreak)
document.querySelector('#backToWork').addEventListener('click', startWork)