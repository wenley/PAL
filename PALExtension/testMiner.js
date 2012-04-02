

//  Redirects the user to Courses tab
function redirectToCourses() {
    console.log("Attempt redirect");
    document.location.href = "https://blackboard.princeton.edu/webapps/portal/frameset.jsp?tab_tab_group_id=_2_1";
}


//  Mines content from an element of the sidebar of a course page
function mineSidebar() {
    console.log('In sidebar');
}


//  Given a course page document, mines the course page
function mineClass() {
    console.log('In class');
}

//  Takes an array of [Course Title, Course page link] arrays
//  Does sanity check, then gets the texts of all course pages
function writeArray(a) {

   //  Simple sanity check from early stages
    console.log(a[0][1]);
    var req = new XMLHttpRequest();
    var link = "https://blackboard.princeton.edu".concat(a[0][1]);
    console.log(link);
    req.open("GET", link, true);
    req.onreadystatechange = function () {
        console.log("Called anon");
        if (req.readyState == 4 && req.status == 200) {
            console.log("Get page");
        }
    }
    req.send();


    /* Failed attempt since the anonymous function doesn't know
       who called it
    var docs = new Array();
    var reqs = new Array();
    for (i = 0; i < a.length; i++) {
       reqs[i] = new XMLHttpRequest();
       link = "https://blackboard.princeton.edu" + a[i][1];
       reqs[i].open("GET", link, true);
       reqs[i].i = i;
       reqs[i].onreadystatechange = function() {
            if (req2.readState == 4 && req2.status == 200) {
                console.log("Finished loading class page.");
                console.log(req2.responseText.substr(0,40));
            }
        }
        reqs[i].send();
        } */
    
    //  Funky way of getting all the pages
    function nextRequest() {
       if (this.readyState == 4 && this.status == 200) {
          //  Show part of text; Eventually replace with Get document
          console.log(this.responseText.substr(150,40));

          //  Check to see if need to do more
          this.i = this.i + 1;
          console.log(this.i);
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

    //  Attempt to get all pages sequentially
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

//  The big function. The function that mines EVERYTHING out of Blackboard
function mineBB() {
    console.log('In general miner');
    
    //  Check to make sure on Courses
    var contentFrame = document.getElementsByName("content")[0];
    if (contentFrame.getAttribute("src") != "/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1")
        redirectToCourses();
    
    //  Print Class Names and Links
    var contentDoc = contentFrame.contentDocument;
    var classListElem = undefined;
    classListElem = contentDoc.getElementsByClassName("portletList-img courseListing coursefakeclass")[0];
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