
angular.module('myApp')
//insert your key in APPID after registration
    .controller('cartController',
        [
            '$http', '$scope','$log','UserService','ShoppingCartService', 'ModalService', function( $http , $scope, $log, UserService, ShoppingCartService, ModalService) {
            //ShoppingCartService.getCart(UserService.token);

            var vm = this;
            vm.cart =  [];
            vm.userService = UserService;
            vm.Currency = "NIS";
            vm.cart = ShoppingCartService.cart;
            // vm.totalPrice =0;
            // vm.totalAmount =0;
            $scope.totalPrice =0;
            $scope.totalAmount =0;

            if(UserService.isLoggedIn && vm.cart.length == 0)
            {
                vm.cart = ShoppingCartService.getCart(UserService.token);
            }

            for( i=0 ;i<vm.cart.length; i++)
            {
                $scope.totalPrice += parseInt(vm.cart[i].price);
                $scope.totalAmount += parseInt(vm.cart[i].amount);
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

            vm.removeFromCart = function(product)
            {
                var productToRemove = new Object();
                productToRemove.cake_id = product.cake_id;
                productToRemove.cake_name = product.cake_name;
                productToRemove.amount = product.amount;
                productToRemove.description = product.description;
                productToRemove.weight = product.weight;
                productToRemove.price = product.price;
                productToRemove.shape = product.shape;
                productToRemove.picture_path = product.picture_path;

                ShoppingCartService.removeFromCart(productToRemove,UserService.token);
                vm.cart = ShoppingCartService.cart;

                    $scope.totalPrice -= parseInt( productToRemove.price);
                    $scope.totalAmount -= parseInt( productToRemove.amount );

            };

        }]);
