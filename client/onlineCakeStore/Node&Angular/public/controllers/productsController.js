/**
 * Created by lior on 21/06/2017.
 */
angular.module('myApp').controller('productsController',
        [
            '$http', '$scope','$log','UserService','ModalService' ,'ShoppingCartService','$window', function( $http , $scope, $log, UserService, ModalService, ShoppingCartService, $window) {
            var vm = this;
            vm.products =  [];
            vm.categories = [];
            vm.userService = UserService;
            vm.recommandedProducts = [];

            //get all cakes
            var requestUrl = 'http://localhost:4000/cakes';
            $http.get(requestUrl).then(function (response) {
                //$log.info("products", response);
                vm.products = response.data;

                //get all categories
                var requestUrl = 'http://localhost:4000/Categories';
                $http.get(requestUrl).then(function (response) {
                    vm.categories = response.data;
                    vm.categories.push({
                        "category_name": "all",
                        "category_id": "100",
                    });
                    vm.selectedCategory = vm.categories[vm.categories.length-1];

                    //for search cakes by name
                    $scope.products=vm.products;

                    //for sorting cakes
                    $scope.sortCakes="cake_name";

                    if( vm.userService.isLoggedIn)
                    {
                        var requestUrl = 'http://localhost:4000/recomendedCakes/' + vm.userService.token;
                        $http.get(requestUrl).then(function (response) {
                            vm.recommandedProducts = response.data;
                        }, function (errResponse) {
                            console.error('Error while fetching notes');
                        });
                    }

                }, function (errResponse) {
                    console.error('Error while getting categories');
                });
            }, function (errResponse) {
                console.error('Error while getting cakes');
            });

            vm.Currency = "NIS";
            vm.ShowRecomanded = false;

            vm.getProductsByCategory = function (categoryID) {
                if(categoryID == "100")
                    var requestUrl = 'http://localhost:4000/cakes'
                else
                    var requestUrl = 'http://localhost:4000/cakes?category=' + categoryID;

                $http.get(requestUrl).then(function (response) {
                    vm.products = response.data;
                }, function (errResponse) {
                    console.error('Error while fetching products by category');
                });
            };

            vm.getRecomandedProducts = function () {
                var requestUrl = 'http://localhost:4000/recomendedCakes/' + app.client.clientID ;
                $http.get(requestUrl).then(function (response) {
                    vm.recommandedProducts = response.data;
                }, function (errResponse) {
                    console.error('Error while fetching recomended cakes');
                });
            };

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


//modal controller
angular.module('myApp').controller('ModalController', function($scope,currentCake,close) {

    $scope.display = true;
    $scope.current = currentCake;
    $scope.close = function() {
        $scope.display = false;
        close();
    };

});


//search filter - search cakes by their name
angular.module('myApp').filter('searchFilter', [function() {
    return function (products, searchString)
    {
        if(!searchString) {
            return products;
        }
        searchString = searchString.toLowerCase();

        var result = [];
        angular.forEach(products, function(el){
            if(el.cake_name.toLowerCase().indexOf(searchString) !== -1) {
                result.push(el);
            }
        });
        return result; };
}]);