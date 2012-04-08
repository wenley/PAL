//  Author: Wenley Tong
//  Written: 8 April 2012

//  - - - - - USEFUL FUNCTIONS - - - - -

//  Redirects the user to Courses tab
function redirectToCourses() {
    console.log("Attempt redirect");
    document.location.href = CoursesTabLink
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
