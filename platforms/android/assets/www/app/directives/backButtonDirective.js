ngDirectives.directive('back', function factory($window) {
    return {
        restrict   : 'E',
        replace    : true,
        transclude : true,
        template: '<span ng-click="back()"class="navbar-brand glyphicon glyphicon-menu-left"></span>',
        link: function ($scope, element, attrs) {
          $scope.back = function() {
            $window.history.back();
          };
        }
      };
});