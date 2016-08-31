var homeModule = angular.module(
    'homeModule', ['ngSanitize', 'ui.bootstrap', 'ngFilters', 'ngServices', 'ngCordova', 'ngCordovaOauth', 'ngMaterial', 'blockUI']); //bind html


homeModule.config(function(blockUIConfig) {
           blockUIConfig.template = '<div id="floatingCirclesG">' +
	'<div class="f_circleG" id="frotateG_01"></div> '+
	'<div class="f_circleG" id="frotateG_02"></div> '+
	'<div class="f_circleG" id="frotateG_03"></div>'+
	'<div class="f_circleG" id="frotateG_04"></div>'+
	'<div class="f_circleG" id="frotateG_05"></div>'+
	'<div class="f_circleG" id="frotateG_06"></div>'+
	'<div class="f_circleG" id="frotateG_07"></div>'+
	'<div class="f_circleG" id="frotateG_08"></div>'+
'</div>';
//blockUIConfig.message = "Đang tải";
});