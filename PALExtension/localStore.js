//  Author: Wenley Tong
//  Written: 17 April 2012
//  localStore.js

//  Creates an interface with local storage. Has functions
//  to take generic objects and translate them to strings
//  as well as to extract classes from strings.

//  Saves current state to local storage
function saveToLocal() {
   localStorage.OldCourses = JSON.stringify(prepareForStringify(OldCourses));
   localStorage.NewCourses = JSON.stringify(prepareForStringify(NewCourses));
}

//  Loads previous state from local storage
function openFromLocal() {
   OldCourses = restorePrototype(JSON.parse(localStorage.OldCourses));
   if (OldCourses == undefined)
      OldCourses = null;
   
   NewCourses = restorePrototype(JSON.parse(localStorage.NewCourses));
   if (NewCourses == undefined)
      NewCourses = null;
}

//  Restore from last session
openFromLocal();

//  Clears the local storage state to allow for fresh mining
function clearLocal() {
   delete localStorage.OldCourses;
   delete localStorage.NewCourses;
}

//  Dummy function
function testLocal() {
   console.log("Testing local storage capabilities");
   console.log(NewCourses);
   saveToLocal();
   NewCourses = null;
   console.log(NewCourses);
   openFromLocal();
   console.log(NewCourses);
}