//  Author: Wenley Tong
//  Written: 14 April 2012
//  strucsToHTML.js

//  Transforms Structures into HTML elements

//  Constructs the <a> for a Document
function makeDocument(doc) {
   if (getClass(doc) != "[object Document]")
      throw "Improper usage: makeDocument with " + getClass(doc);

   var a = document.createElement("a");
   a.setAttribute("href", doc.link);
   a.innerText = doc.name;
   return a;
}

//  Constructs the <???> for an Assignment
function makeAssignment(assgn) {
   if (getClass(doc) != "[object Assignment]")
      throw "Improper usage: makeAssignment with " + getClass(assgn);

   var span = document.createElement("span");
}