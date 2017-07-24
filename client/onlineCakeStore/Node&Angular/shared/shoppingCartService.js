angular.module('myApp').factory('ShoppingCartService', ['$http','localStorageService', function($http, localStorageService) {
    var service = {};
    service.cart = [];

    service.getCart = function(token) {
        return $http.get('http://localhost:4000/shoppingCart/?clientID='+token)
            .then(function(response) {

                var cart = response.data.products;
                if(cart != undefined && cart != '')
                {
                    service.cart = cart;
                }
                return cart;
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    service.updateCart = function(token) {
        return $http.put('http://localhost:4000/shoppingCart/?clientID='+token, service.cart)
            .then(function(response) {

                var cart = response.data[0];
                if(cart != undefined && cart != '')
                {
                    service.cart = cart;
                }
                return Promise.resolve(cart);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };


    service.addToCart = function(product, token) {
        product.amount = 1;
        service.cart.push(product);
        var cartToUpdate = new Object();
        cartToUpdate.client_id = token;
        cartToUpdate.products = service.cart;
        return $http.put('http://localhost:4000/shoppingCart/?clientID='+token, cartToUpdate)
            .then(function(response) {
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    service.removeFromCart = function(product, token) {
        var index = service.cart.map(function(e) { return e.cake_id; }).indexOf(product.cake_id);
        if (index > -1) {
            service.cart.splice(index, 1);
        }
        var cartToUpdate = new Object();
        cartToUpdate.client_id = token;
        cartToUpdate.products = service.cart;
        return $http.put('http://localhost:4000/shoppingCart/?clientID='+token, cartToUpdate)
            .then(function(response) {
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };

    return service;
}]);