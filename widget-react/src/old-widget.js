// get full html code for all the "share" buttons as one string. the titles and urls change according to the resource they would like to share.
let savedShareButtonsHTML;

document.addEventListener("DOMContentLoaded", function(){
  savedShareButtonsHTML = document.getElementById("share-buttons").innerHTML;
});

// finds the value of items in the search query
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){
      return pair[1];
    }
  }
}

// object representing everything about the client: who they are and where they are in the ux/gui.
let client = {
  pic: getQueryVariable("pic") || "none", // partner identification code
  cookieID: ensureCookieID(),
  channel: getQueryVariable("channel") || "",
  language: getQueryVariable("language") || "",
  album: getQueryVariable("album") || "",
  pageNum: 1,
  popup: "none" // which popup window is loaded. only one can be loaded at a time.
};

// updates query based on the state of the client, ommitting the fields that don't yet have a set value
function updateQueryString() {
  let queryCount = 0; // useful for knowing where to insert ?'s and &'s in the query string
  let arguments = [];
  let newSearch = ""
  if (client.pic != "none") {
    arguments.push(["pic", client.pic]);
  }
  if (client.channel != "" && client.pageNum >= 2) {
    arguments.push(["channel", client.channel]);
  }
  if (client.language != "" && client.pageNum >= 3) {
    arguments.push(["language", client.language]);
  }
  if (client.album != "" && client.pageNum >= 3) {
    arguments.push(["album", client.album]);
  }
  if (arguments.length > 0) {
    newSearch = "?"
    for (let i = 0; i < arguments.length; i ++) {
      newSearch += arguments[i][0] + '=' + arguments[i][1];
      if (arguments[i + 1] != null) {
        newSearch += '&';
      }
    }
  } else {
    newSearch = "";
  }
  if (window.location.search != "") {
    history.replaceState({}, "", ".");
  }
  history.replaceState({}, "", newSearch);
}

// changes page number if a channel and album is selected in the query
if (client.channel != "") {
  if (client.language == "") {
    client.pageNum = 2;
  } else {
    client.pageNum = 3;
  }
}

// get song json data
let songs;
fetch('/songs.json')
  .then(res => res.json()).then(data => {
    songs = data;
    if (! Object.keys(songs.channels).some(channel => {
      if (channel.toLowerCase() == client.channel.toLowerCase()) {
        console.log(`Correcting ${client.channel} to ${channel}`)
        client.channel = channel;
        return true
      } else {
        return false
      }
    })) {
      client.channel = ""
    }
    updatePageContent();
  });

// takes a language (object) and a channel name (string). Returns true if the language has a valid link for that channel
function supportsChannel (lang, channelName) {
  return Object.values(lang.albums).some(album => {
    return channelName in album.channels;
  })
}

// make sure that the email address at least looks valid. otherwise, hides the download button
function checkEmailAddress (field) {
  let downloadLink;
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(field.value)) {
    downloadLink = songs.languages[client.language].albums[client.album].channels[client.channel].link;
    document.getElementById("download-link").setAttribute("href", downloadLink);
    document.getElementById("download-link").removeAttribute("disabled");
  } else {
    document.getElementById("download-link").removeAttribute("href");
    document.getElementById("download-link").setAttribute("disabled", "");
  }
}

function addEmail() {
  // Sending data in a header
  let xhr = new XMLHttpRequest();
  let url = "../mailingList";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("emailAddress", document.getElementById("download-email").value);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("Added email to database");
    }
  };
}

