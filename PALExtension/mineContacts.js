//  Author: Wenley Tong
//  Written: 8 April 2012

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
