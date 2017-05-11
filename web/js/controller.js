/* global $ */


var app = angular.module('myApp', ['ngRoute']);

//app.service('sharedProperties', function() {
//    var email;
//    var setEmail
//            = function(str) {
//                alert(str)
//                email = str;
//            }
//    var getEmail
//            = function() {
//                return email;
//            }
//    return {
//        setEmail: setEmail,
//        getEmail: getEmail
//    }
//});

app.config(function($routeProvider) {
    $routeProvider
//            .when("/", {
//                templateUrl: "index.html",
//                controller: "homecontroller"
//            })
            .when("/signup", {
                templateUrl: "signup.html",
                controller: "signupcontroller"
            })
            .when("/login", {
                templateUrl: "login.html",
                controller: "logincontroller"
            })
            .when("/forget", {
                templateUrl: "forgetpassword.html",
                controller: "forgetcontroller"
            })
            .when("/quiz", {
                templateUrl: "quiz.html",
                controller: "quizcontroller"
            })
            .when("/logout", {
                template: " ",
                controller: "logoutcontroller"
            })
            .otherwise({
                redirectTo: 'index.html'
            });


});

//app.controller('homecontroller', function($scope) {
//    $scope.home=true;
//    if (sharedProperties.getProperty() === "undefined")
//    {
//        sharedProperties.setProperty(false);
//    } else
//    {
//        $scope.finish = sharedProperties.getProperty();
//    }
//});

app.controller('logincontroller', function($scope, $http, $location) {

    $scope.loginVarify = function() {
        var sessionId = sessionStorage.getItem("sessionId");
        if (sessionId === null) {
            $scope.email = $scope.email;
            var password = $scope.password;
            var params = {
                email: $scope.email,
                password: password,
                flag: 'L'
            };
            $http({
                method: "POST",
                url: "login",
                //data: "email=" + email + "&password=" + password,
                params: params,
            }).then(function mySuccess(response) {
                $scope.sessionId = response.data[0];
                $scope.logincounter = 0;
                var flag = response.data[1];
                $scope.userName = response.data[2];
                // localStorage.setItesecuritpasswordyDatam("sessionId", sessionId);

                if (flag === 'L' && $scope.sessionId !== '') {
                    alert($scope.sessionId);
                    $scope.myWelcome = "welcome" + $scope.userName;


                    sessionStorage.setItem("sessionId", $scope.sessionId);
                    sessionStorage.setItem("userName", $scope.userName);
                    sessionStorage.setItem("userMail", $scope.email);

                    $location.url("/index");

                }
                else if (flag === '' && $scope.sessionId === '') {
                    $scope.myWelcome = "session out"
                    $location.url("/login");
                }
                else {

                    $scope.myWelcome = "user does not exist";
                }
            }, function myError(response) {
                alert(response.data)

                $scope.myWelcome = response.statusText;
            });
        }
        else {
            alert("one user can login at a time");
        }
    }
});
app.controller('signupcontroller', function($scope, $http, $location) {
    $scope.signup = function() {
        var username = $scope.username;
        var email = $scope.email;
        var password = $scope.password;
        var confirmpassword = $scope.confirmpassword;
        var DOB = $scope.DOB;
        var contact = $scope.contact;
        var gender = $scope.gender;
        var securityQuestion = $scope.securityQuestion;
        var securityAnswer = $scope.securityAnswer;
        if (password !== confirmpassword) {
            $scope.err = 'password doesnot match with confirm password';
        }
        else {
            var params = {
                username: username,
                email: email,
                password: password,
                DOB: DOB,
                contact: contact,
                gender: gender,
                securityQuestion: securityQuestion,
                securityAnswer: securityAnswer,
                flag: 'S'
            };
            $http({
                method: "POST",
                url: "login",
                params: params,
            }).then(function mySuccess(response) {
                var dataSaved = response.data;
                alert(dataSaved);
                $location.url("/login");

            }, function myError(response) {
                alert(response.data)

                $scope.myWelcome = response.statusText;
            });
        }
    };
});

app.controller('forgetcontroller', function($scope, $http, $location) {
//    alert("inside forget controller");
    var email;
    $scope.getQuestion = true;
    $scope.verifyAnswer = false;
    $scope.resetPassword = false;
    var securityAnswer;
    $scope.securityQuestion = function() {
//        alert("inside security question method")
//        alert($scope.email);
        email = $scope.email;
        var params = {
            email: email,
            flag: 'F'
        };
        $http({
            method: "POST",
            url: "forget",
            params: params,
        }).then(function mySuccess(response) {
            var securityData = response.data;

            var securityQuestion = securityData[0];
            securityAnswer = securityData[1];
            alert(securityQuestion);
            if (securityQuestion !== '') {
                $scope.getQuestion = false;
                $scope.verifyAnswer = true;
                $scope.securityq = securityQuestion;
            }
            else {
                $scope.myMail = "mail doesnot exist";
            }
        }, function myError(response) {
            alert(response.data);
        });
    }
    $scope.checkAnswer = function() {
//        alert("inside security question method")
        var answer = $scope.securityA;

        if (securityAnswer.toString().toLowerCase() === answer.toString().toLowerCase()) {
            $scope.getQuestion = false;
            $scope.verifyAnswer = false;
            $scope.resetPassword = true;
        }
        else {
            $scope.answerErr = "Enter correct answer";
        }
    }
    $scope.submitPassword = function() {
        var password = $scope.password;
        var confirmpassword = $scope.confirmpassword;
        if (password !== confirmpassword) {
            $scope.err = 'password doesnot match with confirm password';
        }
        else {
            var params = {
                password: password,
                email: email,
                flag: 'R'
            };
            $http({
                method: "POST",
                url: "forget",
                params: params,
            }).then(function mySuccess(response) {
//                alert(response.data);
                $scope.err = "";
                $scope.securityq = "";
                $scope.email = "";
                $scope.securityA = "";
                $scope.successText = "Congratulations! your password reset successfully";
                $location.url("/login.html");
            }, function myError(response) {
                alert(response.data);
                $scope.successText = "Try Again!";
            });
        }
    }
});

