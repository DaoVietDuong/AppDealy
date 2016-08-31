
ngControllers.factory('commentService', [
    '$resource', '$http', '$window', 'configService',
    function ($resource, $http, $window, configService) {
        var rootUrl = configService.urlConnectToServer;

        var result = {
            base: function (data, type, slug, tokenWeb, callback) {
                $http.post(rootUrl + '/api/binh-luan/' + type + '/create/' + slug + '?api_token=' + tokenWeb, data)
                    .success(callback).error(function (params) {
                       alert(params);
                    });
            },
            getComment: function (data, slug, callback) {
                $http.get(rootUrl + '/api/binh-luan/' + slug + '/' + data).success(callback);
            },
            
        };
        return result;

    }
])


var commentController = ngControllers.controller('commentController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService', 'commentService',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService, commentService) {
            var config = configService.config;
            $scope.data = [];
            var slug = $stateParams.slugAddress == null ? $stateParams.uuDaiSlug : $stateParams.slugAddress;
            var type = $stateParams.type;
            var loadData = function () {
                commentService.getComment(slug, type, function (respone) {
                    $scope.data = respone.data;
                })
            };
            loadData();
            $scope.postComment = function () {
                var commentObj = {
                    content: $scope.content,
                };
                var token = clientService.getKeyLocal('tokenWeb');
                if (token) {
                    commentService.base(commentObj, type, slug, token, function (respone) {
                        loadData();
                        $scope.content = "";
                    });
                     
                } else{
                    alert("Bạn chưa đăng nhập");
                }

            }

        }])