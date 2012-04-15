//  Author: Wenley Tong
//  Written: 8 April 2012

//  - - - - - General Functions - - - - -

//  Takes an array of [Course Title, Course page link] arrays
//  Does sanity check, then gets the texts of all course pages
function writeArray(a) {
   //  Funky way of getting all the pages
    function nextRequest() {
        if (this.readyState == 4 && this.status == 200) {
            var name = a[this.i][0];
            Courses[name] = new Course();
            Courses[name].title = a[this.i][0];
            Courses[name].contentLink = a[this.i][1];
            
            //  Get document
            var contentFrameTag = this.responseText.match(/<frame[^>]*name="content"[^>]*>/g)[0];
            var contentFrameSrc = contentFrameTag.match(/src=\"[^ \"]*/g)[0].slice(5);
            //  Slice chops off src="
            
            //  Form link to desired page
            var link = "https://blackboard.princeton.edu";
            if (contentFrameSrc.substr(0, 5) == "https")
                link = contentFrameSrc;
            else
                link += contentFrameSrc;
            
            getContentDoc(link, mineCourse, Courses[name]);
            
            //  Check to see if need to do more
            this.i = this.i + 1;
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
    var req = new XMLHttpRequest();
    req.i = 0;
    link = "https://blackboard.princeton.edu" + a[req.i][1];
    req.open("GET", link, true);
   
    //  Start the chain reaction
    req.onreadystatechange = function () {
        nextRequest.call(req);
    }
    req.send();
}

function testSingleCourse(a) {
    var req = new XMLHttpRequest();
    req.open("GET", a[1], true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log("Success in redirect");
            var c = new Course();
            c.title = a[0];

            //  Get document
            var contentFrameTag = this.responseText.match(/<frame[^>]*name="content"[^>]*>/g)[0];
            var contentFrameSrc = contentFrameTag.match(/src=\"[^ \"]*/g)[0].slice(5);
            //  Slice chops off src="
            
            //  Form link to desired page
            var link = "https://blackboard.princeton.edu";
            if (contentFrameSrc.substr(0, 5) == "https")
                link = contentFrameSrc;
            else
                link += contentFrameSrc;
            
            getContentDoc(link, mineCourse, c);
        }
    }
    req.send();
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
    for (var i = 0; i < classLinkList.length; i++) {
        var a = new Array();
        a[0] = classLinkList[i].innerText;
        
        //  Links on Courses have leading spaces
        a[1] = classLinkList[i].getAttribute("href").substr(1);
        classesAndLinks[i] = a;
    }

    classesAndLinks.i = 0;
//    testSingleCourse(classesAndLinks[0]);
    writeArray(classesAndLinks);
//    var reMine = setTimeout("mineBB();", 300000);
}

var t = setTimeout("mineBB();", 3000);

var q = setTimeout("console.log(Courses)", 55000);

