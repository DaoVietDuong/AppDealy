ngServices.factory('configService', [
    '$resource', '$http', '$window', '$injector',
    function ($resource, $http, $window, $injector) {
        var result = {
            urlConnectToServer: "https://dealy.vn"
        };
        
        return result;
    }
])