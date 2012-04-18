//  Author: Wenley Tong
//  Written: 17 April 2012
//  localStore.js

//  Creates an interface with local storage. Has functions
//  to take generic objects and translate them to strings
//  as well as to extract classes from strings.

//  Prepares an object for stringification by adding fields
//  specifying the object's type
function prepareForStringify(obj) {
   if (isObject(obj)) {
      obj.type = obj.constructor.name;
      for (var entry in obj) {
         prepareForStringify(obj[entry]);
      }
   }
   else if (isArray(obj)) {
      for (var entry in obj) {
         prepareForStringify(obj[entry]);
      }
   }
   return obj;
}

//  Returns the prototype according to the type
function findPrototype(type) {
   if (type == "Instructor")
      return Instructor.prototype;
   else if (type == "Folder")
      return Folder.prototype;
   else if (type == "Document")
      return Document.prototype;
   else if (type == "Assignment")
      return Assignment.prototype;
   else if (type == "Course")
      return Course.prototype;
   else if (type == "Announcement")
      return Announcement.prototype;
   else if (type == "Material")
      return Material.prototype;
   else if (type == "Tool")
      return Tool.prototype;
   else {
      console.log("Unrecognized type: " + type);
      return Object.prototype;
   }
}

//  Restores prototypes after JSON parsing
function restorePrototype(obj) {
   if (obj.type != undefined) {
      obj.__proto__ = findPrototype(obj.type);
      delete obj.type;
      for (var entry in obj) {
         restorePrototype(obj[entry]);
      }
   }
   else if (isArray(obj)) {
      for (var entry in obj) {
         restorePrototype(obj[entry]);
      }
   }
   return obj;
}

//  Does proper casts

var testObj = new Instructor();
testObj.name = "BWK";
testObj.email = "bwk@princeton.edu";
testObj.office = "COS 342";
testObj.hours = "Variable";
testObj.phone = "333";
testObj.notes = "None";
var a = new Array();
a[0] = "abc";
a[1] = "def";
a[2] = new Document();
a[2].name = "Empty doc";
a[2].link = "http://www.google.com";
testObj.array = a;
//  var s = toLocalString(testObj);

var s = JSON.stringify(prepareForStringify(testObj));
console.log(s);
//var newObj = fromLocalString(s);
var newObj = restorePrototype(JSON.parse(s));
console.log(newObj);
console.log(testObj);