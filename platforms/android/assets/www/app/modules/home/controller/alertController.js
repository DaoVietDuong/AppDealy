homeModule.controller('alertController',
    ['$scope', '$window', '$stateParams', '$uibModalInstance', '$location', 'clientService', 'configService', '$cordovaOauth', '$http', 'authenticationService', '$route', '$state',
        'homeService',
        function ($scope, $window, $stateParams, $uibModalInstance, $location, clientService, configService, $cordovaOauth, $http, authenticationService, $route, $state,
            homeService) {
            function loadData(params) {
 
 setTimeout(function(){
$uibModalInstance.dismiss('cancel');
  }, 2000);
            }
            loadData();
        }])