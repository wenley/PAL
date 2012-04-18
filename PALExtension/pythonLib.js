
//  Mimics the behavior of Python's strip
function strip(s) {
    if (s == undefined) {
        throw "Argument not defined";
    }
    
    if (!isString(s))
        throw "Argument not a string";
    }
    
    var lead = s.match(/^\s*/)[0].length;
    var tail = s.match(/\s*$/)[0].length;
    
    if (tail == 0)
        return s.slice(lead);
    else
        return s.slice(lead, -tail);
}


//  Mimics the behavior of Python's zip
function zip(x, y) {
   if (arguments.length != 2) {
      throw "Wrong number of arguments.";
   }
 
   if (!isArray(x)) {
      throw "First argument is not an Array";
   }
   if (!isArray(y)) {
      throw "Second argument is not an Array";
   }

   var a = new Array();

   var i;
   for (i = 0; i < x.length && i < y.length; i++) {
      a[i] = new Array();
      a[i][0] = x[i];
      a[i][1] = y[i];
   }
   if (i == x.length) {
      while (i < y.length) {
         a[i] = new Array();
         a[i][0] = y[i];
         i++;
      }
   }
   else {
      while (i < x.length) {
         a[i] = new Array();
         a[i][0] = x[i];
         i++;
      }
   }
   return a;
}
