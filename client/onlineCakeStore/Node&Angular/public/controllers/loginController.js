//login controller
angular.module('myApp').controller('loginController', ['UserService', '$location', '$window', '$http',
    function(UserService, $location, $window, $http) {
        var self = this;
        self.retrivePass = false;
        self.user = {username: '', password: ''};
        self.username = '';
        self.password = '';
        self.primary_school ='';
        self.mother_surname = '';
        self.showPass = false;
        self.pass = '';
        self.usernameToRetrive = '';
        self.error = '';
        self.showError = false;

        self.retrivePassShow = function()
        {
            self.retrivePass = true;
        };

        self.login = function(valid) {
            if (valid) {
                self.user.username = self.username;
                self.user.password = self.password;
                UserService.login(self.user).then(function () {
                    $window.alert('You are logged in');
                    $location.path('/home');
                }, function (error) {
                    self.errorMessage = error.data;
                    $window.alert('log-in has failed');
                })
            }
        };

        self.retrivePassword =  function() {
            return $http.get('http://localhost:4000/passwordRetrival?school='+self.primary_school+'&surname=' + self.mother_surname + '&username='+ self.usernameToRetrive )
                .then(function (response) {
                    //$window.alert('You are logged in');
                    if(response.data.length>0)
                    {
                        self.showPass = true;
                        self.showError = false;
                        self.pass = response.data[0].password;
                    }
                    else{
                        self.error = "The answers are wrong!"
                        self.showError = true;
                        self.showPass = false;

                    }
                }, function (error) {
                    $window.alert('log-in has failed');
                });
        };

    }]);