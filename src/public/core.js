// public/core.js
var app = angular.module('JJLifts', ['ngRoute']);
// configure our routes
app.config(function($routeProvider, $locationProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl: '/pages/landing.html',
        controller: 'mainController'
    })

    //============================Staff function routing
    .when('/staff', {
        templateUrl: '/pages/staff.html',
        controller: 'staffController'
    })


    .when('/staff', {
        templateUrl: '/pages/staff.html',
        controller: 'staffController'
    })

    .when('/addMember', {
        templateUrl: '/pages/member.html',
        controller: 'staffController'
    })

    .when('/appoint', {
        templateUrl: '/pages/appointments.html',
        controller: 'staffController'
    })

    .when('/promote', {
        templateUrl: '/pages/promote.html',
        controller: 'staffController'
    })




    //==================================================

    //============================Member function routing
    .when('/browse', {
        templateUrl: '/pages/browseExercises.html',
        controller: 'mainController'
    })

    .when('/classes', {
        templateUrl: '/pages/listClasses.html',
        controller: 'mainController'
    })
    //===================================================

    $locationProvider.html5Mode(true);

});



function sanitize(str) {
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    return str.trim();
}

function isLegal(str) {
    if (sanitize(str) == str) return true;
    else return false;

}

app.controller('mainController', function($scope, $http) {

    $scope.$on('updateNav', function(event) {
        $scope.message = "Logout";
        $scope.nav = "/";
    });

    $scope.$on('updateNav2', function(event) {
        $scope.message = "Login";
        $scope.nav = "/staff";
    });

    $scope.update = function() {
        $scope.$emit('updateNav2');
    }

    $(function() {
        $('#datepicker').datepicker({
            onSelect: function(date) {
                $scope.listClasses(date);
            },
            inline: true,
            dateFormat: 'yy-mm-dd'
        });
    });

    function SendQuery(queryToSend, res) {
        $http.get('query', {
            params: {
                query: queryToSend,
            }
        })
            .success(function(data, status, headers, config) {
                if (data.error) {
                    $scope.error = data.error;
                    res(data.error);
                } else
                    res(data);

            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }



    $scope.rows = {};
    $scope.query = function() {
        $scope.error = '';
        var fname = $scope.fname;
        var lname = $scope.lname;
        // SendQuery("INSERT INTO Member VALUES(null,'" + fname + "','" + lname + "','" + membership + "');", function(res) {
        //     $scope.rows = res;
        // });
        SendQuery("SELECT s.StaffID, s.FName, s.LName, pta.Time, m.MemberID,m.FName, m.LName FROM Staff s NATURAL JOIN PersonalTrainingAppointment pta INNER JOIN Member m ON pta.MemberID = m.MemberID WHERE (s.FName = '" + fname + "') AND (s.LName = '" + lname + "') ORDER BY pta.Time ASC;", function(res) {
            $scope.rows = res;
        });
    }



    $scope.exercises = {}
    $scope.browse = function() {
        var group = $scope.combo;
        SendQuery("SELECT ex.ExerciseNo, ex.ExerciseName, ex.MuscleGroup,ex.StockNo, eq.EName AS EquipmentName, eq.Weight FROM Exercise ex LEFT OUTER JOIN Equipment eq ON ex.StockNo = eq.StockNo WHERE ex.MuscleGroup LIKE '%" + group + "%';", function(res) {
            $scope.exercises = res;
        });

    }

    $scope.classes = {}
    $scope.listClasses = function(date) {
        date = date.replace(/\//g, '-');
        SendQuery("SELECT fc.FCID, fc.FCName, fs.StaffID, s.FName, s.LName, fs.Location,fs.StartTime, fs.EndTime, TRUNCATE((fs.EndTime - fs.StartTime)/10000, 2) AS Hours_Minutes FROM FitnessClass fc INNER JOIN FitnessSession fs ON (fs.FCID = fc.FCID) INNER JOIN Staff s ON (fs.StaffID = s.StaffID) WHERE fs.StartTime LIKE '" + date + "%';", function(res) {
            $scope.classes = res;
        });
    }



});







app.controller('staffController', function($scope, $http) {
    $scope.$emit('updateNav');

    function SendQuery(queryToSend, res) {
        $http.get('query', {
            params: {
                query: queryToSend,
            }
        })
            .success(function(data, status, headers, config) {
                if (data.error) {
                    $scope.error = data.error;
                    res(data.error);
                } else
                    res(data);

            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    }

    $scope.addMember = function() {
        var FName = $scope.FName;
        var LName = $scope.LName;

        var Membership = $scope.combo;

        if (FName && LName && Membership) {
            if (isLegal(FName) && isLegal(LName)) {
                SendQuery("SELECT m.MemberID FROM Member m WHERE m.FName='" + FName + "' AND m.LName='" + LName + "' LIMIT 1;", function(res) {
                    if (res == "") {
                        if (FName && LName && Membership) {
                            SendQuery("INSERT INTO Member (FName, LName, Membership) VALUES ('" + FName + "', '" + LName + "', '" + Membership + "');", function(res) {
                                if (res.affectedRows > 0)
                                    $scope.response = "Success";
                                else $scope.response = "Something is deeply wrong here...";
                            });
                        } else $scope.response = "Please enter all fields!";
                    } else $scope.response = "Member already exists!";
                });
            } else $scope.response = "Illegal characters detected!"
        } else
            $scope.response = "Please enter all fields";

    }

    $scope.checkApp = function() {
        $scope.staffs = "";
        var FName = $scope.FName;
        var LName = $scope.LName;
        if (FName && LName) {
            if (isLegal(FName) && isLegal(LName)) {
                SendQuery("SELECT s.StaffID, s.FName, s.LName, pta.Time, m.MemberID,m.FName, m.LName FROM Staff s NATURAL JOIN PersonalTrainingAppointment pta INNER JOIN Member m ON pta.MemberID = m.MemberID WHERE (s.FName = '" + FName + "') AND (s.LName = '" + LName + "') ORDER BY pta.Time ASC;", function(res) {
                    if (res == "") {
                        $scope.response = "No Appointments";
                    } else {
                        $scope.staffs = res;
                        $scope.response = "";
                    }
                });
            } else $scope.response = "Illegal characters detected!";
        } else
            $scope.response = "Please enter all fields";
    }


    $scope.promote = function() {
        var FName = $scope.FName;
        var LName = $scope.LName;
        var bonus = parseInt($scope.commission);
        $scope.response = "";
        if (FName && LName && $scope.commission) {
            if (isLegal(FName) && isLegal(LName)) {
                if (bonus == $scope.commission && bonus > 0)
                    SendQuery("UPDATE Staff s SET Position='Personal Trainer', CommissionBonus=" + bonus + " WHERE s.FName = ('" + FName + "') AND s.LName = ('" + LName + "');", function(res) {
                        if (res.affectedRows == 0) $scope.response = "Staff member not found!";
                        else $scope.response = "Success";
                    });
                else
                    $scope.response = "Please enter a positive number for commission"
            } else $scope.response = "Illegal characters detected";
        } else
            $scope.response = "Please enter all fields";
    }




});