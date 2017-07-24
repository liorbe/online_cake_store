

angular.module('myApp').factory('UserService', ['$http','localStorageService','ShoppingCartService', function($http, localStorageService,ShoppingCartService) {
    var service = {};
    service.isLoggedIn = false;
    service.date ='';
    service.username = "Guest";

    service.login = function(user) {
        return $http.post('http://localhost:4000/login', user)
            .then(function(response) {

                var token = response.data;
                if(token !== undefined && token !== '')
                {
                    $http.defaults.headers.common = {
                        'my-Token': token,
                        'user' : user.username,
                    };
                    service.isLoggedIn = true;
                    service.token = token;
                    service.username = user.username;
                    localStorageService.cookie.set('cakesStore', token.toString()+"$"+ new Date().toLocaleDateString());
                    localStorageService.cookie.set('username_pass', user.username+"$"+ user.password);
                    ShoppingCartService.getCart(service.token).then( function () {
                        return Promise.resolve(response);
                    });
                }
                else {
                    return Promise.reject(e);
                }

            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);