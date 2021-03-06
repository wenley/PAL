//  Author: Wenley Tong
//  Written: 8 April 2012

//  - - - - - GLOBAL LINK VARIABLES - - - - -
var bbDomain = "https://blackboard.princeton.edu";

var MasterCourseListClass = "portletList-img courseListing coursefakeclass";
var CoursesTabContentSrc = "/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_121_1";
var CoursesTabLink = bbDomain + "/webapps/portal/frameset.jsp?tab_tab_group_id=_121_1";

var parser = new DOMParser();

var Courses = null;

var Diffs = new Object();

// - - - - - IMAGE STATE VARIABLES - - - - -

//  Current course object whose content is being displayed
var selectedCourse = null;

//  Current semester containing selectedCourse
var selectedSemester = null;
var selectedSemName = "";

//  Current tab selected
var selectedTab = null;

//  Current hierarchy of folder stack trace
var folderTrace = new Array();

//  Centralizes changing of selected objects to make storing
//  current states easier
function setSelectedCourse(c) {
   selectedCourse = c;
   saveState();
}
function setSelectedSemester(sem, s) {
   selectedSemester = sem;
   if (s != undefined)
      selectedSemName = s;
   saveState();
}
function setSelectedTab(t) {
   selectedTab = t;
   saveState();
}

//  - - - - - PERSISTENT VARIABLES - - - - -
var docHeadString = "<head>" + document.head.innerHTML + "</head>\n\n";

//  Gets string of object's class / type
function getClass(s) {
    var c = Object.prototype.toString.apply(s);
    if (c != "[object Object]")
        return c;
    return "[object " + s.constructor.name + "]";
}

//  Is s a user-defined Object or generic?
function isObject(s) {
   return Object.prototype.toString.apply(s) == "[object Object]";
}

//  Is s a string?
function isString(s) {
   return getClass(s) == "[object String]";
}

//  Is a an array?
function isArray(a) {
   return getClass(a) == "[object Array]";
}

//  - - - - - XMLHttpRequest NEW METHODS - - - - -
function XMLincrement() {
   if (XMLHttpRequest.prototype.count == undefined)
      XMLHttpRequest.prototype.count = 0;
   XMLHttpRequest.prototype.count++;
};

function XMLdecrement() {
   XMLHttpRequest.prototype.count--;
  if (XMLHttpRequest.prototype.count < 0) {
      console.warn("Something went wrong...");
   }
   if (XMLHttpRequest.prototype.count == 0) {
      var verify = setTimeout(function () {
            if (XMLHttpRequest.prototype.count == 0)
               XMLHttpRequest.prototype.onZero();
         }, 1000);
   }
};

function setXMLcallback(callback) {
   XMLHttpRequest.prototype.onZero = callback;
}
XMLHttpRequest.prototype.onZero = function () {
   console.log("XML called the callback!"); // !!!
}