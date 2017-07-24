
var app = angular.module('myApp', ['LocalStorageModule','ngRoute', 'angularModalService']);
//-------------------------------------------------------------------------------------------------------------------
//main controller
app.controller('mainController', ['UserService', '$http','localStorageService','ShoppingCartService', function (UserService, $http,localStorageService,ShoppingCartService) {

    var vm = this;
    vm.userService = UserService;
    var user = {username: '', password: ''};

    var cookie = localStorageService.cookie.get('cakesStore');
    var cookie2 = localStorageService.cookie.get('username_pass');
    if(cookie && cookie2 && !UserService.isLoggedIn) // user already logged in before -> cookie
    {
        user.username = cookie2.split('$')[0];
        user.password = cookie2.split('$')[1];
            vm.userService.login(user).then(function () {
                vm.userService.date = cookie.split('$')[1];
            });
    }
}]);

//-------------------------------------------------------------------------------------------------------------------
//routing
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/welcome.html",
        })
        .when("/home", {
            templateUrl : "views/home.html",
           // controller : "homeController as homeCtrl"
        })
        .when("/login", {
            templateUrl : "../shared/login.html",
            controller : "loginController"
        })
        .when("/register", {
            templateUrl : "views/register.html",
        })
        .when("/about", {
            templateUrl : "views/about.html",
        })
        .when("/products", {
            templateUrl : "views/products.html",
        })
        .when("/cart", {
            templateUrl : "views/cart.html",
        })
        .when("/orders", {
            templateUrl : "views/orders.html",
        })

        .otherwise({redirect: '/',
        });
}]);
//-------------------------------------------------------------------------------------------------------------------
