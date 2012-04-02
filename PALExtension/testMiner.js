//  GLOBAL LINK VARIABLES
var MasterCourseListClass = "portletList-img courseListing coursefakeclass";
var CoursesTabLink = "https://blackboard.princeton.edu/webapps/portal/frameset.jsp?tab_tab_group_id=_2_1";
var CoursesTabContentSrc = "/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";

var parser = new DOMParser();



//  Redirects the user to Courses tab
function redirectToCourses() {
    console.log("Attempt redirect");
    document.location.href = CoursesTabLink
}


//  Mines content from an element of the sidebar of a course page
function mineSidebar() {
    console.log('In sidebar');
}


//  Given a course page document, mines the course page
function mineCourse(contentText) {
    console.log('In class');
    
    //  Show uniqueness of contentTexts
    //  Can be verified
    console.log(contentText.match(/var course_id = ".*";/g));
}

//  Extracts the content document text from a generic Blackboard page
//  Requires String pageText and callback to continueFunc which will
//  be called when the page finishes loading
function getContentDoc(pageText, continueFunc) {
   //  Get proper source link
    var contentFrameTag = pageText.match(/<frame[^>]*name="content"[^>]*>/g)[0];
    var contentFrameSrc = contentFrameTag.match(/src=\"[^ \"]*/g)[0].slice(5);
    //  Slice chops off src="

    //  Form link to desired page
    var link = "https://blackboard.princeton.edu";
    if (contentFrameSrc.substr(0, 5) == "https")
       link = contentFrameSrc;
    else
       link += contentFrameSrc;

    // Make request
    var req = new XMLHttpRequest();
    req.open("GET", contentFrameSrc, true);
    req.onreadystatechange = function () {
       if (req.readyState == 4 && req.status == 200) {
          continueFunc(req.responseText);
       }
    }
    req.send();
}

//  Takes an array of [Course Title, Course page link] arrays
//  Does sanity check, then gets the texts of all course pages
function writeArray(a) {

   //  Funky way of getting all the pages
   function nextRequest() {
      if (this.readyState == 4 && this.status == 200) {
         //  Show part of text; Eventually replace with Get document
//         console.log(this.responseText.substr(150,40));
         getContentDoc(this.responseText, mineCourse);
         
         //  Check to see if need to do more
         this.i = this.i + 1;
//         console.log(this.i);
         if (this.i >= a.length) {
            console.log("Stopping page loading process...");
            return;
         }
         
         //  Get next page
         //  Somehow has access to the variable a, even though only
         //  called in the context of req2
         link = "https://blackboard.princeton.edu" + a[this.i][1];
         this.open("GET", link, true);
         this.onreadstatechange = function () {
            nextRequest.call(this);
         }
         this.send();
      }
   }
   
   //  Get all pages sequentially
   var req2 = new XMLHttpRequest();
   req2.i = 0;
   req2.docs = new Array();
   link = "https://blackboard.princeton.edu" + a[req2.i][1];
   req2.open("GET", link, true);
   
   //  Start the chain reaction
   req2.onreadystatechange = function () {
      nextRequest.call(req2);
   }
   req2.send();
}

//  The big function. The function that starts the mining of
//  EVERYTHING out of Blackboard
function mineBB() {
    console.log('In general miner');
    
    //  Check to make sure on Courses
    var contentFrame = document.getElementsByName("content")[0];
    if (contentFrame.getAttribute("src") != CoursesTabContentSrc)
        redirectToCourses();
    
    //  Print Class Names and Links
    var contentDoc = contentFrame.contentDocument;
    var classListElem = undefined;
    classListElem = contentDoc.getElementsByClassName(MasterCourseListClass)[0];
    var classLinkList = classListElem.getElementsByTagName("a");
    
    var classesAndLinks = new Array();
    for (i = 0; i < classLinkList.length; i++) {
        var a = new Array();
        a[0] = classLinkList[i].innerText;
        
        //  Links on Courses have leading spaces
        a[1] = classLinkList[i].getAttribute("href").substr(1);
        classesAndLinks[i] = a;
    }
    writeArray(classesAndLinks);
}

var t = setTimeout("mineBB();", 3000);