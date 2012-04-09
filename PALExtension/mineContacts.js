//  Author: Wenley Tong
//  Written: 8 April 2012

function extractContacts(textArea, course) {
   console.log("Extracting...");

    //  Alternate h3 and div class details tags
    var hStart = 0;
    var hEnd = 0;
    var divStart = 0;
    var divEnd = 0;
    var j = 0;

    //  Find all instructors
    do {
        //  Get name of entry
        hStart = textArea.indexOf("<h3>", hEnd);
        if (hStart == -1)
            break;
        hEnd = textArea.indexOf("</h3>", hStart);
        if (hEnd == -1)
            break;
        var instructorP = textArea.slice(hStart, hEnd) + "</h3>";

        var name;
        var bits = instructorP.match(/>[^<]*</g);
        for (var k = 0; k < bits.length; k++) {
           bits[k] = bits[k].slice(1, -1);
           bits[k] = strip(bits[k]);
           if (bits[k] != "") {
              name = bits[k];
           }
        }

        //  Need to detect folder
        var aTag = instructorP.match(/<a[^>]*>[^<]*<\/a>/g);
        if (aTag != null) {
            console.log("Making a folder...");
            var miniDoc = parser.parseFromString(cleanLink(aTag[0]), "text/xml");
            var f = new Folder();
            f.name = name;
            f.link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
            course.contacts[course.contacts.length] = f;
            continue;
        }

        console.log("Making an instructor...");
        //  Is a true Instructor
        var i = new Instructor();
        i.name = name;
        
        //  Get details of an Instructor
        divStart = textArea.indexOf("<div class=\"details", hEnd);
        if (divStart == -1) {
           console.log("continuing...");
            continue;
        }
        divEnd = textArea.indexOf("</div>", divStart);
        if (divEnd == -1)
            throw "No end of div";
        
        var detailP = textArea.slice(divStart, divEnd) + "</div>";
        var details = detailP.match(/>[^<]*</g);
        var cleanDetails = new Array();
        for (var q = 0; q < details.length; q++) {
           details[q] = details[q].replace(/\n/, "");
           details[q] = details[q].slice(1, -1);
           var s = strip(details[q]);
           if (s != "") {
              cleanDetails[cleanDetails.length] = s;
           }
        }

        for (var k = 0; k < cleanDetails.length; k++) {
            switch (cleanDetails[k]) {
                case "Email":
                    i.email = cleanDetails[k + 1];
                    k = k + 1;
                    break;
                case "Office Location":
                    i.office = cleanDetails[k + 1];
                    k = k + 1;
                    break;
                case "Office Hours":
                    i.hours = cleanDetails[k + 1];
                    k = k + 1;
                    break;
                default:
                    console.log("Unknown Instructor detail: " + cleanDetails[k]);
                    break;
            }
        }
        course.contacts[course.contacts.length] = i;
        j = j + 1;
    } while (j < 10);    //  Make true

    console.log(course);
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
            
            var listEnd = req.responseText.indexOf("ul>", listStart);
            if (listEnd == -1) {
                console.log("Couldn't find end");
                return;
            }
            
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
