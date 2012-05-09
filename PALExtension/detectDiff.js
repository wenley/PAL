//  Author: Wenley Tong
//  Written: 15 April 2012
//  detectDiff.js

//  Contains functions pertaining to detecting differences between
//  OldCourses and NewCourses


var OldCourses = null;
var NewCourses = null;

//  Checks for differences between two fields of a course
function diffAttr(newAttr, oldAttr) {
   var newString = JSON.stringify(newAttr);
   var oldString = JSON.stringify(oldAttr);

   if (newString != oldString) {
      for (var i = 0; i < newString.length && i < oldString.length; i++) {
         if (newString[i] != oldString[i])
            break;
      }
   }
   
   return newString != oldString;
}

//  Checks for differences between two courses
function diffCourse(newC, oldC) {
   var diff = new Array();

   for (var attr in newC) {
      if (attr == "tabOrder" || attr == "contacts")
         continue;

      var newAttr = newC[attr];
      var oldAttr = oldC[attr];
      if (oldAttr == undefined && newAttr != null) {
         console.log(newC.key + ": New attr: " + attr);
         diff.push(attr);
         continue;
      }
      if (diffAttr(newAttr, oldAttr)) {
         console.log(newC.key + ": Difference found in " + attr + ": [New] [Old]");
         console.log(newAttr);
         console.log(oldAttr);

         diff.push(attr);
      }
   }
   return diff.join(',');
}

//  Checks for differences between two semesters
function diffSem(newS, oldS) {
   var diff = new Array();

   for (var courseKey in newS) {
      var newC = newS[courseKey];
      var oldC = oldS[courseKey];
      if (oldC == undefined) {
         console.log("New Course: " + courseKey);
         continue;
      }
      var diffC = diffCourse(newC, oldC);
      if (diffC != "" && diffC.length > 0)
         diff.push(courseKey + ":" + diffC);
   }
   return diff.join(';');
}

//  Checks for differences between OldCourses and NewCourses
function runDiff() {
   OldCourses = cleanObj(OldCourses);
   NewCourses = cleanObj(NewCourses);

   if (OldCourses == null) {
      console.log("Everything is new");
      OldCourses = NewCourses;
      saveToLocal();
      return;
   }

   var diff = new Array();
   for (var semester in NewCourses) {
      var newS = NewCourses[semester];
      var oldS = OldCourses[semester];
      if (oldS == undefined) {
         console.log("New Semester: " + semester);
         continue;
      }
      var diffS = diffSem(newS, oldS);
      if (diffS != "" && diffS.length > 0)
         diff.push(semester + "'" + diffS);
   }
//   if (diff.length > 0)
   console.log(diff.join('/'));
   sendToForeground({note: "update", update: diff.join('/')});
//   OldCourses = NewCourses;
}
