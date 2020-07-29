function startTime() {
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var ap ="";
  var today = new Date();
  var y = today.getFullYear();
  var m = months[today.getMonth()];
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  if(h > 12) { h = h - 12};
  h > 12 ? ap = "PM": ap = "AM";
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('datetime').innerHTML = d + " " + m +  " " + y + " | " + h + ":" + mi + ":" + s + " " + ap;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};
  return i;
}
