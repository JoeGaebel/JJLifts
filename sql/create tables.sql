#2 CREATING TABLES
#================================#
#       Independent Tables       #
#================================#

#You can copy and paste this into a blank MySQL DB and run all the commands at once with success

CREATE TABLE FitnessClass(
    FCID INT NOT NULL AUTO_INCREMENT,
    FCName VARCHAR(30) NOT NULL,
    MaxAttendance INT,
    Description VARCHAR(100),
    PRIMARY KEY(FCID)
);
 
 
CREATE TABLE Equipment(
    StockNo INT NOT NULL AUTO_INCREMENT,
    EName VARCHAR(30) NOT NULL,
    Weight INT,
    Amount INT NOT NULL,
    PRIMARY KEY (StockNo)
);

CREATE TABLE Member(
    MemberID INT NOT NULL AUTO_INCREMENT,
    FName VARCHAR(50),
    LName VARCHAR(50),
    Membership VARCHAR(30),
    PRIMARY KEY (MemberID)
);
 
CREATE TABLE Staff(
    StaffID INT NOT NULL AUTO_INCREMENT,
    Position VARCHAR(30) NOT NULL,
    CommissionBonus INT,
    FName VARCHAR(50),
    LName VARCHAR(50),
    PRIMARY KEY(StaffID)
);
 
#================================#
#       Dependent Tables         #
#================================#

CREATE TABLE Exercise(
    ExerciseNo INT NOT NULL AUTO_INCREMENT,
    ExerciseName VARCHAR(30) NOT NULL,
    StockNo INT,
    MuscleGroup VARCHAR(30),
    FOREIGN KEY (StockNo) REFERENCES Equipment(StockNo) ON UPDATE CASCADE,
    PRIMARY KEY (ExerciseNo)        
);

CREATE TABLE FitnessSession(
    FCID  INT NOT NULL,
    StaffID INT NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    SessionAttendance INT,
    Location VARCHAR(30),
    PRIMARY KEY (FCID, StaffID, StartTime),
    FOREIGN KEY (FCID) REFERENCES FitnessClass (FCID) ON UPDATE CASCADE,
    FOREIGN KEY(StaffID) REFERENCES Staff(StaffID) ON UPDATE CASCADE
);

CREATE TABLE PersonalTrainingAppointment (
    MemberID INT NOT NULL,
    StaffID INT NOT NULL,
    Time DATETIME NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON UPDATE CASCADE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON UPDATE CASCADE,
    PRIMARY KEY (MemberID, StaffID, Time)
);


CREATE TABLE PersonalTrainingProfile(
    StaffID INT NOT NULL,
    MemberID INT NOT NULL,
    Date DATETIME NOT NULL,
    Content VARCHAR(250),
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON UPDATE CASCADE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON UPDATE CASCADE,
    PRIMARY KEY (StaffID, MemberID, Date)
);


CREATE TABLE Registration(
    FCID INT NOT NULL,
    MemberID INT NOT NULL,
    StaffID INT NOT NULL,
    StartTime TIME NOT NULL,
    Price INT NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON UPDATE CASCADE,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON UPDATE CASCADE,
    FOREIGN KEY (FCID) REFERENCES FitnessClass(FCID) ON UPDATE CASCADE,
    PRIMARY KEY (FCID, MemberID, StaffID, StartTime)
);


CREATE TABLE Routine(
    FCID INT NOT NULL,
    ExerciseNo INT NOT NULL,
    FOREIGN KEY (ExerciseNo) REFERENCES Exercise(ExerciseNo) ON UPDATE CASCADE,
    FOREIGN KEY (FCID) REFERENCES FitnessClass(FCID) ON UPDATE CASCADE,
    PRIMARY KEY (FCID, ExerciseNo)
);
  
 
CREATE TABLE Shift(
    StaffID INT NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON UPDATE CASCADE,
    PRIMARY KEY (StaffID, StartTime)
);