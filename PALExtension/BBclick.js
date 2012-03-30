function delay() {
	var y = setTimeout("reportLoad();", 2000);
}

function reportLoad() {
	console.log("Loaded MBB");
	console.log(req.responseXML);
	mbbBodyDoc = req.responseXML.getElementsByName("content")[0].contentDocument;
	console.log(mbbBodyDoc);
}

var req;
function loadLink(link) {
	req = new XMLHttpRequest();
	req.open("GET", link, true);
	req.onload = delay;
	req.send(null);
}

var link;
function clickCourses() {
	var frame = document.getElementsByName("nav")[0];
	var headDoc = frame.contentDocument;
	
	//headDoc.getElementById("loggedInUserName").innerHTML = "HAHA";
	
	var tab = headDoc.getElementById("Courses");
	console.log(headDoc);
	link = tab.getElementsByTagName("a")[0].getAttribute("href");
	
	var MBBtab = headDoc.getElementById("My Blackboard");
	var mbbLink = MBBtab.getElementsByTagName("a")[0].getAttribute("href");
	
	loadLink(mbbLink);
	
	var x = setTimeout("document.location.href = link;", 2000);
}

console.log("In script");

var t = setTimeout("clickCourses();", 2000);