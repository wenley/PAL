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
   this.sidebarElements = null;
   this.announcements = null;
   this.syllabusDoc = null;
   this.descriptionLink = "";
   this.courseMaterials = null;
   this.assignments = null;
   this.contacts = null;
   this.toolLinks = null;
   this.otherLinks = new Array();
}

function Announcements() {
    this.postedBy = "";
    this.postedTo = "";
    this.message = "";
}