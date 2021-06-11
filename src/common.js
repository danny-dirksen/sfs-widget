// common functions that I reuse in multiple components
let common = {}

// make sure that the email address at least looks valid. otherwise, hides the download button
common.validEmail = (email) => {
  let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  return emailRegex.test(email)
}

common.getQueryVariable = (variable) => {
  if (!variable) {
    return null
  }
  var query = window.location.search.substring(1);
  var vars = query.split("&")
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=")
    if(pair[0] === variable){
      return decodeURI(pair[1])
    }
  }
  return null
}

// updates query based on the state of the client, ommitting the fields that don't yet have a set value
common.queryFromState = (client) => {
  let args = [];
  let newSearch = ""
  if (client.pic) {
    args.push(["pic", client.pic]);
  }
  if (client.channel) {
    args.push(["channel", client.channel]);
  }
  if (client.language) {
    args.push(["language", client.language]);
  }
  if (client.resource) {
    args.push(["resource", client.resource]);
  }
  if (args.length > 0) {
    newSearch = "?"
    for (let i = 0; i < args.length; i ++) {
      newSearch += args[i][0] + '=' + args[i][1];
      if (args[i + 1]) {
        newSearch += '&';
      }
    }
  } else {
    newSearch = "";
  }
  return newSearch;
}

common.setCookie = (cname, cvalue, exdays) => {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

common.getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

common.ensureCookieID = () => { // cookie expires in a year
  if (common.getCookie("cookieID") === "") {
    let newID = Math.floor(10000000000000000*Math.random());
    common.setCookie("cookieID", newID.toString(), 365);
  }
  return common.getCookie("cookieID");
}

common.clearCookies = () => {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var spcook =  cookies[i].split("=");
    deleteCookie(spcook[0]);
  }
  function deleteCookie(cookiename) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var expires = ";expires="+d;
    var name=cookiename;
    //alert(name);
    var value="";
    document.cookie = name + "=" + value + expires + ";";
  }
}

common.ajax = (method, path, args = {}) => {
  var req = new XMLHttpRequest()
  req.open(method, window.location.origin + path)
  req.setRequestHeader('content-type', 'application/json;charset=UTF-8')
  req.send(JSON.stringify(args))
}

export default common
