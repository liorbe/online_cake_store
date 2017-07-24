
/**
 * Created by lior on 21/06/2017.
 */
angular.module('myApp')
//insert your key in APPID after registration
    .controller('registerController',
        [
            '$http', '$scope','$log','UserService','ModalService' ,'ShoppingCartService','$window','$location', function( $http , $scope, $log, UserService, ModalService, ShoppingCartService, $window, $location) {
            var vm = this;
            vm.user = new Object();
            vm.user.categories = [];
            vm.categories = [];
            vm.selectedCategories =[];
            vm.selectedCountry ='Israel';

            vm.emails = [];
            $scope.countries = [];
            function readcontriesFromXML() {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("GET", "countries.xml", false);
                xmlhttp.send();
                var xmldata = xmlhttp.responseXML;
                var data = xmldata.getElementsByTagName("Country");
                for(i = 0; i < data.length; i++) {
                    $scope.countries.push(data[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue);
                }
            }
            readcontriesFromXML();

                //get all categories
                var requestUrl = 'http://localhost:4000/Categories';
                $http.get(requestUrl).then(function (response) {
                    vm.categories = response.data;
                }, function (errResponse) {
                    console.error('Error while getting categories');
                });

                vm.register = function(valid) {
                    var mail = new Object();
                    mail.mail = vm.user.mail;
                    vm.user.categories = vm.selectedCategories;
                        return $http.post('http://localhost:4000/register', vm.user)
                            .then(function (response) {
                                //$window.alert('You are logged in');
                                if(response.data[0].result = "true")
                                {
                                    $location.path('/login');
                                    //vm.user = new Object();
                                }
                                else
                                    $window.alert('Registration has failed - The email already exists in the system');
                            }, function (error) {
                                $window.alert('Registration has failed');
                            });
                    }

}])