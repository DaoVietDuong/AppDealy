window.CacheManager = function () {
    var result = {};
    var cacheStatus = {};

    var register = function (name, initData, updateFunc) {
        var target = cacheStatus[name];
        if (!target) {
            target = {
                updated: false,
                updateFunc: updateFunc,
                data: [],
            }
            cacheStatus[name] = target;
        }
        
        if (initData) {
            initData.unshift({ ID: null, Text: '--' ,Value: null});
            target.updated = true;
            target.data = initData;
            result[name] = initData;
        } else if (!target.updated && target.updateFunc) {
            initData = target.updateFunc();
            initData.unshift({ ID: null,Text: '--', Value: null });
            target.updated = true;
            target.data = initData;
            result[name] = initData;
        }
    };
    var updateAll = function () {
        for (key in cacheStatus) {
            result.update(key);
        }
    };
    var update = function (name) {
        var target = cacheStatus[name];
        if (target && target.updateFunc) {
            target.updated = false;
            var initData = target.updateFunc();
            target.updated = true;
            target.data = initData;
            result[name] = initData;
        }
    };

    result.register = register;
    result.updateAll = updateAll;
    result.update = update;

    return result;
}