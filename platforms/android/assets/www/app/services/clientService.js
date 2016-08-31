ngServices.factory('clientService', [
    '$resource', '$http', '$window', '$injector',
    function($resource, $http, $window, $injector) {
        var result = {
            now: new Date(),
        }
        result.isLogin  = function () {
            if(localStorage['tokenWeb']){
                return true;
            }
            return false;
        }
        result.setKeyLocal = function(key, data) {
            localStorage.setItem(key, data);
        };
        result.getKeyLocal = function(key) {
            if (localStorage[key]) {
                return localStorage[key];
            }
            else
            { return null; }
        }
        result.removeKeyLocal = function(key) {
            if (localStorage[key]) {
                localStorage.removeItem(key);
            }
        }
            result.dayLeft = function(value)
            {
                var myDate = value.substr(0,10);
                var chunks = myDate.split('/');

                var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2];
                var _MS_PER_DAY = 1000 * 60 * 60 * 24;
                var a = new Date(formattedDate);
                var b = new Date(Date.now());
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
                 return Math.floor((utc1 - utc2) / _MS_PER_DAY);
                // var date1 = new Date(value.substr(0,10));
                // var date2 = new Date(Date.now());
                // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                // return diffDays;
               
            }
        return result;
    }
])