homeModule.factory('indexService', [
    '$resource', '$http', '$window', 'configService',
    function ($resource, $http, $window, configService) {
        var rootUrl = configService.urlConnectToServer;
        var result = {
            getMasterData: function () {
                // $http returns a promise, which has a then function, which also returns a promise
                var item = $http.get(rootUrl + '/api/danh-muc')
                    .then(function (response) {
                        return response.data;
                    });
                // Return the promise to the controller
                return item;
            },
            getCategories: function (slugCity, slugCategory) {
                // $http returns a promise, which has a then function, which also returns a promise
                var item = $http.get(rootUrl + '/api/' + slugCity + '/dia-diem/danh-muc/' + slugCategory)
                    .then(function (response) {

                        return response.data;
                    });
                // Return the promise to the controller
                return item;
            },
            getDetailCategory: function (slugCity, slugAdress) {
                var item = $http.get(rootUrl + '/api/' + slugCity + '/dia-diem/' + slugAdress)
                    .then(function (response) {
                        return response.data;
                    });
                // Return the promise to the controller
                return item;
            },
            getDetailCategoryById: function (storeId, callback) {
                var item = $http.get(rootUrl + '/api/dia-diem/' + storeId).success(callback);
                // Return the promise to the controller
                return item;
            },

        };
        return result;

    }
])


var indexController = homeModule.controller('indexController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService',
        'indexService',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService,
            indexService) {
            var config = configService.config;
            $scope.categories = [];
            $scope.data = [];
            $scope.itemCategories = {};
            $scope.initItemCategory = function (slugCategory) {
                if (clientService.getKeyLocal('thanh-pho')) {
                    var slugCity = clientService.getKeyLocal('thanh-pho');
                    indexService.getCategories(slugCity, slugCategory).then(function (data) {
                        $scope.itemCategories[slugCategory] = data;

                    })
                } else {
                    var slugCity = 'hai-phong';
                    indexService.getCategories(slugCity, slugCategory).then(function (data) {
                        $scope.itemCategories[slugCategory] = data;

                    })
                }
            }
            var loadData = function () {
                indexService.getMasterData().then(function (data) {
                    angular.forEach(data, function (value, key) {
                        if (value.parent_id > 0)
                            $scope.categories.push(value);
                    });

                });
            };
            loadData();
        }])
var indexDetailController = homeModule.controller('indexDetailController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService',
        'indexService',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService,
            indexService) {
            var config = configService.config;
            var slugAddress = $stateParams.slugAddress;
            var storeId = $stateParams.storeId;
            $scope.target = {};

            var loadData = function () {
                indexService.getDetailCategoryById(storeId, function (data) {
                    $scope.target = data;
                });
                // if (clientService.getKeyLocal('thanh-pho')) {
                //     var slugCity = clientService.getKeyLocal('thanh-pho').slug;
                //     indexService.getDetailCategory(slugCity, slugAddress).then(function (data) {
                //         $scope.target = data;
                //     });

                // } else {
                //     var slugCity = 'hai-phong';
                //     indexService.getDetailCategory(slugCity, slugAddress).then(function (data) {
                //         $scope.target = data;

                //     })
                // }
            }
            loadData();
        }])
