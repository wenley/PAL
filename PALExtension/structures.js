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
   // Some assignments consist of text directly on the Assignments link
   this.memo = "";
}

//  Huge container for information on a particular Course
function Course() {
    //  Name of the course
    this.title = null;

    //  Link to content page of this Course
    this.contentLink = null;

    //  Array of announcements of this course
    this.announcements = null;

    //  Syllabus Document Object
    this.syllabusDoc = null;

    //  Link to registrar's page for the course
    this.descriptionLink = null;

    //  Array of documents and folders of Course Materials
    this.courseMaterials = null;

    //  Array of documents and folders of Assignments
    this.assignments = new Array();

    //  Array of instructors and folders of Assignments
    this.contacts = new Array();

    //  Array of Tool Objects
    this.tools = new Array();

    //  Array of other sidebar element links
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

// A Course Material
function Material() {
   this.name = "";
   this.fileLink = "";
   this.memo = "";
}

//  A Tool from the Tools section of a Course
function Tool() {
   this.name = "";
   this.link = "";
}