//  Author: Wenley Tong
//  Written: 10 April 2012

//  Clears the current page and replaces with s
function clearPage(s) {
   if (s == undefined)
      document.documentElement.innerHTML = docHeadString;
   else if (Object.prototype.toString.apply(s) == "[object String]")
      document.documentElement.innerHTML = docHeadString + s;
   else if (Object.prototype.toString.apply(s) == "[object HTMLBodyElement]")
      document.body = s;
   else
      console.log(Object.prototype.toString.apply(s));
}

//  Gets
function copyFromBackground() {
   console.log("Attempt copy over...");
   port.postMessage({request: "template.html"});
}

var q = setTimeout("console.log(Courses);", 20000);
var qw = setTimeout("testPush();", 5000);
var qwer = setTimeout("copyFromBackground();", 20000);
