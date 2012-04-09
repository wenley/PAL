//  Author: Wenley Tong
//  Written: 9 April 2012

function mineTools(toolsLink, course) {
    var req = new XMLHttpRequest();
    req.open("GET", toolsLink, true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var startFirst = req.responseText.indexOf("<div class=\"landingPageColumn");
            var endFirst = req.responseText.indexOf("</div>", startFirst);
            var endSecond = req.responseText.indexOf("</div>", endFirst);
            
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

               //  Parse and show results
               console.log(impBit);
               var miniDoc = parser.parseFromString(impBit, "text/xml");
               console.log(miniDoc);
            }
        }
    }
    req.send();
}