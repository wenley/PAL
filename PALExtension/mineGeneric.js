//  Author: Wenley Tong
//  Written: 8 April 2012

//  - - - - - USEFUL FUNCTIONS - - - - -

//  Ensures the user is on the Courses tab
function redirectToCourses() {
    var contentFrame = document.getElementsByName("content")[0];
    if (contentFrame.getAttribute("src") != CoursesTabContentSrc) {
        console.log("Redirecting...");
        document.location.href = CoursesTabLink;
    }
    else
       return contentFrame;
}

//  Takes a link to a page and a callback to continueFunc
//  Will call continueFunc on the contents of the page's
//  Content document
function getPageContentDoc(pageLink, continueFunc) {
   var req = new XMLHttpRequest();
   req.open("GET", pageLink, true);
   req.onreadystatechange = function () {
      var frameTag = req.responseText.match(/<frame[^>]*name="content"[^>]*>/g)[0];
      var frameLink = frameTag.match(/src=\"[^ \"]*/g)[0].slice(5);
      getContentDoc(frameLink, continueFunc);
   }
   req.send();
}

//  Extracts the content document text from a generic Blackboard page
//  Requires String pageText and callback to continueFunc which will
//  be called when the page finishes loading
function getContentDoc(docLink, continueFunc, course) {
   // Make request
   var req = new XMLHttpRequest();
   req.open("GET", docLink, true);
   req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
         continueFunc(req.responseText, course);
      }
   }
   req.send();
}

//  Removes & from strings
function cleanLink(s) {
   return s.replace(/&/g, "&amp;");
}

//  Recursively replaces empty fields of objects for ease
//  of checking population
function cleanObj(obj) {
   if (isString(obj) && obj.length == 0)
      return null;
   if (isArray(obj) && obj.length == 0)
      return null;
   if (isArray(obj) || isObject(obj)) {
      for (var entry in obj)
         obj[entry] = cleanObj(obj[entry]);
   }
   return obj;
}

//  Replaces empty arrays with nulls for ease of checking population
function cleanCourse(course) {
   for (var key in course) {
      if (course[key].length == 0)
         course[key] = null;
   }
   return course;
}

//  Prepends all links with https://blackboard.princeton.edu
//  if they don't already have it.
function fixLink(s) {
   if (s.substr(0, 19) != "https://blackboard.")
      s =  bbDomain + s;
   return s;
}