//  Author: Wenley Tong
//  Written: 6 April 2012

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
            var link = line[0].match(/"https:[^\"]*"/g)[0].slice(1, -1);
            console.log(link);
            course.descriptionLink = link;
        }
    }
    req.send();
}