function updatePageContent () {
  let infoScreen = document.getElementById("info-screen");
  let shareScreen = document.getElementById("share-screen");
  let downloadScreen = document.getElementById("download-screen");
  updateQueryString();

  // show or hide info screen
  if (client.popup == "info-screen") {
    infoScreen.style.visibility = "visible";
    infoScreen.style.opacity = "1";
    let infoHeader = songs.languages[client.language].albums[client.album].line2;
    let infoContent = songs.languages[client.language].albums[client.album].info;
    document.getElementById("info-header").innerHTML = infoHeader;
    document.getElementById("info-text").innerHTML = infoContent;
  } else {
    infoScreen.style.opacity = "0";
    setTimeout(() => {
      infoScreen.style.visibility = "hidden";
    }, 200);
  }

  // show or hide share screen
  if (client.popup == "share-screen") {
    document.getElementById("share-buttons").innerHTML = savedShareButtonsHTML.replace("THISURL", window.location.href);
    document.getElementById("share-buttons").innerHTML.replace("THISTITLE", "Free music and more from Songs For Saplings!");
    shareScreen.style.visibility = "visible";
    shareScreen.style.opacity = "1";
  } else {
      shareScreen.style.opacity = "0";
    setTimeout(() => {
      shareScreen.style.visibility = "hidden";
    }, 200);
  }

  // show or hide download screen
  if (client.popup == "download-screen") {
    downloadScreen.style.visibility = "visible";
    downloadScreen.style.opacity = "1";
  } else {
      downloadScreen.style.opacity = "0";
    setTimeout(() => {
      downloadScreen.style.visibility = "hidden";
    }, 200);
  }

  // a list of element selectors for each dynamic element, the property name, and its value on pages 1, 2, and/or 3
  changingStyles = [
    ["#selected-channel", "visibility",  "hidden", "visible" , "visible" ],
    ["#selected-language", "visibility", "hidden", "hidden", "visible" ],
    ["#back-container", "visibility", "hidden", "visible" , "visible" ],
    ["#dropdown-channel", "visibility", "visible" , "hidden", "hidden"],
    ["#dropdown-language", "visibility", "hidden", "visible" , "hidden"],
    ["#dropdown-album", "visibility", "hidden", "hidden", "visible" ],
    [".hint-arrow", "display", "inline", "inline", "none"],
    ["#selected-gap", "visibility", "hidden", "visible", "visible"],
    ["#page-1-padding", "visibility", "visible", "hidden", "hidden"]
  ];
  // updates which elements are visible, according to the above list
  for (let i = 0; i < changingStyles.length; i ++) {
    let nodes = document.querySelectorAll(changingStyles[i][0]);
    let styleName = changingStyles[i][1];
    let value = changingStyles[i][client.pageNum + 1];
    for (let j = 0; j < nodes.length; j ++) {
      nodes[j].style[styleName] = value;
    }
  }

  // a list of element ids for each dynamic element, as well as their text on pages 1, 2, and 3
  textValues = [
    ["#prompt", "How do you<br>listen to music?", "What language<br>do you speak?", "What Volume<br>would you like?"],
    ["#selected-channel", "SELECTED: " + client.channel.toUpperCase()],
    ["#selected-language", "SELECTED: " + client.language.toUpperCase()],
    ["#hint", "SELECT A SOURCE", "CHOOSE A LANGUAGE", "CHOOSE YOUR MUSIC<br>AND THAT'S IT!"],
  ];
  // updates the content of text boxes according to the above list
  for (let i = 0; i < textValues.length; i ++) {
    let nodes = document.querySelectorAll(textValues[i][0]);
    let innerText = textValues[i][Math.min(client.pageNum, textValues[i].length - 1)];
    for (let j = 0; j < nodes.length; j ++) {
      nodes[j].innerHTML = innerText;
    }
  }

  if (songs != null) {
    if (client.pageNum == 1) {
      document.getElementById("dropdown-channel").innerHTML = "";
      document.getElementById("dropdown-language").innerHTML = "";
      document.getElementById("dropdown-album").innerHTML = "";
      window.scrollTo(0, 0);

      // list of channel names with at least one link to them, excluding the "All" channel
      let supportedChannels = Object.keys(songs.channels).filter(chan => {
        return chan != "All" && Object.values(songs.languages).some(lang => {
          return supportsChannel(lang, chan);
        });
      });

      // display supported channels
      supportedChannels.forEach(name => {
        let path = songs.channels[name].path;
        let nameCaps = name.toUpperCase();
        let dropdownContents = `<img className="dropdown-logo" src="${path}" alt="${nameCaps}"></img>`;
        if (path == null) {
          dropdownContents = `<p className="dropdown-text">${nameCaps}</p>`;
        }
        let dropdown = `<div className="dropdown-option" onclick="sfsButtonClicked('select-channel', this)" data-channel="${name}">${dropdownContents}</div>`;
        document.getElementById("dropdown-channel").innerHTML += dropdown;
      });
      document.getElementById("dropdown-channel").innerHTML += `<div style="height:3vh"></div>`;

    } else if (client.pageNum == 2) {
      document.getElementById("dropdown-channel").innerHTML = "";
      document.getElementById("dropdown-language").innerHTML = "";
      document.getElementById("dropdown-album").innerHTML = "";
      window.scrollTo(0, 0);

      // find the available languages for this channel
      let supportedLanguages = Object.keys(songs.languages).filter(language => {
        return supportsChannel(songs.languages[language], client.channel);
      });

      // display supported languages
      supportedLanguages.forEach(language => {
        let autonym = songs.languages[language].autonym;
        let dropdown = `<div className="dropdown-option" onclick="sfsButtonClicked('select-language', this)" data-language="${language}"><p className="dropdown-text">${autonym}</p></div>`;
        document.getElementById("dropdown-language").innerHTML += dropdown;
      });
      document.getElementById("dropdown-language").innerHTML += `<div style="height:3vh"></div>`;

    } else if (client.pageNum == 3) {
      document.getElementById("dropdown-channel").innerHTML = "";
      document.getElementById("dropdown-language").innerHTML = "";
      document.getElementById("dropdown-album").innerHTML = "";
      window.scrollTo(0, 0);

      let allAlbums = songs.languages[client.language].albums;
      // only include albums supported by the specific channel or by all channels
      let supportedAlbums = Object.keys(allAlbums).filter(album => {
        return client.channel in allAlbums[album].channels || "All" in allAlbums[album].channels;
      });
      supportedAlbums.sort((a, b) => {return allAlbums[a].order - allAlbums[b].order});
      supportedAlbums.forEach(id => {
        let album = songs.languages[client.language].albums[id];

        // defaults to non-channel-specific url, if it exists
        let link;
        if ("All" in album.channels) {
          link = album.channels.All.link;
        }

        // switches to a channel-specific url if there is one for that album
        if (client.channel in album.channels) {
          link = album.channels[client.channel].link;
        }

        let actionType = 'open-album';
        let line1 = album.line1;
        if (line1 != null) {
          line1 = `<div>${line1}</div>`;
        } else {
          line1 = "";
        }
        let line2 = "<u>" + album.line2 + "</u>";
        let hrefTags = `href="${link}" target="_blank"`;
        if (client.channel == "Download") {
          actionType = 'download-screen';
          hrefTags = "";
        }
        let dropdown =
          `<div className="dropdown-option" data-id="${id}">
            <a className="dropdown-text" onclick="sfsButtonClicked('${actionType}', this)" ${hrefTags}>${line1}${line2}</a>
            <div>
              <img src="./resources/ui/info.svg" alt="Info" onclick="sfsButtonClicked('info-screen', this)"></img>
              <img style="visibility: hidden" src="./resources/ui/share.svg" alt="Share" onclick="sfsButtonClicked('share-screen', this)"></img>
            </div>
          </div>`
        document.getElementById("dropdown-album").innerHTML += dropdown;
      });
      document.getElementById("dropdown-album").innerHTML += `<div style="height:3vh"></div>`;
    }
  }
}

