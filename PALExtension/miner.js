//  Author: Wenley Tong
//  Written: 8 April 2012
//  miner.js

//  Takes an array of [Course Title, Course page link] arrays
//  Does sanity check, then gets the texts of all course pages
function getCourseChain(a) {
   //  Funky way of getting all the pages
    function nextRequest() {
        if (this.readyState == 4 && this.status == 200) {
            //  Makes the new Course
            var name = a[this.i][0];
            var semester = name.match(/(F|S)\d{4}/g)[0];
            var c = new Course();
            c.title = name;
            c.semester = semester;
            var short = name.substr(0, 6);
            c.key = short;
            if (Courses == null)
               Courses = {};
            if (Courses[c.semester] == undefined)
               Courses[c.semester] = {};
            Courses[c.semester][c.key] = c;
            
            //  Get document
            var contentFrameTag = this.responseText.match(/<frame[^>]*name="content"[^>]*>/g)[0];
            var contentFrameSrc = contentFrameTag.match(/src=\"[^ \"]*/g)[0].slice(5);
            //  Slice chops off src="
            
            //  Form link to desired page
            var link = bbDomain;
            if (contentFrameSrc.substr(0, 5) == "https")
                link = contentFrameSrc;
            else
                link += contentFrameSrc;
            
            c.contentLink = link;
            getContentDoc(link, mineCourse, Courses[c.semester][c.key]);
            
            //  Check to see if need to do more
            this.i = this.i + 1;
            if (this.i >= a.length) {
                return;
            }
            
            //  Get next page
            //  Somehow has access to the variable a, even though only
            //  called in the context of req2
            link = "https://blackboard.princeton.edu" + a[this.i][1];
            this.open("GET", link, true);
            this.send();
            XMLincrement();
        }
    }
   
    //  Get all pages sequentially
    var req = new XMLHttpRequest();
    req.i = 0;
    link = "https://blackboard.princeton.edu" + a[req.i][1];
    req.open("GET", link, true);
   
    //  Start the chain reaction
    req.onreadystatechange = function () {
       if (req.readyState == 4 && req.status == 200) {
          nextRequest.call(req);
          XMLdecrement();
       }
       else if (req.readyState == 4 && req.status != 200) {
          console.warn("ERROR. miner's initial request failed. Status: " + req.status);
          XMLdecrement();
       }
    }
    req.send();
    XMLincrement();
}


//  Debugging function. Only calls mining on a single course passed as a name
//  and a link in argument a
function testSingleCourse(a) {
    var req = new XMLHttpRequest();
    req.open("GET", a[1], true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
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
    if (Courses != null) {
       mineFromLinks();
    }
    else { try {
       //  Check to make sure on Courses
       //  Can't start mine from scratch if not on Courses
       var contentFrame = redirectToCourses();
       
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
       //  port.postMessage({note: "expected", expected: classesAndLinks.length});
       showLoadingBar();
       getCourseChain(classesAndLinks);
    } catch (e) {
       var tryAgain = setTimeout(mineBB, 1000); //  1 second later
       return;
       }
    }
    var reMine = setTimeout(mineBB, 300000); //  5 minutes later
}

function showLoadingBar() {
   clearPage("<body></body>");
   var body = document.body;
   var centeredDiv = document.createElement("div");
   centeredDiv.setAttribute("class", "loadingStatus");
   var status = document.createElement("p");
   status.innerText = "Loading .";
   var update = setTimeout(function () {
         if (status.innerText == "Loading . . . . .")
            status.innerText = "Loading .";
         else
            status.innerText = status.innerText + " .";
         if (status.innerText.substr(0, 7) == "Loading")
            var up = setTimeout(arguments.callee, 1000);
      }, 1000);   
   centeredDiv.appendChild(status);
   body.appendChild(centeredDiv);

   //  Set what happens once done mining
   setXMLcallback(function() {
         var delay = setTimeout(function () {
               pushCourses(Courses);
               status.innerText = "Done!";
               document.location.href = document.location.href;
            }, 1000);
      });
}


//  Remines courses from existing links
function mineFromLinks() {
   if (Courses == null) {
      console.warn("Improper call to mineFromLinks. Called when Courses is null.");
      return;
   }

   //  Build an array with course objects and their respective content page links
   var info = new Array();
   var NewCourses = new Object();
   for (var semester in Courses) {
      NewCourses[semester] = new Object();
      for (var courseKey in Courses[semester]) {
         var course = Courses[semester][courseKey];
         var c = new Course();
         c.title = course.title;
         c.key = course.key;
         c.contentLink = course.contentLink;
         getContentDoc(course.contentLink, mineCourse, c);
         NewCourses[semester][courseKey] = c;
      }
   }

   setXMLcallback(function() {
         console.log("Pushing...");
         console.log(NewCourses);
         pushCourses(NewCourses);
      });
}
