ngFilters.filter("formatUrl",
function () {
    return function (x) {
        return "http://dealy.vn"+ x;
    }
    
});