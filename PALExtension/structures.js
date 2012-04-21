//  An instructor from the Contacts of a Course
function Instructor() {
   this.name = "";
   this.email = "";
   this.office = "";
   this.hours = "";
   this.phone = "";
   this.notes = "";
   this.type = this.constructor.name;
}

//  A folder used by Blackboard
function Folder() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;
}

//  Container for information on an assignment
function Assignment() {
   this.name = "";
   this.submissionLink = "";
   this.fileLinks = new Array();
   // Some assignments consist of text directly on the Assignments link
   this.memo = "";
   this.type = this.constructor.name;
}

//  Huge container for information on a particular Course
function Course() {
   //  Name of the course
   this.title = null;

   //  Key under which this course can be found in Courses
   this.key = null;

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

   this.type = this.constructor.name;
}

//  An Announcement of a Course on Blackboard
function Announcement() {
   this.postedBy = "";
   this.postedTo = "";
   this.heading = "";
   this.date = "";
   this.message = "";
   this.type = this.constructor.name;
}

// A Course Material
function Material() {
   this.name = "";
   this.fileLinks = new Array();
   this.memo = "";
   this.type = this.constructor.name;
}

//  A Tool from the Tools section of a Course
function Tool() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;
}

// A Document object
function Document() {
   this.name = "";
   this.link = "";
   this.type = this.constructor.name;
}