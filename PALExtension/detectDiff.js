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
      for (var i = 0; i < newString.length && i < oldString.length; i++) {
         if (newString[i] != oldString[i])
            break;
      }
      console.log(newString.substr(i));
      console.log(oldString.substr(i));
      console.log(newAttr);
      console.log(cleanObj(newAttr));
   }
   
   return newString != oldString;
}

//  Checks for differences between two courses
function diffCourse(newC, oldC) {
   var diff = new Array();

   for (var attr in newC) {
      if (attr == "tabOrder")
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
