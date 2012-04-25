//  Author: Wenley Tong
//  Written: 17 April 2012
//  localStore.js

//  Creates an interface with local storage. Has functions
//  to take generic objects and translate them to strings
//  as well as to extract classes from strings.

//  Saves current state to local storage
function saveToLocal() {
   if (localStorage.OldCourses != undefined)
      delete localStorage.OldCourses;
   if (localStorage.NewCourses != undefined)
      delete localStorage.NewCourses;

   localStorage.OldCourses = JSON.stringify(prepareForStringify(OldCourses));
   localStorage.NewCourses = JSON.stringify(prepareForStringify(NewCourses));
}

//  Loads previous state from local storage
function openFromLocal() {
   OldCourses = restorePrototype(JSON.parse(localStorage.OldCourses));
   if (OldCourses == undefined) {
      console.log("Load OldCourses from local failed");
      OldCourses = null;
   }
   console.log(OldCourses);
   
   NewCourses = restorePrototype(JSON.parse(localStorage.NewCourses));
   if (NewCourses == undefined) {
      console.log("Load NewCourses from local failed");
      NewCourses = null;
   }
   console.log(NewCourses);
}

//  Restore from last session
openFromLocal();

//  Clears the local storage state to allow for fresh mining
function clearLocal() {
   delete localStorage.OldCourses;
   delete localStorage.NewCourses;
}
