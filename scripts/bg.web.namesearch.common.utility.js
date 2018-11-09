(function ($) {
	//--- Author: Brian Gaines
	//--- August 25, 2015
	//--- Description: This file provides utility helper functions
	//--- define the bg namespace if it does not already exist
	
	if ($.bg === undefined) { $.bg = {} }
	if ($.bg.web === undefined) { $.bg.web = {} }
	if ($.bg.web.namesearch === undefined) { $.bg.web.namesearch = {} }
	if ($.bg.web.namesearch.common === undefined) { $.bg.web.namesearch.common = {} }
	
	if (!String.prototype.startsWith) {
    	String.prototype.startsWith = function (searchString, position) {
        	position = position || 0;
        	return this.indexOf(searchString, position) === position;
    	};
	}
	//var sourcePatternsObject;
	$.bg.web.namesearch.common.utility = {
    	register: function (context) {
        	//--- this is the entry point
        	//--- initialize anything needed here
    	},
    	requestQueryString: function (key) {
        	key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        	var regex = new RegExp("[\\?&]" + encodeURIComponent(key) + "=([^&#]*)", "i"),
        	results = regex.exec(window.location.search);
        	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    	},
    	getAllQueryStrings: function () {
        	return window.location.search.substring(1);
    	},
    	bindListDataSource: function (control, datasource, valueColumn, textColumn, defaultValue) {
        	var dfd = new $.Deferred();
        	//added capability to allow for multiple default selected items
        	var hasMultipleChecksCondition = ((defaultValue.indexOf("{{") >= 0) && (defaultValue.indexOf("}}") >= 0));
        	var cleansedValue = defaultValue.replace("{{", "").replace("}}", "");
        	var multiCheckValues = cleansedValue.indexOf("|") >= 0 ? cleansedValue.split("|") : "";
        	var multiCheckValueCount = multiCheckValues == "" ? 0 : multiCheckValues.length;
        	var eitherOrResolved = false;
        	var multiCheckIndex = 0;
        	var col1Name = "",
            	col2Name = "",
            	isDualColumn = (textColumn.indexOf(",") >= 0),
            	checkSelection = function (currentItem) {
                	var selectedOption = "";
                	if (hasMultipleChecksCondition && !eitherOrResolved) {
                    	if (multiCheckValues[multiCheckIndex] == "ALL") {
                        	selectedOption = "selected"; //ALL values should be defined last, as we aren't setting eitherOrResolved b/c it's to be the last case checked
                    	} else {
                        	//we don't have an overloaded default value
                        	if (multiCheckValues == "") {
                            	selectedOption = cleansedValue == currentItem ? "selected" : "";
                        	} else { // we do have an overloaded default value "this|that"
                            	//choose/select values by asc index order                    	
                            	if (currentItem == multiCheckValues[multiCheckIndex]) {
                                	selectedOption = "selected";
                                	eitherOrResolved = true;
                            	} else {
                                	selectedOption = "";
                            	}
                        	}
                    	}
                	} else {
                    	var hasMultipleDefaultValues = ((defaultValue.indexOf(",") >= 0) || (defaultValue.toUpperCase() == "ALL"));
                    	if (hasMultipleDefaultValues) {
                        	if (defaultValue.toUpperCase() == "ALL") {
                            	selectedOption = "selected";
                        	} else {
                            	var items = defaultValue.split(","),
                                	selectedOption = "";
                            	$.each(items, function (i, value) {
                                	if (currentItem == value) {
                                    	selectedOption = "selected";
                                    	return false;
                                	}
                            	});
                        	}
                        	//return selectOption;
                    	} else {
                        	selectedOption = (currentItem == defaultValue) ? "selected" : "";
                    	}
                	}
                	return selectedOption;
            	}
        	if (isDualColumn) {
            	col1Name = textColumn.split(",")[0];
            	col2Name = textColumn.split(",")[1];
        	}
        	//load the options based on one or two columns
        	control.empty();
        	//Using javascript arrays and jquery at the end to speed up performance for rendering large amounts of data       	
        	//Here are some metrics: http://www.scottlogic.co.uk/2010/10/javascript-array-performance/
        	var a = new Array()
        	var b = -1;
        	for (x = 0; multiCheckValueCount == 0 || x < multiCheckValueCount - 1; x++) {
            	if (datasource) {
                	for (var i = 0; i < datasource.length; i++) {
                    	a[++b] = '<option value="';
                    	a[++b] = eval('datasource[' + i + '].' + valueColumn);
                    	a[++b] = '" ';
                    	a[++b] = checkSelection(eval('datasource[' + i + '].' + valueColumn));
                    	a[++b] = '>';
                    	if (isDualColumn) {
                        	a[++b] = eval('datasource[' + i + '].' + col1Name);
                        	a[++b] = ' ';
                        	a[++b] = eval('datasource[' + i + '].' + col2Name);
                    	} else {
                        	a[++b] = eval('datasource[' + i + '].' + textColumn);
                    	}
                    	a[++b] = '</option>';
                	}
            	}
            	if (multiCheckValueCount > 0) {
                	multiCheckIndex++;
            	} else {
                	break;
            	}
        	}
        	//add the options to the control
        	control.html(a.join(''));
        	//set the default value if it exists (optional)
        	//if (defaultValue) {
        	//control.val(defaultValue);
        	//}
        	return dfd.promise();
    	},
    	toggleClass: function (obj, classToRemove, classToAdd) {
        	obj.removeClass(classToRemove).addClass(classToAdd);
    	},
    	logException: function (namespace, method, message) {
        	//namespace: path to file that is logging the exception (ie. $.bg.web.facts.matterlist.ui)
        	//method: function name where exception is being called (ie. bindBreadcrumb)
        	//message: exception message to log (ie. custom exception message)
        	var shareHandler = new SharedHandler();
        	var results = shareHandler.logException(namespace, method, message);
        	return results.result;
    	},
    	optionSelected: function (control, value) {
        	var isSelected = false;
        	control.find("option:selected").each(function (i, option) {
            	if (value.toUpperCase() == option.value.toUpperCase()) {
                	isSelected = true;
                	return false;
            	}
        	});
        	return isSelected;
    	},
    	showSpinnerMessage: function (pathToImages, message, size) {
        	var $div = $("<span/>", { "class": "text-uppercase small text-muted", "padding": "2px;" });
        	var $img = $("<img />", { "runat": "server", "src": "images/spin-" + size + ".gif", "alt": "" + message + "" });
        	return $div.append($img).append("&nbsp;" + message);
    	},
    	reSizeEmptyMultiSelects: function () {
        	var _multiSelects = $("button.multiselect.dropdown-toggle");
        	if (_multiSelects.length > 0) {
            	$(_multiSelects).each(function (index, multiselect) {
                	if ($.trim($(multiselect).text()).length == 0) {
                    	$(multiselect).css("min-width", "150px");
                    	$(multiselect).css("min-height", "33px");
                    	$(multiselect).find("b:first").addClass("pull-right");
                    	$(multiselect).find("span:first").addClass("pull-right");
                	}
            	});
        	}
    	},
    	toProperCase: function (str) {
        	if (str != null) {
            	if ($.isNumeric(str))
                	return str;
            	var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then',
            	'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with'];
            	return str.replace(/\b\w+/g, function (txt, offset) {
                	if (offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1) {
                    	return txt.toLowerCase();
                	}
                	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            	});
        	} else {
            	return "";
        	}
    	},
    	padMax7: function (num, size) {
        	var concatenated = "0000000" + num.toString();
        	return concatenated.substr(concatenated.length - size);
    	},
    	getPaddedUserId: function (txtVal) {
        	var result = { success: false, paddedUserId: "" };
        	var _maxUserIdLength = 7;
        	var _isOnlyUserId = false;
        	var _isPoolId = false;
        	var _paddedUserId;
        	//--- remove  any white-space
        	//--- from beginning and end
        	txtVal = $.trim(txtVal);
        	//--- make sure we still
        	//--- have a value
        	if (txtVal.length > 0) {
            	//--- determine if the value is an UserId
            	//--- is this a poolId?
            	_isOnlyUserId = (
                	txtVal.toLowerCase().startsWith("p")
                	&& txtVal.substr(1, txtVal.length - 1).search("[^0-9]") === -1
                	&& this.padMax7(txtVal, _maxUserIdLength).length === _maxUserIdLength
            	) ? true : false;
            	_isPoolId = _isOnlyUserId ? true : false;
            	//--- not a poolId? Then determine
            	//--- if it's an entityId
            	if (!_isOnlyUserId) {
                	_isOnlyUserId = (
                    	txtVal.search("[^0-9]") === -1
                    	&& this.padMax7(txtVal, _maxUserIdLength).length === _maxUserIdLength
                	) ? true : false;
            	}
            	//--- not an nfaId
            	if (!_isOnlyUserId)
                	return result;
        	}
        	else
            	return result;
        	//--- we have an nfaId only
        	//--- pad the nfaId
        	_paddedUserId = _isPoolId ? "P" + this.padMax7(txtVal.substr(1, txtVal.length - 1), _maxUserIdLength - 1) : this.padMax7(txtVal, _maxUserIdLength);
        	result.success = true;
        	result.paddedUserId = _paddedUserId;
        	return result;

    	},
    	//  build an HTML element
    	html: function (settings) {
        	//  default element is a SPAN tag
        	var defaults = {
            	id: "span_" + new Date().getTime(), //no conflict Id
            	tag: "span",
            	klass: "",
            	css: {}, //pass json of css properties
            	text: ""
        	};
        	//  override any local object values with values being passed in
        	var locals = $.extend(true, {}, defaults, settings);
        	//  create the HTML element and return an object reference to it
        	return $("<" + locals.tag + "/>", {
            	id: locals.id,
            	class: locals.klass,
            	css: locals.css,
            	text: locals.text
        	});
    	},
    	//  get cleaned up string value
    	getString: function (value) {
        	value = value || "";
        	return $.trim(value.toString());
    	},
    	//  check if callback exists
    	callbackExists: function (func) {
        	return func && typeof func === "function";
    	},
    	validation: {
        	keyCodes: {
            	"BACKSPACE": 8,
            	"TAB_KEY": 9,
            	"ENTER_KEY": 13,
            	"SHIFT_KEY": 16,
            	"ALT_KEY": 18,
            	"BREAK_KEY": 19,
            	"CAPS_LOCK": 20,
            	"ESCAPE_KEY": 27,
            	"PAGE_UP": 33,
            	"PAGE_DOWN": 34,
            	"END_KEY": 35,
            	"HOME_KEY": 36,
            	"LEFT_ARROW": 37,
            	"UP_ARROW": 38,
            	"RIGHT_ARROW": 39,
            	"DOWN_ARROW": 40,
            	"INSERT_KEY": 45,
            	"DELETE_KEY": 46,
            	"NUMBERS": [48, 57], // [low range, high range]
            	"NBR_0": 48,
            	"NBR_1": 49,
            	"NBR_2": 50,
            	"NBR_3": 51,
            	"NBR_4": 52,
            	"NBR_5": 53,
            	"NBR_6": 54,
            	"NBR_7": 55,
            	"NBR_8": 56,
            	"NBR_9": 57,
            	"CHARS": [65, 95],  // [low range, high range]
            	"A": 65,
            	"B": 66,
            	"C": 67,
            	"D": 68,
            	"E": 69,
            	"F": 70,
            	"G": 71,
            	"H": 72,
            	"I": 73,
            	"J": 74,
            	"K": 75,
            	"L": 76,
            	"M": 77,
            	"N": 78,
            	"O": 79,
            	"P": 80,
            	"Q": 81,
            	"R": 82,
            	"S": 83,
            	"T": 84,
            	"U": 85,
            	"V": 86,
            	"W": 87,
            	"X": 88,
            	"Y": 89,
            	"Z": 90,
            	"LEFT_WINDOW_KEY": 91,
            	"RIGHT_WINDOW_KEY": 92,
            	"SELECT": 93,
            	"NUMPAD_0": 96,
            	"NUMPAD_1": 97,
            	"NUMPAD_2": 98,
            	"NUMPAD_3": 99,
            	"NUMPAD_4": 100,
            	"NUMPAD_5": 101,
            	"NUMPAD_6": 102,
            	"NUMPAD_7": 103,
            	"NUMPAD_8": 104,
            	"NUMPAD_9": 105,
            	"MULTIPLY": 106,
            	"ADD_KEY": 107,
            	"SUBTRACT_KEY": 109,
            	"DECIMAL_POINT": 110,
            	"DIVIDE": 111,
            	"F1": 112,
            	"F2": 113,
            	"F3": 114,
            	"F4": 115,
            	"F5": 116,
            	"F6": 117,
            	"F7": 118,
            	"F8": 119,
            	"F9": 120,
            	"F10": 121,
            	"F11": 122,
            	"F12": 123,
            	"NUM_LOCK": 144,
            	"SCROLL_LOCK": 145,
            	"SEMICOLON": 186,
            	"EQUAL_SIGN": 187,
            	"COMMA": 188,
            	"DASH": 189,
            	"PERIOD": 190,
            	"FORWARD_SLASH": 191,
            	"GRAVE_ACCENT": 192,
            	"OPEN_BRACKET": 219,
            	"BACK_SLASH": 220,
            	"CLOSE_BRAKET": 221,
            	"SINGLE_QUOTE": 222
        	},
        	//  briefly highlight a field when an invalid character is pressed
        	blinkField: function blinkField(control) {
            	control.addClass("error-highlight");                	//  briefly highlight the invalid keypress
            	setTimeout(function (e) {
                	control.removeClass("error-highlight");         	//  brief flicker of redish background
            	}, 200);
        	},
        	dates: {
            	isDate: function (value) {
                	var pattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
                	if (pattern.test(value)) {
                    	// now really make sure it's a valid date now that it's in proper format
                    	var dateParts = value.split("/");
                    	var month = parseInt(dateParts[0]) - 1;
                    	var day = parseInt(dateParts[1]);
                    	var year = parseInt(dateParts[2]);
                    	var validDate = new Date(year, month, day);
                    	// the following will check to see if it's truly a valid date (2/30/2017 is not a valid date)
                    	if (validDate.getMonth() == month) {
                        	return true;
                    	} else {
                        	return false;
                    	}
                	} else {
                    	// not valid date format based on regex
                    	return false;
                	}
            	}
        	},
//        	ssn: {
//            	formatSSN: function (value) {
//                	// VALIDATIONS
//                	// 123456789   //correct number length, but no no format; add format
//                	// 123-45-6789  //correct number length + correct format; leave alone
//                	// 1-23456789  //correct number count, invalid format; fix format
//                	// 12-3456789  //correct number count, invalid format; fix format
//                	// 123-456789  //correct number count, invalid format; fix format
//                	// 1234-56789  //correct number count, invalid format; fix format
//                	// 12345-6789  //correct number count, invalid format; fix format
//                	// 123456-789  //correct number count, invalid format; fix format
//                	// 1234567-89  //correct number count, invalid format; fix format
//                	// 12345678-9  //correct number count, invalid format; fix format
//                	// --123456789  //correct number count, invalid format; fix format
//                	// 1234567891  //too many numbers; set invalid
//                	// 12345678 	//too few numbers; fix format
//                	// non-numbers  //prevent from adding
//                	var ssnNoFormat = value.replace(/-/g, "");
//                	if (ssnNoFormat.length == 3) {
//                    	return ssnNoFormat + "-";
//                	} else if (ssnNoFormat.length == 5) {
//                    	return ssnNoFormat.substr(0, 3) + "-" + ssnNoFormat.substr(3, 2) + "-";
//                	} else if (ssnNoFormat.length == 9) {
//                    	return ssnNoFormat.substr(0, 3) + "-" + ssnNoFormat.substr(3, 2) + "-" + ssnNoFormat.substr(5, 4);
//                	} else {
//                    	return value;
//                	}
//            	},
//            	isValid: function (value) {
//                	var pattern = /^\d{3}-\d{2}-\d{4}$/;
//                	return value.match(pattern);
//            	}
//        	},
        	//  setting the css for where the error is placed/removed
        	setValidationError: function (control, props, container) {
            	if (!container) container = "row";
            	//  create new error control id based on current control id
            	var errorId = control.prop("id") + "_error";
            	//  create an object reference of new error control
            	$errorLabel = $("#" + errorId);
            	//  if the error control exists
            	if ($errorLabel.length > 0) {
                	if (container == "row") {
                    	//  if the error control should be hidden then remove the container error class
                    	//  from the closest element with class='row'; otherwise, add it
                    	props.klass === "validation-error-hide" ?
                        	control.closest(".row").removeClass("container-error") :
                        	control.closest(".row").addClass("container-error");
                	} else if (container == "col") {
                    	props.klass === "validation-error-hide" ?
                        	control.closest("div[class^='col-']").removeClass("container-error") :
                        	control.closest("div[class^='col-']").addClass("container-error");
                	}
                	//  reset the error control class (if showing error, then append error text; otherwise, remove it)
                	$errorLabel.removeAttr("class").addClass(props.klass).html(props.text);
            	} else {
                	//  create and initialize the error control
                	var $html = $.bg.web.namesearch.common.utility.html({ id: errorId, klass: props.klass, text: props.text });
                	//  if we have an error, then set container style appropriately
                	if (props.klass.indexOf("validation-error-show") > -1) {
                    	if (container == "row") {
                        	control.closest(".row").addClass("container-error");
                    	} else if (container == "col") {
                        	control.closest("div[class^='col-']").addClass("container-error");
                    	}
                	}
                	//  append the error control to the current column
                	control.closest("div[class^='col-']").append($html);
            	}
        	}
    	},
    	//  object that encapsulates the utility functions for dynamic asset loading functionality
    	loader: {
        	multiselect: {
            	ui: function (jsVersion) {
                	var url = $.bg.web.namesearch.common.system.applicationUrl();
                	url = url + (url.substring(url.length - 1) !== "/" ? "/" : "");
                	//  provide list of dependent resources
                	var scripts = [{ path: "Js/Nfa/Common/multiselect.ui.js?ver=" + jsVersion, referenceCheck: $.bg.web.namesearch.control.multiselect, url: url, order: 10}];
                	//  get array of references in order for which to load
                	var scriptDependencies = $.bg.web.namesearch.common.utility.loader.references.get(scripts);
                	//  load multiple scripts sequentially, then initialize once additional scripts are done loading
                	return $.bg.web.namesearch.common.utility.loader.scripts.load(scriptDependencies);
            	}
        	},
        	stylesheets: {
            	//  dynamically load stylesheets if they don't already exist
            	//  [{path: "/path/to/style1.css", order: 5}, {path: "/path/to/style2.css", order: 10}]
            	load: function (styles) {
                	var dfd = new $.Deferred();
                	//  loop through each dynamic script to load
                	$(styles).each(function (index) {
                    	//  get current style path
                    	var currentPath = this.toString();
                    	//  determine if stylesheet is loaded in page
                    	var isLoaded = function (path) {
                        	var loaded = false;
                        	//  loop each link tag and check href attribute
                        	$.each($("link[href]"), function () {
                            	//  if already loaded then break out of loop and return true;
                            	if (this.href.toLowerCase().indexOf(currentPath.toLowerCase()) > -1) {
                                	loaded = true;
                                	return;
                            	}
                        	});
                        	//  if not found then false; otherwise, true
                        	return loaded;
                    	};
                    	//  check if current dynamically loaded stylesheet path is already loaded in page
                    	var loaded = isLoaded(currentPath);
                    	//  if not already loaded, then load the stylesheet
                    	if (!loaded) {
                        	$("head").append('<link rel="stylesheet" type="text/css" href="' + this.toString() + '" />');
                        	dfd.resolve();
                    	}
                	});
                	//  let caller know we're done
                	return dfd.promise();
            	}
        	},
        	scripts: {
            	//  dynamically load script references if they don't already exist
            	load: function (scripts) {
                	//  build an array of promises which is what gets returned from each $.getScript call
                	var promises = $.map(scripts, function (obj) {
                    	//  determine if script is loaded in page
                    	var isLoaded = function () {
                        	//  check object reference. If not defined, double-check if path loaded
                        	if (obj.referenceCheck) {
                            	return true;
                        	} else {
                            	return $("script[src*='" + obj.path + "']").length > 0;
                        	}
                    	};
                    	//  if already loaded, then skip
                    	if (!isLoaded()) {                        	
                        	return $.ajax({
                            	async: false,   // we want to ensure that the script is loaded before loading up the next one (for our object references-sake)
                            	cache: true,
                            	url: obj.url + obj.path,
                            	dataType: "script"
                        	}).always();
                    	}
                	});
                	//  resolve the promises
                	promises.push(
                    	$.Deferred(function (dfd) {
                        	$(dfd.resolve);
                    	})
                	);
                	//  return all resolved promises
                	return $.when.apply($, promises);
            	}
        	},
        	references: {
            	//  helper function to get references in order for which to load and return to caller
            	get: function (list) {
                	var refs = $.bg.web.namesearch.common.utility.loader.json.sort(list, "order", true);
                	var dependencies = [];
                	for (var i = 0; i < refs.length; i++) {
                    	dependencies.push(refs[i]);
                	}
                	return dependencies;
            	}
        	},
        	json: {
            	//  helper function that sorts an array of json objects and returns the correct order
            	sort: function jsonSort(obj, prop, asc) {
                	return obj.sort(function sortObject(a, b) {
                    	if (asc) {
                        	return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                    	} else {
                        	return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                    	}
                	});
            	}
        	}
    	}
	};
})(jQuery);