app.controller("quizcontroller", function($scope, $http, $location) {
//    var sessionId = sharedProperties.getProperty();

    var sessionId = sessionStorage.getItem("sessionId");
    $scope.username = sessionStorage.getItem("userName");
    $scope.userName = "Welcome " + $scope.username;

    if (sessionId !== null) {
        $scope.selectCategory = true;
        $scope.done = false;
        
        $scope.getQuestions = function() {
            $scope.category = $scope.categories;
            $scope.quizForm = false;
            $scope.testSubmit = false;

            var params = {
                category: $scope.category,
                flag: 'G'
            };
            if ($scope.category !== undefined)
            {
                $http({
                    method: "POST",
                    url: "getQuestion",
                    params: params,
                }).then(function mySuccess(response) {
                    $scope.data = response.data;
                    $scope.correctanswer = [];
                    $scope.selectCategory = false;
                    $scope.quizForm = true;
                    $scope.testId = $scope.username.substring(0, 2) + $scope.category + "_" + sessionId.substring(0, 2) + Math.floor((Math.random() * 100) + 1);
                    $scope.testName = $scope.category + " Quiz";

                    angular.forEach($scope.data, function(key, value) {
                        $scope.correctanswer.push(key.correctanswer);
                    });

                    var date = new Date();
                    $scope.startTime = date.getTime();
                    $scope.minutes = date.getMinutes() + 10;
                    date.setMinutes($scope.minutes);
                    $("#timer").countdown(date)
                            .on('update.countdown', function(event) {
                                $(this).text(
                                        event.strftime('%H:%M:%S')
                                        );
                            })
                            .on('finish.countdown', function(event) {
                                alert("Sorry, Your time is up!");
                                $scope.quizSubmit();
                            });

                }, function myError(response) {
                    alert(response.data);

                });
            }
            else
            {
                $scope.err = "Please select an option";
            }
        }

    }
    else {
        alert("plz login to continue");
        $location.url("/login");
    }


    $scope.quizSubmit = function() {
        $scope.score = 0;
        $scope.arr = $scope.correctanswer.reverse();
        $scope.testTime = $("#timer").text();
        $scope.timeTaken = (new Date().getTime() - $scope.startTime) / 1000;
        alert("Time taken is : " + $scope.timeTaken);
        for (var i = 1; i <= 10; i++) {
            $scope.answer = $scope.arr.pop();
            $("table[id=" + i + "] input[type=radio]").each(function() {
                if ($(this).attr("checked") === "checked") {
                    if ($(this).val() === $scope.answer)
                    {
                        $(this).closest("td").attr("class", "isCorrect_true");
                        $scope.score++;
                    }
                    else
                    {
                        $(this).closest("td").attr("class", "isCorrect_false");
                        if ($scope.score > 0)
                        {
                            $scope.score--;
                        }
                    }
                }
                else
                {
                    $(this).closest("tr").parent().find("tr").find("td[id=" + $scope.answer + "_" + i + "]").attr("class", "isCorrect_true");
                }
            });
        }
        $scope.usermail = sessionStorage.getItem("userMail");
        alert($scope.usermail);
        var params = {
            category: $scope.category,
            score: $scope.score,
            username: $scope.username,
            testid: $scope.testId,
            usermail: $scope.usermail,
            testdate: new Date($.now()),
            testTime: $scope.timeTaken,
            flag: 'S'
        }
        $http({
            method: "POST",
            url: "saveTestData",
            params: params,
        }).then(function mySuccess(response) {
            $scope.data = response.data;
            alert("Your score is :" + $scope.score);
            $('#timer').countdown('stop');
            $scope.done = true;
            $scope.testSubmit = true;
            if ($scope.score > 5)
            {
                $scope.printCerti = true;
            }
        }, function myError(response) {
            alert(response.data);

        });
    }
});

app.controller("logoutcontroller", function($scope, $location, $http) {
//    alert("into logout controller");
//    $scope.finish = false;
    var sessionId = sessionStorage.getItem("sessionId");
    if (sessionId !== null)
    {
        var param = {
            flag: 'LO'
        };
        $http({
            method: "POST",
            url: "login",
            params: param,
        }).then(function mySuccess(response) {
            alert(response.data);
            sessionStorage.removeItem("sessionId");
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("userMail");
            $location.url("/");
        }, function myError(response) {
            alert(response.data);
        });
    }
    else
    {
        alert("Please login");
        $location.url("/login");
    }
});
