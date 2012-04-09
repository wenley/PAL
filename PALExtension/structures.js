//  An instructor from the Contacts of a Course
function Instructor() {
   this.name = "";
   this.email = "";
   this.office = "";
   this.hours = "";
   this.notes = "";
}

//  A folder in a sidebar elements
function Folder() {
   this.name = "";
   this.link = "";
}

//  Container for information on an assignment
function Assignment() {
   this.name = "";
   this.submissionLink = "";
   this.fileLink = "";
}

//  Huge container for information on a particular Course
function Course() {
   this.title = null;
   this.sidebarElements = null;
   this.announcements = null;
   this.syllabusDoc = null;
   this.descriptionLink = null;
   this.courseMaterials = null;
   this.assignments = null;
   this.contacts = new Array();
   this.tools = new Array();
   this.otherLinks = new Array();
}

//  An Announcement of a Course on Blackboard
function Announcements() {
    this.postedBy = "";
    this.postedTo = "";
    this.heading = "";
    this.date = "";
    this.message = "";
}

//  A Tool from the Tools section of a Course
function Tool() {
   this.name = "";
   this.link = "";
}