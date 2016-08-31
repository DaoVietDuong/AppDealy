var mainApp = angular.module('mainApp', [
    'ngResource', 'ui.bootstrap', 'ui.router', 'ngRoute',
    'ngDirectives', 'ngFilters', 'ngControllers', 'ngServices', 'ngMaterial',
    'homeModule',
]);

mainApp.config(['$windowProvider', '$stateProvider', '$httpProvider', '$urlRouterProvider', '$routeProvider', '$locationProvider',
    function ($windowProvider, $stateProvider, $httpProvider, $urlRouterProvider, $routeProvider, $locationProvider) {
        var window = $windowProvider.$get('$window');
        var moduleRoot = '/';
        var moduleUrl = function (url) {
            var result = url;
            if (moduleRoot) {
                result = (moduleRoot + '/' + url).replace('//', '/');
            }
            return result;
        };
        window.alert = function (txt) {
   navigator.notification.alert(txt, null, "Thông báo", "Đóng");
};
        // $routeProvider.
        // when('/home', {
        // templateUrl : moduleUrl('temp1.html'),
        // controller: 'ctrl1'
        // })
        $urlRouterProvider.otherwise('/discount/uu-dai'); //url not state
        $stateProvider
            .state('detailAddress',
            {
                url: '/detail/:type/:slugAddress/:storeId',
                templateUrl: 'app/modules/home/view/detail.html',
                controller: 'indexDetailController'
            }
            )
            .state('discount',
            {
                url: '/discount/:type',
                templateUrl: 'app/modules/home/view/discount.html',
                controller: 'discountController'
            })
            .state('discountDetail',
            {
                url: '/discountDetail/:type/:dealId/:uuDaiSlug',
                templateUrl: 'app/modules/home/view/discountDetail.html',
                controller: 'discountDetailController'
            })
            .state('useDiscount',
            {
                url: '/useDiscount/:type',
                templateUrl: 'app/modules/home/view/useDiscount.html',
                controller: 'useDiscountController'
            })
            .state('authentication',
            {
                url: '/authentication',
                templateUrl: 'app/modules/home/view/authentication.html',
                controller: 'authenticationController'
            })
            .state('indexBeta',
            {
                url: '/indexBeta',
                templateUrl: 'app/modules/home/view/index.html',
                controller: 'indexController'
            });
        if (window.history && window.history.pushState) {
            //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

            // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

            // if you don't wish to set base URL then use this
            $locationProvider.html5Mode({
                enabled: false,
                requireBase: false
            });
        }
    }])