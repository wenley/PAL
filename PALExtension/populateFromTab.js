//  Author: Wenley Tong
//  Written: 23 April 2011
//  popTabs.js

//  Performs population of the page when a tab is clicked

function populateFromTab(semester, courseKey, attribute) {
   
    //  Validate inputs; should never be invalid
    var sem = Courses[semester];
    if (sem == undefined || sem == null) {
        throw "Not a valid semester: " + semester;
        return;
    }
    var course = sem[courseKey];
    if (course == undefined || course == null) {
        throw "In semester " + semester + ", not a valid course: " + courseKey;
        return;
    }
    var attr = course[attribute];
    if (attr == undefined || attr == null) {
        throw "In (semester, course) = (" + semester + ", " + course + "), not a valid attribute: " + attribute;
        return;
    }
    
    if (attribute == "announcements") {
       for (var entry in attr) 
      
}