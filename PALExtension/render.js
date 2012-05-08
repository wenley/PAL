//  Author: Wenley Tong
//  Written: 10 April 2012

//  Clears the current page and replaces with s
function clearPage(s) {
    if (s == undefined)
        document.documentElement.innerHTML = docHeadString;
    var c = getClass(s);
    if (c == "[object String]")
        document.documentElement.innerHTML = docHeadString + s;
    else if (c == "[object HTMLBodyElement]")
        document.body = s;
    else
       console.warn("Unrecognized class to clear with: " + c);
}

//  Get the user's name from the navigation bar of BB
function getUserFromDoc() {
   var navDoc = document.getElementsByName("nav")[0].contentDocument;
   var userEl = navDoc.getElementById("loggedInUserName");
   if (userEl == null)
      return null;
   else
      return userEl.innerText;
}

//  Gets user name 
function initialize() {
   var userName = getUserFromDoc();
   if (userName != null)
      port.postMessage({note: "user", user: userName});
   else
      var redo = setTimeout(initialize, 50);
}

//  Start chain of either render of mine
initialize();

