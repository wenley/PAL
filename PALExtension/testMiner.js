//  - - - - - GLOBAL LINK VARIABLES - - - - -
var MasterCourseListClass = "portletList-img courseListing coursefakeclass";
var CoursesTabLink = "https://blackboard.princeton.edu/webapps/portal/frameset.jsp?tab_tab_group_id=_2_1";
var CoursesTabContentSrc = "/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1";

var parser = new DOMParser();


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


//  - - - - - SIDEBAR FUNCTIONS - - - - -
//  Takes course content document's sidebar link for Course Description
//  Gets link to registrar's course description page
function mineCourseDescription(sidebarLink, course) {
    var req = new XMLHttpRequest();
    req.open("GET", sidebarLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var line = req.responseText.match(/window.open(.*);/g);
            if (line == null) {
                line = req.responseText.match(/window.location(.*);/g);
                if (line == null) {
                    console.log(req.responseText);
                    return;
                }
            }
            var link = line[0].match(/"https:[^\"]*"/g)[0];
            console.log(link);
            course.descriptionLink = link;
        }
    }
    req.send();
}

function extractContacts(textArea, course) {
   console.log("Extracting...");

    //  Alternate h3 and div class details tags
    var hStart = 0;
    var hEnd = 0;
    var divStart = 0;
    var divEnd = 0;
    var miniDoc;
    var instructorP;
    var detailP;
    var j = 0;

    //  Find all instructors
    do {
        //  Get name of entry
        hStart = textArea.indexOf("<h3>", hEnd);
        console.log(hStart);
        if (hStart == -1)
            break;
        hEnd = textArea.indexOf("</h3>", hStart);
        console.log(hEnd);
        if (hEnd == -1)
            break;
        instructorP = textArea.slice(hStart, hEnd) + "</h3>";
        miniDoc = parser.parseFromString(instructorP, "text/xml");
        name = miniDoc.getElementsByTagName("h3")[0].innerText;
        console.log(miniDoc);

        //  Is a folder
        if (miniDoc.getElementsByTagName("a")[0] != undefined) {
            console.log("Making a folder...");
            var f = new Folder();
            f.name = name;
            f.link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
            course.contacts[course.contacts.length] = f;
            continue;
        }

        //  Is a true Instructor
        var i = new Instructor();
        i.name = name;
        
        //  Get details of an Instructor
        divStart = textArea.indexOf("<div class=\"details", hEnd);
        console.log(divStart);
        if (divStart == -1)
            continue;
        divEnd = textArea.indexOf("</div>", divStart);
        console.log(divEnd);
        if (divEnd == -1)
            throw "No end of div";
        
        detailP = textArea.slice(divStart, divEnd) + "</div>";
        console.log(detailP);
        miniDoc = parser.parseFromString(detailP, "text/xml");
        email = miniDoc.getElementsByTagName("a")[0];
        if (email != undefined)
            i.email = email.innerText;
        console.log("Finished email");
        office = detailP.match(/<strong>Office Location<\/strong>/g);
        if (office != null) {
            office = office[0].split("\"");
            console.log(office);
            office = strip(office[1]);
            i.office = office;
        }
        
        course.contacts[course.contacts.length] = i;
        j = j + 1;
    } while (j < 10);    
}


//  Takes course content document's sidebar link for Contacts
//  Gets array of instructor's names and detailed information
function mineContacts(sidebarLink, course) {
    console.log("In contacts");
    var req = new XMLHttpRequest();
    req.open("GET", sidebarLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var listStart = req.responseText.indexOf("contentList staffInfoList");
            if (listStart == -1) {
                console.log("No match");
                return;
            }
            console.log(listStart);
            
            var listEnd = req.responseText.indexOf("ul>", listStart);
            if (listEnd == -1) {
                console.log("Couldn't find end");
                return;
            }
            console.log(listEnd);
            
            var list = req.responseText.slice(listStart, listEnd);
            extractContacts(list, course);
        }
        else if (req.readyState == 4) {
            console.log("Error in loading page");
            console.log("Ready state: ");
            console.log(req.readyState);
            console.log("HTTP Status");
            console.log(req.status);
        }
    }
    req.send();
}

//  Mines a particular sidebar element
function mineSidebar(a, course) {
    for (i = 0; i < a.length; i++) {
        switch(a[i][0]) {
            case "Announcements":
                console.log("Will mine announcements later");
                break;
           case "Syllabus":
               console.log("Will mine Syllabus later");
               break;
           case "Course Description":
               console.log("Mining Course Description");
               mineCourseDescription(a[i][1], course);
               break;
           case "Course Materials":
               console.log("Will mine Course Materials later");
               break;
           case "Assignments":
               console.log("Will mine Assignments later");
               mineMasha(a[i][1], course);
	       break;
           case "Contacts":
               mineContacts(a[i][1], course);
               break;
           case "Tools":
               console.log("Will mine Tools later");
               break;
           default:
               console.log("Unhandled: Will mine " + a[i][0] + " later");
               break;
        }
    }
    console.log("Finished sending requests for side bar for " + course.title.substr(0,6));
}
//  - - - - - COURSE CONTENT DOC FUNCTIONS - - - - -

