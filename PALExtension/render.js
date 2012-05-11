//  Author: Wenley Tong
//  Written: 10 April 2012

//  Makes sure there are no empty objects in Diffs
function cleanDiff() {
   for (var sem in Diffs) {
      var j = 0; //  Number of courses with differences
      for (var course in Diffs[sem]) {
         var i = 0; //  Number of different attributes in a course
         for (var attr in Diffs[sem][course]) {
            if (Diffs[sem][course][attr] == true)
               i++;
            else
               delete Diffs[sem][course][attr];
         }
         if (i == 0)
            delete Diffs[sem][course];
         else
            j++;
      }
      if (j == 0)
         delete Diffs[sem];
   }
}

//  Makes differences appear to the user using the Diffs object
function showDiff() {
   cleanDiff();
   console.log(JSON.parse(JSON.stringify(Diffs)));

   //  Go through semester <a> elements
   var semesterList = document.getElementsByClassName("sideBarSemesters")[0];
   for (var i = 0; i < semesterList.children.length; i++) {
      var semLi = semesterList.children[i];
      var aSem = semLi.children[0];

      if (Diffs[aSem.innerText] != undefined) {
         //  Add diff to non-diff classes
         var previous = aSem.getAttribute("class");
         if (previous != null)
            previous = previous.replace(/ diffSem/, "");
         else
            previous = "";
         aSem.setAttribute("class", previous + " diffSem");
      }
      else {
         //  Take out diff if exists
         var previous = aSem.getAttribute("class");
         if (previous != null)
            aSem.setAttribute("class", previous.replace(/ diffSem/, ""));
      }

      //  Go through course <a> elements if visible
      if (semLi.children[1] != undefined) {
         var courses = semLi.children[1];
         for (var j = 0; j < courses.children.length; j++) {
            var courseLi = courses.children[j];
            var aCourse = courseLi.children[0];

            if (Diffs[aSem.innerText] != undefined && Diffs[aSem.innerText][aCourse.innerText] != undefined) {
               //  Add diff to non-diff classes
               var previous = aCourse.getAttribute("class");
               if (previous != null)
                  previous = previous.replace(/ diffCourse/, "");
               else
                  previous = "";
               aCourse.setAttribute("class", previous + " diffCourse");
            }
            else {
               //  Take out diff if exists
               var previous = aCourse.getAttribute("class");
               if (previous != null)
                  aCourse.setAttribute("class", previous.replace(/ diffCourse/, ""));
            }
         }
      }
   }

   //  Check to see if currently displayed course has differences
   var potentialSem = Diffs[selectedSemName];
   if (potentialSem == undefined)
      return;
   var potentialCourse = potentialSem[selectedCourse.key];
   if (potentialCourse == undefined)
      return;

   //  Go through tabs of current course since something is different
   var table = document.getElementById("courseTabTable");
   var row = table.children[0].children[0];

   for (var i = 0; i < row.children.length; i++) {
      var thEl = row.children[i];
      var attr = thEl.getAttribute("attribute");
      if (potentialCourse[attr] == true) {
         //  Allow for reset of class upon click
         thEl.addEventListener("click", diffClick, false);

         //  Change class of most narrow element
         thEl = thEl.children[0].children[1].children[0];
         var previous = thEl.getAttribute("class");
         if (previous != null)
            previous = previous.replace(/ diffAttr/, "");
         else
            previous = "";
         thEl.setAttribute("class", previous + " diffAttr");
      }

   }
}

//  Function that gets called when tabs is clicked
function diffClick() {
  //  Reset class
   var thEl = this.children[0].children[1].children[0];
   var previous = thEl.getAttribute("class");
   if (previous != null)
      thEl.setAttribute("class", previous.replace(/ diffAttr/, ""));

   //  Remove self as listener
   this.removeEventListener("click", arguments.callee, false);
   this.removeEventListener("click", diffClick);

   //  Update Diffs
   var course = Diffs[this.getAttribute("semester")][this.getAttribute("name")];
   delete course[this.getAttribute("attribute")];
   cleanDiff();
   showDiff();

   port.postMessage({
        note: "click",
            semester: this.getAttribute("semester"),
            course: this.getAttribute("name"),
            tab: this.getAttribute("attribute")
            });
}

//  Clears the current page and replaces with s
function clearPage(s) {
   if (s == undefined)
      document.documentElement.innerHTML = docHeadString;
   var c = getClass(s);
   if (c == "[object String]")
      document.documentElement.innerHTML = docHeadString + s;
   else if (c == "[object HTMLBodyElement]")
      document.body = s;
   else
      console.warn("Unrecognized class to clear with: " + c);
}

//  Get the user's name from the navigation bar of BB
function getUserFromDoc() {
   var navDoc = document.getElementsByName("nav")[0].contentDocument;
   var userEl = navDoc.getElementById("loggedInUserName");
   if (userEl == null)
      return null;
   else
      return userEl.innerText;
}

//  Gets user name
function initialize() {
   var userName = getUserFromDoc();
   if (userName != null)
      port.postMessage({note: "user", user: userName});
   else
      var redo = setTimeout(initialize, 50);
}

//  Start chain of either render of mine
initialize();

