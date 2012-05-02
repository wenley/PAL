//  Author: Wenley Tong
//  Written: 9 April 2012

function mineTools(toolsLink, course) {
    var req = new XMLHttpRequest();
    req.open("GET", toolsLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var startFirst = req.responseText.indexOf("<div class=\"landingPageColumn");
            var endFirst = req.responseText.indexOf("</div>", startFirst);
            var endSecond = req.responseText.indexOf("</div>", endFirst + 1); 5
            var bit = req.responseText.slice(startFirst, endSecond);

            var smooth = bit.replace(/\s+/g, " ");
            var a = smooth.split("</li>");
            for (var i = 0; i < a.length; i++) {
               //  Grab <h3>...</h3>
               var hStart = a[i].indexOf("<h3");
               var hEnd = a[i].indexOf("</h3>", hStart);
               var impBit = a[i].slice(hStart, hEnd + 5); //  Includes </h3>

               //  Remove pesky &
               impBit = cleanLink(impBit);

               //  Remove pesky <img> tags
               var imgStart = impBit.indexOf("<img");
               var imgEnd = impBit.indexOf(">", imgStart);
               impBit = impBit.slice(0, imgStart) + impBit.slice(imgEnd + 1);

               //  Parse into document
               var miniDoc = parser.parseFromString(impBit, "text/xml");
               
               var t = new Tool();
               try {
                   t.name = strip(miniDoc.getElementsByTagName("a")[0].textContent);
                   t.link = miniDoc.getElementsByTagName("a")[0].getAttribute("href");
                   course.tools[course.tools.length] = t;
               } catch (e) { //  Some bits from split aren't good documents
                   // The last bit is always bad, but want to detect others
                   if (i < a.length - 1) {
                       console.warn("DEBUG:");
                       console.warn(e);
                       console.warn(impBit);
                       console.warn(miniDoc);
                   }
               }
            }
            XMLdecrement();
        }
        else if (req.readyState == 4 && req.status != 200) {
           console.warn(course.key + ": ERROR, status is " + req.status);
           XMLdecrement();
        }
    }
    req.send();
    XMLincrement();
}