//  Given a course's web page link, mine it
function mineCourseFromLink(contentPageLink, course) {
    var req = new XMLHttpRequest();
    req.open("GET", contentPageLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            mineCourse(req.responseText, course);
        }
    }
    req.send();
}

//  Given a course content document, mines the course page and
//  puts content into course
function mineCourse(contentText, course) {
    console.log('In class');
    
    //  Find sidebar list elements
    var listElems = contentText.match(/<li[^>]*paletteItem[^>]*>\s*<a[^>]*>\s*<span[^>]*>.*<\/span>\s*<\/a>\s*<\/li>/g);
    var a = new Array();
    for (i = 0; i < listElems.length; i++) {
        s = cleanLink(listElems[i]);
        var miniDoc = parser.parseFromString(s, "text/xml");
        var link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
        var name = miniDoc.getElementsByTagName("span")[0].textContent;
        a[i] = new Array();
        a[i][0] = name;
        a[i][1] = link;
    }
    
    mineSidebar(a, course);
}



//  - - - - - General Functions - - - - -

//  Takes an array of [Course Title, Course page link] arrays
//  Does sanity check, then gets the texts of all course pages
function writeArray(a) {
   //  Funky way of getting all the pages
    function nextRequest() {
        if (this.readyState == 4 && this.status == 200) {
            Courses[this.i] = new Course();
            Courses[this.i].title = a[this.i][0];
            
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
            
            getContentDoc(link, mineCourse, Courses[this.i]);
            
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
    var req2 = new XMLHttpRequest();
    req2.i = 0;
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
    classesAndLinks.i = 0;
    writeArray(classesAndLinks);
}

function mineMasha(link, course) {
    console.log("I'M IN MINE MASHA!!!!!");
    console.log(link);
    console.log(course);
    var txt;
    var working;
    text2 = new Array();
    NameFinal = new Array();
    text4 = new Array();
    LinkFinal = new Array();
    text6 = new Array();
    TextFinal = new Array();
    
    req = new XMLHttpRequest();
    req.open("GET", link, true);

    req.onreadystatechange = function () {
	if (req.readyState == 4 && req.status == 200) {
	      
	    text = req.responseText;
	    text2 = text.match(/<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*(<a href[^>]*>)?<span[^>]*>[^<]*/g);
	    if (text2 != null) {
		for (i = 0;i < text2.length; i++)
		    {
   			    txt = text2[i];
			    working = txt.match(/>[^<]*$/g)[0];
			    if (working == null) {
				NameFinal[i] = "NOT A THING TYPE 1B";
				console.log("We really shouldn't be in here");
				break;}
			    else {
				NameFinal[i] = working.slice(1);}
			}
		    }
		text4 = text.match(/((<div class="details" >[.|\s]*<table [^>]*>[.|\s]*(<tr>[.|\s]*)?<th[^<]*<\/th>[.|\s]*(<td>[.|\s]*)?<ul[^<]*(<li>[.|\s]*)?<a href[^<]*<img[^<]*>[^<]*<\/a>)|(<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*<a href[^>]*><span[^>]*>[^<]*))/g);
		if (text4 != null) {
		for (i = 0; i < text4.length ; i++)
		    {
  			    txt = text4[i];
			    working = txt.match(/((<a href[^<]*<img[^>]*>[^<]*<\/a>)|(<a href[^<]*>))/g)[0];
			    if (working == null) {
				LinkFinal[i] = "NOT A THING TYPE 2B";
				console.log("REALLY shouldn't be here");
				break;}
			    else {
				LinkFinal[i] = working;}
			}
		    }

        text6 = text.match(/<div class="details" >[.|\s]*<div class="vtbegenerated">[^<]*/g);
        if (text6 != null) {
           for (i = 0; i < text6.length; i++)
           {
              txt = text6[i];
              working = txt.match(/>[^<]*$/g)[0];
              if (working == null)  {
                 TextFinal[i] = "NOT A THING";
                 break; }
             else {
                 TextFinal[i] = working.slice(1);}
                                                     
	    }
        }
	    
	    if (text2 != null)
    	{
    	var assignments = new Array();
    	for (i = 0; i < text2.length; i++)
    		{
    		var a = new Assignment();
    		a.name = NameFinal[i];
    		a.fileLink = LinkFinal[i];
    		a.submissionLink = TextFinal[i];
            assignments[i] = a;
    		}
	course.assignments = assignments;
    	}
    
      	    console.log("THIS SHOULD BE THE ASSIGNMENT INFO BY MASHA");
	    console.log(NameFinal);
	    console.log(LinkFinal);
	    console.log("THIS IS THE END OF ASSIGNMENT INFO BY MASHA");
	}
    }
    req.send();
}

var Courses = new Array();

var t = setTimeout("mineBB();", 3000);

var q = setTimeout("console.log(Courses);", 10000);
