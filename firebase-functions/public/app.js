var root = window.location.protocol + "//" + window.location.host;

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function gotoManual() {
  window.location.assign(root)
}

function gotoSchedule() {
  window.location.assign(root + "/schedule.html")
}

function gotoLogViewer() {
  window.location.assign(root + "/logViewer.html")
}

function newSchedule() {
  window.location.assign(root + "/newSchedule.html")
}
