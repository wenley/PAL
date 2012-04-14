//  Author: Wenley Tong
//  Written: 8 April 2012

//  - - - - - GLOBAL LINK VARIABLES - - - - -
var MasterCourseListClass = "portletList-img courseListing coursefakeclass";
var CoursesTabContentSrc = "/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";
var CoursesTabLink = "https://blackboard.princeton.edu/webapps/portal/frameset.jsp?tab_tab_group_id=_2_1";

var parser = new DOMParser();

var Courses = new Array();

//  - - - - - PERSISTENT VARIABLES - - - - -
var docHeadString = "<head>" + document.head.innerHTML + "</head>\n\n";

//  Gets string of object's class / type
function getClass(s) {
    var c = Object.prototype.toString.apply(s);
    if (c != "[object Object]")
        return c;
    return "[object " + s.constructor.name + "]";
}
