/**
 * Created by lior on 26/06/2017.
 */

angular.module('myApp').controller('homeController', ['UserService', '$http','localStorageService','ShoppingCartService','ModalService','$window', '$scope', function (UserService, $http,localStorageService,ShoppingCartService,ModalService,$window, $scope) {
    var vm = this;
    vm.userService = UserService;
    vm.HotProducts = [];
    vm.LastMonthProducts = [];
    // $scope.LastMonthProducts = [];
    if(!UserService.isLoggedIn) // Guest
    {
            // get last month products
            var requestUrl = 'http://localhost:4000/HotCakes';
            $http.get(requestUrl).then(function (response) {
                vm.HotProducts = response.data;
            }, function (errResponse) {
                console.error('Error while getting cakes');
            });
    }

    else{ //user already logged in before

        var requestUrl = 'http://localhost:4000/HotCakes';
        $http.get(requestUrl).then(function (response) {
            vm.HotProducts = response.data;
            var requestUrl = 'http://localhost:4000/cakesLastMonth';
            $http.get(requestUrl).then(function (response) {   //get last month products
                vm.LastMonthProducts = response.data;

            }, function (errResponse) {
                console.error('Error while getting cakes');
            });

        }, function (errResponse) {
            console.error('Error while getting cakes');
        });



    }

    vm.show = function(product) {
        $scope.message = "";
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: "ModalController",
            inputs: {
                currentCake: product,
            }
        });
    };


    vm.addToCart = function(product)
    {
        var productToAdd = new Object();
        productToAdd.cake_id = product.cake_id;
        productToAdd.cake_name = product.cake_name;
        productToAdd.amount = product.amount;
        productToAdd.description = product.description;
        productToAdd.weight = product.weight;
        productToAdd.price = product.price;
        productToAdd.shape = product.shape;
        productToAdd.picture_path = product.picture_path;

        ShoppingCartService.addToCart(productToAdd,UserService.token);
        $window.alert('The product added successfully to your cart');
    };


}]);