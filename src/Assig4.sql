#Staff
#1 PT Appointments for a given Staff
#the input would be first and last name 
#Brandon Allen is simply an example

--STAFFFFF
----VIEW PERSONAL TRAINING APPOINTMENTS
SELECT s.StaffID, s.FName, s.LName, pta.Time, m.MemberID,m.FName, m.LName
FROM Staff s NATURAL JOIN PersonalTrainingAppointment pta INNER JOIN Member m ON pta.MemberID = m.MemberID
WHERE (s.FName = 'Brandon') AND (s.LName = 'Allen')
ORDER BY pta.Time ASC
;



#2 Insert a new gym Member
#the inputs would be firstname, lastname, and Membership
#('Naila', 'Nur', 'Silver') is just an example

--STAFF
-----SOMEONE JOINS THE GYM
INSERT INTO Member (FName, LName, Membership) VALUES ('Ray', 'Allen', 'Silver');


#3 Modify fitness session time
#They need to identify the PK of the FitnessSession table {FCID, StaffID, StartTime}
#then they need to enter the new start and end time

#foundID = SELECT FCID FROM FitnessSession fc WHERE fc.FCName = 'Boxing1';

--STAFF 
-----Reschedule Personal Training Appointment
UPDATE FitnessSession fs SET fs.StartTime ='2015-1-21 09:00:00', fs.EndTime='2014-1-21 10:00:00'
WHERE fs.FCID = (SELECT fc.FCID FROM FitnessClass fc WHERE fc.FCName = 'Boxing1')
AND fs.StaffID= (SELECT s.StaffID FROM Staff s WHERE s.FName = 'Brandon' AND s.LName = 'Allen')
AND fs.StartTime= ('2015-1-21 08:00:00')
;

#STAFF
#OUTPUT to the user to know they got an update successful
SELECT s.FName, s.LName, fc.FCName, fs.StartTime, fs.EndTime
FROM Staff s NATURAL JOIN FitnessSession fs INNER JOIN FitnessClass fc ON fs.FCID = fc.FCID
WHERE fs.FCID = (SELECT fc.FCID FROM FitnessClass fc WHERE fc.FCName = 'Boxing1')
AND fs.StaffID= (SELECT s.StaffID FROM Staff s WHERE s.FName = 'Brandon' AND s.LName = 'Allen')
#has to be the NEW start time
AND fs.StartTime= '2015-1-21 09:00:00'
;



UPDATE Staff s
SET Position='Personal Trainer', CommissionBonus= CommissionBonus+ (1000)
WHERE s.FName = ('Terry') AND s.LName = ('Day')
;




#4 List exersize by muscle group (eg: abs)
#We want to use LIKE"%STUFF%"
#because some exercises use multiple muscle groups ie: Pushups do chest and triceps
#


--MEMBER
-----Browse exercises
SELECT ex.ExerciseNo, ex.ExerciseName, ex.MuscleGroup,ex.StockNo, eq.EName AS EquipmentName, eq.Weight
#takes into consideration tables that dont incorporate any Equipment (ie: sit ups)
FROM Exercise ex LEFT OUTER JOIN Equipment eq ON ex.StockNo = eq.StockNo
#input the variable in between % %. (ie: ..."LIKE '%	"+varName+"	%'	")
WHERE ex.MuscleGroup LIKE '%Triceps%'
;	


#5 List FitnessSessions starting and ending between certain times
#The paramaters are fs.StartTime, and fs.EndTime
--MEMBER
-----List Fitness Classes
SELECT fc.FCID, fc.FCName, fs.StaffID, s.FName, s.LName, fs.Location,fs.StartTime, fs.EndTime, TRUNCATE((fs.EndTime - fs.StartTime)/10000, 2) AS Hours_Minutes
FROM FitnessClass fc INNER JOIN FitnessSession fs ON (fs.FCID = fc.FCID)
INNER JOIN Staff s ON (fs.StaffID = s.StaffID)
WHERE fs.StartTime >= '2014-11-15 08:00:00' 
;
