function mineMasha(link, course) {
    console.log("I'M IN MINE MASHA!!!!!");
    console.log(link);
    console.log(course);
    var txt;
    var working;
    text2 = new Array();
    NameFinal = new Array();
    text4 = new Array();
    LinkFinal = new Array();
    text6 = new Array();
    TextFinal = new Array();
    
    req = new XMLHttpRequest();
    req.open("GET", link, true);

    req.onreadystatechange = function () {
	if (req.readyState == 4 && req.status == 200) {
	      
	    text = req.responseText;
	    text2 = text.match(/<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*(<a href[^>]*>)?<span[^>]*>[^<]*/g);
	    if (text2 != null) {
           for (i = 0;i < text2.length; i++)
           {
              txt = text2[i];
              working = txt.match(/>[^<]*$/g)[0];
              if (working == null) {
                 NameFinal[i] = "NOT A THING TYPE 1B";
                 console.log("We really shouldn't be in here");
                 break;
              }
              else {
                 NameFinal[i] = working.slice(1);
              }
           }
        }
        text4 = text.match(/((<div class="details"[\s]*>[.|\s]*<table [^>]*>[.|\s]*(<tbody>[.|\s]*)?(<tr>[.|\s]*)?<th[^<]*<\/th>[.|\s]*(<td>[.|\s]*)?<ul[^<]*(<li>[.|\s]*)?<a href[^<]*<img[^<]*>[^<]*<\/a>)|(<h3>[.|\s]*<span[^<]*<img[^<]*<\/span>[.|\s]*<a href[^>]*><span[^>]*>[^<]*))/g);
		if (text4 != null) {
           for (i = 0; i < text4.length ; i++)
           {
              txt = text4[i];
              working = txt.match(/((<a href[^<]*<img[^>]*>[^<]*<\/a>)|(<a href[^<]*>))/g)[0];
              if (working == null) {
                 LinkFinal[i] = "NOT A THING TYPE 2B";
                 console.log("REALLY shouldn't be here");
                 break;
              }
              else {
                 LinkFinal[i] = working;
              }
           }
        }
        
        text6 = text.match(/<div class="details" >[.|\s]*<div class="vtbegenerated">[^<]*/g);
        if (text6 != null) {
           for (i = 0; i < text6.length; i++)
           {
              txt = text6[i];
              working = txt.match(/>[^<]*$/g)[0];
              if (working == null)  {
                 TextFinal[i] = "NOT A THING";
                 break; }
              else {
                 TextFinal[i] = working.slice(1);}
              
           }
        }
	    
	    if (text2 != null)
    	{
    	var assignments = new Array();
    	for (i = 0; i < text2.length; i++)
    		{
    		var a = new Assignment();
    		a.name = NameFinal[i];
    		a.fileLink = LinkFinal[i];
    		a.submissionLink = TextFinal[i];
            assignments[i] = a;
    		}
	course.assignments = assignments;
    	}
    
      	    console.log("THIS SHOULD BE THE ASSIGNMENT INFO BY MASHA");
	    console.log(NameFinal);
	    console.log(LinkFinal);
	    console.log("THIS IS THE END OF ASSIGNMENT INFO BY MASHA");
	}
    }
    req.send();
}
