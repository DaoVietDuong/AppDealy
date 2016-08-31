
var homeController = homeModule.controller('homeController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService',
        'homeService',
        function($scope, $window, $stateParams, $uibModal, $location, clientService, configService, 
            homeService) {
            var config = configService.config;
            $scope.data = homeService.tempData;
            $scope.target = "";
            var loadData = function() {
                if(clientService.getKeyLocal('thanh-pho'))
                {
                    
                    $scope.target = clientService.getKeyLocal('thanh-pho');
                }
                else{
                    $scope.target = homeService.defaultCity;
                }
                
            };
            loadData();
            
            $scope.change = function() {
                //alert( $scope.target);
                clientService.setKeyLocal('thanh-pho', $scope.target);
                console.log($scope.target);
                $window.location.reload(); 
            };
        }])