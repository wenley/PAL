
//  Mimics the behavior of Python's zip
function zip(x, y) {
   if (Object.prototype.toString.apply(x) != "[object Array]")
      throw "First argument is not an Array";
   if (Object.prototype.toString.apply(y) != "[object Array]")
      throw "Second argument is not an Array";

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
