homeModule.factory('discountService', [
    '$resource', '$http', '$window', 'configService',
    function ($resource, $http, $window, configService) {
        var rootUrl = configService.urlConnectToServer;
        var result = {
            getAll: function (slugCity, callback) {
                $http.get(rootUrl + '/api/' + slugCity + '/uu-dai')
                    .success(callback);
            },
            getDetail: function (dealId, callback) {
                $http.get(rootUrl + '/api/uu-dai/chi-tiet/' + dealId)
                    .success(callback);
            },
            getMyDiscount: function (token, callback) {
                $http.get(rootUrl + '/api/tai-khoan?api_token=' + token).success(callback).error(function (params) {
                    alert('Thông báo lỗi' + params);
                });
            },
            postBuyDiscount: function (data, slug, token, callback) {
                $http.post(rootUrl + '/api/uu-dai/' + slug + '/mua?api_token=' + token, data)
                    .success(callback).error(function (er) { alert('Thông báo lỗi: ' + er); });
            },
            postUseDiscount: function (data, token, callback) {
                $http.post(rootUrl + '/api/tai-khoan/su-dung-uu-dai?api_token=' + token, data)
                    .success(callback).error(function (er) { alert('Thông báo lỗi: ' + er); });
            },
            getAddressById: function (id, callback) {
                $http.get(rootUrl + '/api/dia-diem/' + id).success(callback).error(function (er) { alert('Thông báo lỗi: ' + er); })
            },
        };
        return result;

    }
])

var discountController = homeModule.controller('discountController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService', 'discountService', 'blockUI',
        'homeService',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService, discountService, blockUI,
            homeService) {
            var config = configService.config;

            var slugCity = clientService.getKeyLocal('thanh-pho') ? clientService.getKeyLocal('thanh-pho') : homeService.defaultCity;
            $scope.data = [];
            function loadData() {
                var myBlockUI = blockUI.instances.get('myBlockUI');
                myBlockUI.start();
                discountService.getAll(slugCity, function (response) {
                    angular.forEach(response, function (item, key) {
                        discountService.getAddressById(item.store_id, function (respData) {
                            var extendAddress = { store_name: respData.name, address_store: respData.address };
                            var objDest = {};
                            angular.extend(objDest, item, extendAddress);
                            $scope.data.push(objDest);
                        });
                    });
                    myBlockUI.stop();
                });

            };

            loadData();
        }]);
var discountDetailController = homeModule.controller('discountDetailController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService', 'discountService',
        'homeService', 'blockUI',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService, discountService,
            homeService, blockUI) {

            var config = configService.config;
            var slug = $stateParams.uuDaiSlug;
            var dealId = $stateParams.dealId;
            var token = clientService.getKeyLocal('tokenWeb');
            $scope.target = {};
            $scope.dayLeft = clientService.dayLeft;
            function loadData() {
                var myBlockUI = blockUI.instances.get('myBlockUI');
                myBlockUI.start();
                discountService.getDetail(dealId, function (response) {

                    discountService.getAddressById(response.store_id, function (respData) {

                        var extendAddress = { store_name: respData.name, address_store: respData.address };
                        var objDest = {};
                        angular.extend(objDest, response, extendAddress);
                        $scope.target = objDest;
                        $scope.target.point_type = 'buy_point';
                        myBlockUI.stop();
                    });
                });
            };
            $scope.clientService = clientService;
            $scope.buy = function (item, _quantity) {
                if (isNaN(_quantity) || _quantity <= 0) { alert('Nhập số lượng chưa chính xác'); return; }
                var buyPoint = item.point_type;
                var data = { quantity: _quantity, point_type: buyPoint };
                discountService.postBuyDiscount(data, item.slug, token, function (rs) {
                    alert(rs.message);
                    $scope.quantity = "";
                })
            }

            loadData();
        }])
var useDiscountController = homeModule.controller('useDiscountController',
    ['$scope', '$window', '$stateParams', '$state', '$uibModal', '$location', 'clientService', 'configService', 'discountService',
        'homeService', 'blockUI',
        function ($scope, $window, $stateParams, $state, $uibModal, $location, clientService, configService, discountService,
            homeService, blockUI) {
            var config = configService.config;

            var token = clientService.getKeyLocal('tokenWeb');
            $scope.data = [];
            $scope.myInfo = {};
            $scope.clientService = clientService;
            function loadData() {
                var myBlockUI = blockUI.instances.get('myBlockUI');
                myBlockUI.start();
                discountService.getMyDiscount(token, function (response) {
                    $scope.myInfo = response[0].wallet;
                    angular.forEach(response[0].inventories, function (item, key) {
                        discountService.getAddressById(item.deal.store_id, function (respData) {

                            var extendAddress = { store_name: respData.name, address_store: respData.address };
                            var objDest = {};
                            angular.extend(objDest, item, extendAddress);
                            $scope.data.push(objDest);
                            myBlockUI.stop();
                        });
                    });
                    myBlockUI.stop();
                });
            };
            $scope.dayLeft = clientService.dayLeft;
            $scope.use = function (item, _quantity) {
                alertUse();
                if (isNaN(_quantity) || _quantity <= 0) { alert('Nhập số lượng chưa chính xác'); return; }
                var data = { quantity: _quantity, deal_id: item.deal_id };
                discountService.postUseDiscount(data, token, function (response) {
                    $scope.quantity = "";
                    $state.go('discountDetail', { dealId: item.deal.id, type: 'uu-dai', uuDaiSlug: item.deal.slug });
                })
            };
            function alertUse() {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/modules/home/view/alert.html',
                    controller: 'alertController',
                    resolve: {}
                });
            }
            loadData();
        }])