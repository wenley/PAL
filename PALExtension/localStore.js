//  Author: Wenley Tong
//  Written: 17 April 2012
//  localStore.js

//  Creates an interface with local storage. Has functions
//  to take generic objects and translate them to strings
//  as well as to extract classes from strings.

//  Forms string to store obj in local storage
function toLocalString(obj) {
   //  String fields
   if (isString(obj))
      return obj;

   var a = new Array();
   for (var entry in obj) {
      a[a.length] = entry + ":" + toLocalString(obj[entry]);
   }
   return obj.constructor.name + "(" + a.join() + ")";
}

//  Reconstructs an object from its toLocalString
function fromLocalString(s) {
   //  Raw strings
   if (s.indexOf("(") == -1)
      return s;

   var type = s.match(/^[^\(]*/g)[0];
   var obj = eval("new " + type + "();");
   var i = s.indexOf("(") + 1;
   var parenCount = 0;
   var start = i;
   while (i < s.length) {
      var c = s.charAt(i);
      if (c == '(')
         parenCount++;
      else if (c == ')')
         parenCount--;
      else if (parenCount > 0)
         ;
      else if (c == ',') {
         var pair = s.slice(start, i);
         var colon = pair.indexOf(':');
         var key = pair.slice(0, colon);
         var value = pair.slice(colon + 1);
         obj[key] = fromLocalString(value);

         //  Reset counters
         i++;
         start = i;
      }
      i++;
   }
   return obj;
}

var testObj = new Instructor();
testObj.name = "BWK";
testObj.email = "bwk@princeton.edu";
testObj.office = "COS 342";
testObj.hours = "Variable";
testObj.phone = "333";
testObj.notes = "None";
var s = toLocalString(testObj);
console.log(s);
var newObj = fromLocalString(s);
console.log(newObj);
console.log(testObj);