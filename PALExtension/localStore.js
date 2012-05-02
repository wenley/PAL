//  Author: Wenley Tong
//  Written: 17 April 2012
//  localStore.js

//  Creates an interface with local storage. Has functions
//  to take generic objects and translate them to strings
//  as well as to extract classes from strings.

//  The current user
var user = null;

//  Saves current state to local storage
function saveToLocal() {
   if (localStorage[user] != undefined && localStorage[user].OldCourses != undefined)
      delete localStorage.OldCourses;
   if (localStorage[user] != undefined && localStorage[user].NewCourses != undefined)
      delete localStorage.NewCourses;

   //  Seeing a user for the first time
   if (localStorage[user] == undefined)
      localStorage[user] = new Object();

   localStorage[user + "OldCourses"] = JSON.stringify(prepareForStringify(OldCourses));
   localStorage[user + "NewCourses"] = JSON.stringify(prepareForStringify(NewCourses));
}

//  Loads previous state from local storage
function openFromLocal() {
   //  User hasn't been seen before
   if (localStorage[user + "OldCourses"] == undefined &&
       localStorage[user + "NewCourses"] == undefined) {
      console.warn("User " + user + " is new!");
      OldCourses = null;
      NewCourses = null;
      return;
   }

   if (localStorage[user + "OldCourses"] == undefined) {
      console.warn("User " + user + " has no existing OldCourses");
      OldCourses = null;
   }
   else {
      OldCourses = restorePrototype(JSON.parse(localStorage[user + "OldCourses"]));
      if (OldCourses == undefined) {
         console.warn("Load OldCourses from local failed");
         OldCourses = null;
      }
   }
   console.log(OldCourses); //  Leave for debugging until release
   
   if (localStorage[user + "NewCourses"] == undefined) {
      console.warn("User " + user + " has no existing NewCourses");
      NewCourses = null;
   }
   else {
      NewCourses = restorePrototype(JSON.parse(localStorage[user + "NewCourses"]));
      if (NewCourses == undefined) {
         console.warn("Load NewCourses from local failed");
         NewCourses = null;
      }
   }
   console.log(NewCourses); //  Leave for debugging until release
}

//  Clears the local storage state to allow for fresh mining
function clearLocal() {
   delete localStorage[user + "OldCourses"];
   delete localStorage[user + "NewCourses"];
   OldCourses = null;
   NewCourses = null;
}

//  Loads the user and her courses
function loadUser(userName) {
   user = userName;
   openFromLocal();
}