//  Author: Wenley Tong
//  Written: 17 April 2012
//  prototypes.js

//  Handles restoration of prototypes before and after
//  JSON parsing and message passing

//  Prepares an object for stringification by adding fields
//  specifying the object's type
function prepareForStringify(obj) {
   if (isObject(obj) && getClass(obj) != "[object Object]") {
      if (obj.type == undefined)
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
      return Object.prototype;
   }
}

//  Restores prototypes after JSON parsing or message passing
function restorePrototype(obj) {
   if (obj != null && obj.type != undefined) {
      obj.__proto__ = findPrototype(obj.type);
      for (var entry in obj) {
         restorePrototype(obj[entry]);
      }
   }
   else if (isArray(obj) || isObject(obj)) {
      for (var entry in obj) {
         restorePrototype(obj[entry]);
      }
   }
   return obj;
}
