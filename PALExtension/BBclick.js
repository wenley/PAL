
function reportLoad() {
	while (req.status < 4);
	
	console.log("Loaded MBB");
//	console.log(req.readyState);
//	console.log(req.status);
//	console.log(req.responseText);
	
	var parser = new DOMParser();
	xmlDoc = parser.parseFromString(req.responseText, "text/xml");
	mbbBodyDoc = xmlDoc.getElementsByName("content")[0].getChildren;
	console.log(mbbBodyDoc);
}

var req = new XMLHttpRequest();
function loadLink(link) {
	req.open("GET", link, true);
	req.onload = reportLoad;
	req.send();
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
//	link = mbbLink; //  Verify mbbLink is proper
	
	loadLink(mbbLink);
	
//	var x = setTimeout("document.location.href = link;", 10000);
}

console.log("In script");

var t = setTimeout("clickCourses();", 2000);