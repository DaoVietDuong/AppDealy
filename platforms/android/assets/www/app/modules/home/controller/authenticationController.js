homeModule.factory('authenticationService', ['$resource', '$http', '$window', 'configService', '$q', '$cordovaOauth',
    function ($resource, $http, $window, configService, $q, $cordovaOauth) {
        var rootUrl = configService.urlConnectToServer;
        var result = {
            postLogin: function (data) {
                return $http.post(rootUrl + '/api/dang-nhap', data);
            },
            getEmail: function (token) {
                var defer = $q.defer();
                $http.get("https://graph.facebook.com/v2.7/me?fields=name,email,gender,verified,id&access_token=" + token)
                    .success(
                    function (response) {
                        defer.resolve(response);
                    }).error(function (error) {
                        defer.reject(error);
                    });
                return defer.promise;
                // $http.get("https://graph.facebook.com/v2.5/me",
                //     { params: { access_token: localStorage.access_token, fields: "name,email,gender,verified, id", format: "json" } }).
                //     success(callback);
            },
            getTokenWeb: function (data) {
                var defer = $q.defer();
                $http.post(rootUrl + '/api/login/facebook', data).success(function (response) {
                    defer.resolve(response);
                }).error(function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            },
            getAvatar: function (idUser, callback) {
                $http.get("https://graph.facebook.com/" + idUser + "/picture?redirect=false").success(callback)
                    .error(function (err) {
                        alert('lỗi: ' + err);
                    });
            },
            loginFaceBook: function () {
                var defer = $q.defer();
                $cordovaOauth.facebook("1248813325133535", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).then(
                    function (response) {
                        defer.resolve(response);
                    }, function (error) {
                        defer.reject(error);
                    }
                );
                return defer.promise;
            }
        }
        return result;
    }])


var authenticationController = homeModule.controller('authenticationController',
    ['$scope', '$window', '$stateParams', '$uibModal', '$location', 'clientService', 'configService', '$cordovaOauth', '$http', 'authenticationService', '$route', '$state', '$q',
        'homeService', 'blockUI',
        function ($scope, $window, $stateParams, $uibModal, $location, clientService, configService, $cordovaOauth, $http, authenticationService, $route, $state, $q,
            homeService, blockUI) {
            $scope.isHome = function () {
                return $state.is("discount");
            };
            $scope.target = { email: "" };
            $scope.login2 = function () {
                // var myBlockUI = blockUI.instances.get('myBlockUI');
                // myBlockUI.start();

                authenticationService.loginFaceBook()
                    .then(function (response) {
                        $scope.token = response.access_token;
                        return $scope.token;
                    })
                    .then(function (token) {
                        return authenticationService.getEmail(token);

                    })
                    .then(function (result) {
                        if (result.email) {
                            if ($scope.token) {
                                clientService.setKeyLocal('access_token', $scope.token);
                                $scope.profile = result;
                                return authenticationService.getTokenWeb(result);
                            } else {
                                alert('Không nhận được token');
                            }
                        } else {
                            alert('Bạn quên chưa chia sẻ email?, cần email để mua ưu đãi');
                        }

                    })
                    .then(function (data) {
                        if ($scope.profile && data.api_token) {
                            clientService.setKeyLocal('profile', JSON.stringify($scope.profile));
                            clientService.removeKeyLocal('tokenWeb');
                            clientService.setKeyLocal('tokenWeb', data.api_token);
                            $window.location.reload();
                            loadData();
                        } else
                        {
                            alert('Bạn quên chưa chia sẻ email?, cần email để mua ưu đãi');
                        }
                    });
            }


            $scope.login = function () {
                var myBlockUI = blockUI.instances.get('myBlockUI');
                myBlockUI.start();
                $cordovaOauth.facebook("1248813325133535", ["email", "read_stream", "user_website", "user_location", "user_relationships"]).
                    then(function (result) {
                        clientService.setKeyLocal('access_token', result.access_token);
                        authenticationService.getEmail(function (response) {
                            if (response.email) {
                                authenticationService.getTokenWeb(response, function (mess) {
                                    clientService.setKeyLocal('profile', JSON.stringify(response));
                                    clientService.removeKeyLocal('tokenWeb');
                                    clientService.setKeyLocal('tokenWeb', mess.api_token);
                                    myBlockUI.stop();
                                    $window.location.reload();
                                    loadData();
                                }, function (err) { alert(err) });
                            } else {
                                myBlockUI.stop();
                                alert('Bạn quên chưa chia sẻ email?, cần email để mua ưu đãi')
                                return;
                            }
                        });
                    }, function (error) {
                        myBlockUI.stop();
                        alert(error);
                    });

            };
            $scope.loginWeb = function () {
                var myBlockUI = blockUI.instances.get('myBlockUI');
                myBlockUI.start();
                authenticationService.postLogin(
                    JSON.stringify($scope.target)).then(function (response1) {
                        if (response1.data.message) {
                            alert(response1.data.message);
                        }
                        else if (response1.data.api_token) {
                            var profile = { name: $scope.target.email };
                            clientService.setKeyLocal('profile', JSON.stringify(profile));
                            clientService.removeKeyLocal('tokenWeb');
                            clientService.setKeyLocal('tokenWeb', response1.data.api_token);
                            $window.location.reload();
                            loadData();
                        } else {
                            alert("Lỗi không xác định");
                        }
                        myBlockUI.stop();
                    })
            }
            function username() {
                var profile = clientService.getKeyLocal('profile');
                if (profile) {
                    $scope.name = JSON.parse(profile).name;
                } else {
                    $scope.name = "";
                }
            }
            function loadData() {
                username();
                $scope.isLogin = clientService.isLogin();
                if ($scope.isLogin) { $location.url('/index'); }
            }
            loadData();


            $scope.Logout = function () {
                clientService.removeKeyLocal('profile');
                clientService.removeKeyLocal('access_token');
                clientService.removeKeyLocal('tokenWeb');
                loadData();
                $window.location.reload();
                $location.path("/index");
            }

        }])