//  Author: Wenley Tong
//  Written: 15 April 2012
//  detectDiff.js

//  Contains functions pertaining to detecting differences between
//  OldCourses and NewCourses


var OldCourses = null;
var NewCourses = null;

//  Compares two objects, one and two. Notes differences between then on console
//  Not used
function diffObj(one, two) {

    //  Check both real check-able objects
    if (one == undefined || one == null) {
        console.log(two);
        console.log(" has no match");
        console.log("=============");
        return;
    }
    if (two == undefined || two == null) {
        console.log(one);
        console.log(" has no match");
        console.log("=============");
        return;
    }
    
    //  Compare classes
    var c1 = getClass(one);
    var c2 = getClass(two);
    if (c1 != c2) {
        console.log("Unmatched classes: " + c1 + ", " + c2);
        console.log("=============");
        return;
    }

    //  Check strings and stop
    if (c1 == "[object String]" && c1 != c2) {
        console.log("Diff: " + c1 + " vs. " + c2);
        return;
    }
    
    for (var entry in one) {
        var el1 = one[entry];
        var el2 = two[entry];
    }
}

//  Checks for differences between two fields of a course
function diffAttr(newAttr, oldAttr) {
   var newString = JSON.stringify(newAttr);
   var oldString = JSON.stringify(oldAttr);
   
   if (newString != oldString) {
      console.log("Difference found: [New] [Old]");
      console.log(newAttr);
      console.log(oldAttr);
      return {note: "diff"};
   }
   return null;
}

//  Checks for differences between two courses
function diffCourse(newC, oldC) {
   for (var attr in newC) {
      var newAttr = newC[attr];
      var oldAttr = oldC[attr];
      if (oldAttr == undefined && newAttr != null) {
         console.log(newC.key + ": New attr: " + attr);
         console.log(newAttr);
         console.log(oldC);
         continue;
      }
      var diff = diffAttr(newAttr, oldAttr);
      if (diff != null)
         console.log("diff found") // !!!
   }
}

//  Checks for differences between two semesters
function diffSem(newS, oldS) {
   for (var courseKey in newS) {
      var newC = newS[courseKey];
      var oldC = oldS[courseKey];
      if (oldC == undefined) {
         console.log("New Course: " + courseKey);
         continue;
      }
      diffCourse(newC, oldC);
   }
}

//  Checks for differences between OldCourses and NewCourses
function runDiff() {
   if (OldCourses == null) {
      console.log("Everything is new");
      OldCourses = NewCourses;
      return;
   }
   for (var semester in NewCourses) {
      var newS = NewCourses[semester];
      var oldS = OldCourses[semester];
      if (oldS == undefined) {
         console.log("New Semester: " + semester);
         continue;
      }
      diffSem(newS, oldS);
   }
   OldCourses = NewCourses;
}
