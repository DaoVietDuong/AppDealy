homeModule.factory('homeService',
    ['$resource', '$http', '$window', 'clientService', 'configService',
        function ($resource, $http, $window, clientService, configService) {
            var result = {
                config: configService,
                client: clientService,
            };
            result.defaultCity = "ha-noi";
            
            var rootUrl = configService.urlConnectToServer;
            var tempData = $window.CacheManager();
            var cacheStatus = tempData.cacheStatus;
            result.cacheStatus = cacheStatus;
            result.tempData = tempData;

            function initData() {

                tempData.register('cities', null, function () {
                   return $resource(rootUrl+ '/api/thanh-pho').query({}, isArray = true);
                });

            }
            initData();
            return result;
        }])