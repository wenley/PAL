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
      if (isArray(newAttr)) {
         for (var i = 0; i < newAttr.length; i++) {
            var newSub = JSON.stringify(newAttr[i]);
            var oldSub = JSON.stringify(oldAttr[i]);

            if (newSub != oldSub) {
               console.log("First Difference in entry " + i);
               console.log(newAttr[i]);
               console.log(oldAttr[i]);
               break;
            }
         }
      }
      else if (isObject(newAttr)) {
         for (var entry in newAttr) {
            var newSub = JSON.stringify(newAttr[entry]);
            var oldSub = JSON.stringify(oldAttr[entry]);

            if (newSub != oldSub) {
               console.log("First difference in entry " + entry);
               console.log(newAttr[entry]);
               console.log(oldAttr[entry]);
               break;
            }
         }
      }
   }

   return newString != oldString;
}

//  Checks for differences between two courses
function diffCourse(newC, oldC) {
   var diff = new Array();

   for (var attr in newC) {
      if (attr == "tabOrder" || attr == "contacts" || attr == "removedTabs")
         continue;

      if (attr == "otherLinks") {
         var newOther = newC[attr];
         var oldOther = oldC[attr];

         //  Go through otherLinks
         if (newOther == null && oldOther == null)
            continue;
         else if (newOther == null) {
            console.log("new lost otherLinks...");
            continue;
         }
         else if (oldOther == null) {
            console.log(newC.key + ": New otherlinks");
            continue;
         }
            
         for (var i = 0; i < newOther.length; i++) {
            var newAttr = newOther[i];
            var name = newAttr.name;

            //  Find corresponding otherLink in old version
            var oldAttr = null;
            for (var j = 0; j < oldOther.length; j++) {
               if (name == oldOther[j].name) {
                  oldAttr = oldOther[j];
                  break;
               }
            }

            //  If doesn't exist, mark as new
            if (oldAttr == null) {
               console.log(newC.key + ": New attr: " + name);
               diff.push(attr);
               continue;
            }

            //  Otherwise, note as different
            if (diffAttr(newAttr, oldAttr)) {
               console.log(newC.key + ": Difference found in " + name + ": [New] [Old]");
               console.log(newAttr);
               console.log(oldAttr);

               diff.push(name);
            }
         }
      }

      //  For other attributes, simply compare
      else {
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
}
