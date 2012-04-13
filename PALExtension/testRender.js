//  Author: Wenley Tong
//  Written: 10 April 2012

function clearPage(s) {
   if (Object)
   if (s != undefined)
      document.documentElement.innerHTML = s;
   else
      document.documentElement.innerHTML = "";
}

function copyFromBackground() {
   console.log("Attempt copy over...");
   //  console.log(chrome.extension.getBackgroundPage());
}

var q = setTimeout("console.log(Courses);", 20000);
var qw = setTimeout("testPush();", 5000);
var qwer = setTimeout("copyFromBackground();", 20000);