function sfsButtonClicked (actionType, button) {
  // sends each button click to the server after deciding what to do with it
  if (actionType == "back") {
    client.pageNum --;
  } else if (actionType == "select-channel") {
    client.channel = button.dataset.channel;
    client.pageNum ++;
  } else if (actionType == "select-language") {
    client.language = button.dataset.language;
    client.pageNum ++;
  } else if (actionType == "open-album") {
    client.album = button.parentElement.dataset.id;
  } else if (actionType == "sfs-website") {
  } else if (actionType == "info-screen") {
    client.album = button.parentElement.parentElement.dataset.id;
    client.popup = "info-screen";
  } else if (actionType == "share-screen") {
    client.album = button.parentElement.parentElement.dataset.id;
    client.popup = "share-screen";
  } else if (actionType == "download-screen") {
    client.album = button.parentElement.dataset.id;
    client.popup = "download-screen";
  } else if (actionType == "share") {
  } else if (actionType == "exit-screen") {
    client.popup = "none";
  } else {
    console.log("Invalid action type!");
  }
  setTimeout(updatePageContent, 100);

  // Sending data in a header
  let xhr = new XMLHttpRequest();
  let url = "../analytics";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("pic", client.pic);
  xhr.setRequestHeader("cookieID", client.cookieID);
  xhr.setRequestHeader("actionType", client.actionType);
  xhr.setRequestHeader("pageNum", client.pageNum);
  xhr.setRequestHeader("channel", client.channel);
  xhr.setRequestHeader("language", client.language);
  xhr.setRequestHeader("album", client.album);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
    }
  };
}

function setCookie (cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie (cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// cookie expires in a year
function ensureCookieID () {
  if (getCookie("cookieID") == "") {
    let newID = Math.floor(10000000000000000*Math.random());
    setCookie("cookieID", newID.toString(), 365);
  }
  return getCookie("cookieID");
}
