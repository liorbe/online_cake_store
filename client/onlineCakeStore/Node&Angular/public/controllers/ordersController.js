angular.module('myApp')
//insert your key in APPID after registration
    .controller('ordersController',
        [
            '$http', '$scope','$log','UserService','ModalService' ,'ShoppingCartService','$window', function( $http , $scope, $log, UserService, ModalService, ShoppingCartService, $window) {
            var vm = this;
            vm.userService = UserService;
            vm.orders = [];
            //get all cakes
            var requestUrl = 'http://localhost:4000/orders/?client_id=' + vm.userService.token;
            $http.get(requestUrl).then(function (response) {
                //$log.info("products", response);
                vm.orders = response.data;

            }, function (errResponse) {
                console.error('Error while getting orders');
            });


            vm.show = function (order_id) {
                var requestUrl = 'http://localhost:4000/cakesInOrder/' + order_id;
                $http.get(requestUrl).then(function (response) {
                    //$log.info("products", response);
                    var order = response.data;
                    $scope.message = "";
                    ModalService.showModal({
                        templateUrl: 'modal.html',
                        controller: "orderModalController",
                        inputs: {
                            order: order,
                        }
                    });
                }, function (errResponse) {
                    console.error('Error while getting order');
                });

            };
        }]);


//order modal controller
angular.module('myApp').controller('orderModalController', function($scope,order,close) {

    $scope.display = true;
    $scope.cakes = order;
    $scope.try = "lior";
    $scope.close = function() {
        $scope.display = false;
        close();
    };

});