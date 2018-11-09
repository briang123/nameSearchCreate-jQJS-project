(function ($) {
	//--- Author: Brian Gaines
	//--- March 16, 2017
	//--- Description: This file handles the setup of creating a new bg id by passing the appropriate context to the appropriate object ui
	//define the bg namespace if it does not already exist

	if ($.bg === undefined) { $.bg = {}; }
	if ($.bg.web === undefined) { $.bg.web = {}; }
	if ($.bg.web.namesearch === undefined) { $.bg.web.namesearch = {}; }
	if ($.bg.web.namesearch.create === undefined) { $.bg.web.namesearch.create = {}; }
	if ($.bg.web.namesearch.create.userid === undefined) { $.bg.web.namesearch.create.userid = {}; }

	/* SEE TFS FOR DOCUMENTATION */
	//	//  get property values from control mappings object
	//	var getControlMapping: function (container, key) {
	//    	return $.grep(this.controlMappings, function (item, i) {
	//        	return item.container.toUpperCase() === container.toUpperCase() &&
	//                	item.key.toUpperCase() === key.toUpperCase();
	//    	});
	//	};


	var locals = {
    	data: {
        	queryHandler: null
    	},
    	validation: {
        	patterns: {
            	ssn: ""
        	},
        	messages: {
            	REQUIRED: "* Required"
        	},
        	styles: {
            	ERROR_CLASS_HIDE: "validation-error-hide",  	//  class to apply when control value valid
            	ERROR_CLASS_SHOW: "validation-error-show-sm"	//  class to apply when control value invalid
        	}
    	}
	},
	create = function (config) {
    	return {
        	getMappingItem: function (key) {
            	return $.grep(locals.mappings, function (item, i) {
                	return item.key.toUpperCase() === key.toUpperCase();
            	});
        	},
        	formPicker: {
            	configMap: function () {
                	return create(config).getMappingItem(this.key)[0];
            	},
            	key: config.mappingKey.formPicker,
            	control: function (category) {
                	if (category) {
                    	return $(this.configMap().control.selector + "[data-value='" + category.toLowerCase() + "']");
                	} else {
                    	return this.configMap().control;
                	}
            	},
            	init: function () {
                	this.bind();
                	//  set the default category to show
                	this.control(locals.mappingKey.category.firm).click();
            	},
            	bind: function () {
                	//  get list of all json objects for form fields we enter data for
                	var getMappingItem = function (category) {
                    	return $.grep(locals.mappings, function (item, i) {
                        	if (item.type.toUpperCase() !== "BUTTON") {
                            	return $.inArray(category.toUpperCase(), item.category) > -1;
                        	}
                    	});
                	};
                	//  button click event handler for choosing type of entity to create
                	this.control().click(function (e) {
                    	var $this = $(this);
                    	var category = $this.attr("data-value");
                    	//  set the button styles and make the current clicked one active
                    	$this
                        	.removeClass("btn-default").addClass("btn-primary")
                        	.siblings()
                        	.removeClass("btn-primary").addClass("btn-default");
                    	//quick and dirty way to hide all controls (should loop through data-values, get value, and hide)
                    	var $form = $("#create_form");
                    	$form.find(".data-firm, .data-indv, .data-agency, .data-contact, .data-customer").hide();
                    	//  initialize new category fields
                    	var mappings = getMappingItem(category);
                    	//  loop through current category's controls and initialize the object for it
                    	$.each(mappings, function (index) {
                        	if (create(locals).hasOwnProperty(mappings[index].object)) {
                            	create(locals)[mappings[index].object].init(config);
                        	}
                    	});
                    	//  show the current category of controls
                    	$form.find(".data-" + category.toLowerCase()).slideDown();
                	});
            	}
        	},
        	firmName: {
            	control: function () {
                	return $("#firm_name");
            	},
            	init: function () {
                	this.bind();
                	this.validate();
            	},
            	bind: function () {
                	var $object = this;
                	var $control = $object.control();
                	if (!$control.data("data-event-bind")) {
                    	this.control().on("blur", function (e) {
                        	$control.attr("data-original-value", $control.val());
                        	locals.data.queryHandler.fixName("SYSTEMNAMEHERE", $control.val(), "FIRM", function (response) {
                            	$control.val(response.result.result);
                            	$object.validate();
                        	});
                    	});
                    	$control.data("data-event-bind", true);
                	}
            	},
            	validate: function () {
                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_HIDE, text: "" }, "col") :
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_SHOW, text: config.validation.messages.REQUIRED }, "col");
            	}
        	},
        	/*
        	VALIDATION NOTES:
        	FIRST NAME
        	*/
        	lastName: {
            	control: function () {
                	return $("#last_name");
            	},
            	init: function () {
                	this.bind();
                	this.validate();
            	},
            	bind: function () {
                	var $object = this;
                	var $control = $object.control();
                	if (!$control.data("data-event-bind")) {
                    	this.control().on("blur", function (e) {
                        	$control.attr("data-original-value", $control.val());
                        	locals.data.queryHandler.fixName("SYSTEMNAMEHERE", $control.val(), "INDIVIDUAL", function (response) {
                            	$control.val(response.result.result);
                            	$object.validate();
                        	});
                    	});
                    	$control.data("data-event-bind", true);
                	}
            	},
            	validate: function () {
                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_HIDE, text: "" }, "col") :
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_SHOW, text: config.validation.messages.REQUIRED }, "col");
            	}
        	},
        	firstName: {
            	control: function () {
                	return $("#first_name");
            	},
            	init: function () {
                	this.bind();
                	this.validate();
            	},
            	bind: function () {
                	var $object = this;
                	var $control = $object.control();
                	if (!$control.data("data-event-bind")) {
                    	this.control().on("blur", function (e) {
                        	$control.attr("data-original-value", $control.val());
                        	locals.data.queryHandler.fixName("SYSTEMNAMEHERE", $control.val(), "INDIVIDUAL", function (response) {
                            	$control.val(response.result.result);
                            	$object.validate();
                        	});
                    	});
                    	$control.data("data-event-bind", true);
                	}
            	},
            	validate: function () {
                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_HIDE, text: "" }, "col") :
                	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_SHOW, text: config.validation.messages.REQUIRED }, "col");
            	}
        	},
        	ssn: {
            	init: function () {
                	$.bg.web.control.ssn.ui.init({
                    	type: "INDV",                                       	//  type of ssn to create/validate
                    	controlId: "ssn",                                   	//  id for control
                    	appendingContainerId: ".ssn-control-container",     	//  container where wrapper code will be embedded
                    	validation: {
                        	styles: {
                            	ERROR_CLASS_HIDE: "validation-error-hide",  	//  class to apply when control value valid
                            	ERROR_CLASS_SHOW: "validation-error-show-sm"	//  class to apply when control value invalid
                        	}
                    	},
                    	utility: $.bg.web.namesearch.common.utility        	//  utility object we'll use in component
                	});
            	}
        	},
        	agencyType: {
            	control: function () {
                	return $("#agency_type");
            	},
            	init: function () {
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	nonSelectedText: "Please Select",
                        	noneCheckedAllowed: true
                    	},
                    	data: {
                        	dbValue: "",
                        	dataSource: this.data().rows(),
                        	displayColumn: this.data().displayColumn,
                        	valueColumn: this.data().valueColumn,
                        	defaultValue: ""
                    	},
                    	css: {
                        	minWidth: 200,
                        	maxHeight: 300
                    	},
                    	events: {
                        	onChangeCallback: function (option, checked) {
                        	},
                        	onValidateCallback: function (valid) {
                            	//validate();
                        	}
                    	}
                	});
            	},
            	data: function () {
                	return {
                    	displayColumn: "text_column",
                    	valueColumn: "value_column",
                    	rows: function () {
                        	return [
                            	{ "value_column": "STATE", "text_column": "STATE" },
                            	{ "value_column": "EXCH", "text_column": "EXCH" },
                            	{ "value_column": "OTHER", "text_column": "OTHER" }
                        	]
                    	}
                	}
            	},
            	validate: function () {
                	//                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_HIDE, text: "" }) :
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_SHOW, text: "Last Name Required" });
            	}
        	},
        	agencyStatus: {
            	control: function () {
                	return $("#agency_status");
            	},
            	init: function () {
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	nonSelectedText: "Please Select",
                        	noneCheckedAllowed: true
                    	},
                    	data: {
                        	dbValue: "",
                        	dataSource: this.data().rows(),
                        	displayColumn: this.data().displayColumn,
                        	valueColumn: this.data().valueColumn,
                        	defaultValue: -1
                    	},
                    	css: {
                        	minWidth: 200,
                        	maxHeight: 300
                    	},
                    	events: {
                        	onChangeCallback: function (option, checked) {
                        	},
                        	onValidateCallback: function (valid) {
                            	//validate();
                        	}
                    	}
                	});
            	},
            	data: function () {
                	return {
                    	displayColumn: "text_column",
                    	valueColumn: "value_column",
                    	rows: function () {
                        	return [
                            	{ "value_column": "-1", "text_column": "ACTIVE" },
                            	{ "value_column": "0", "text_column": "INACTIVE" },
                        	]
                    	}
                	}
            	},
            	validate: function () {
                	//                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_HIDE, text: "" }) :
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_SHOW, text: testData.message.validation.required });
            	}
        	},
        	agencyOrigination: {
            	control: function () {
                	return $("#agency_origination");
            	},
            	init: function () {
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	nonSelectedText: "Please Select",
                        	noneCheckedAllowed: true
                    	},
                    	data: {
                        	dbValue: "",
                        	dataSource: this.data().rows(),
                        	displayColumn: this.data().displayColumn,
                        	valueColumn: this.data().valueColumn,
                        	defaultValue: ""
                    	},
                    	css: {
                        	minWidth: 200,
                        	maxHeight: 300
                    	},
                    	events: {
                        	onChangeCallback: function (option, checked) {
                        	},
                        	onValidateCallback: function (valid) {
                            	//validate();
                        	}
                    	}
                	});
            	},
            	data: function () {
                	return {
                    	displayColumn: "text_column",
                    	valueColumn: "value_column",
                    	rows: function () {
                        	return [
                            	{ "value_column": "LEAD", "text_column": "LEAD" },
                            	{ "value_column": "SOURCE", "text_column": "SOURCE" },
                        	]
                    	}
                	}
            	},
            	validate: function () {
                	//                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_HIDE, text: "" }) :
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_SHOW, text: testData.message.validation.required });
            	}
        	},
        	states: {
            	control: function () {
                	return $("#state");
            	},
            	init: function () {
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	nonSelectedText: "Please Select",
                        	noneCheckedAllowed: true
                    	},
                    	data: {
                        	dbValue: "",
                        	dataSource: this.data().rows(),
                        	displayColumn: this.data().displayColumn,
                        	valueColumn: this.data().valueColumn,
                        	defaultValue: ""
                    	},
                    	css: {
                        	minWidth: 200,
                        	maxHeight: 300
                    	},
                    	events: {
                        	onChangeCallback: function (option, checked) {
                        	},
                        	onValidateCallback: function (valid) {
                            	//validate();
                        	}
                    	}
                	});
            	},
            	data: function () {
                	return {
                    	displayColumn: "text_column",
                    	valueColumn: "value_column",
                    	rows: function () {
                        	return [
                            	{ "value_column": "CA", "text_column": "CALIFORNIA" },
                            	{ "value_column": "IL", "text_column": "ILLINOIS" }
                        	]
                    	}
                	}
            	},
            	validate: function () {
                	//                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_HIDE, text: "" }) :
                	//                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: testData.message.validation.ERROR_CLASS_SHOW, text: testData.message.validation.required });
            	}
        	},
        	country: {
            	control: function () {
                	return $("#country");
            	},
            	init: function () {
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: config.jsVersion,
                    	container: this.control().closest(".row"),
                    	control: this.control(),
                    	options: {
                        	selection: "single",
                        	nonSelectedText: "Please Select",
                        	noneCheckedAllowed: true
                    	},
                    	data: {
                        	dbValue: "",
                        	dataSource: this.data().rows(),
                        	displayColumn: this.data().displayColumn,
                        	valueColumn: this.data().valueColumn,
                        	defaultValue: ""
                    	},
                    	css: {
                        	minWidth: 200,
                        	maxHeight: 300
                    	},
                    	events: {
                        	onBindCallback: function (valid) {
                            	create(config).country.validate();
                        	},
                        	onChangeCallback: function (option, checked) {
                        	},
                        	onValidateCallback: function (valid) {
                            	//create(config).country.validate();
                        	}
                    	}
                	});
            	},
            	data: function () {
                	return {
                    	displayColumn: "text_column",
                    	valueColumn: "value_column",
                    	rows: function () {
                        	return [
                            	{ "value_column": "ES", "text_column": "SPAIN" },
                            	{ "value_column": "USA", "text_column": "UNITED STATES OF AMERICA" }
                        	]
                    	}
                	}
            	},
            	validate: function () {
                	return ($.bg.web.namesearch.common.utility.getString(this.control().val()).length > 0) ?
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_HIDE, text: "" }, "col") :
                    	$.bg.web.namesearch.common.utility.validation.setValidationError(this.control(), { klass: config.validation.styles.ERROR_CLASS_SHOW, text: config.validation.messages.REQUIRED }, "col");
            	}
        	}
    	}
	};
	//namespace functions
	$.bg.web.namesearch.create.userid.ui = {
    	register: function (context) {
        	$.extend(true, locals, context);
        	locals.data.queryHandler = new QueryHandler();
    	},
    	init: function () {

        	create(locals).formPicker.init();

    	}
	};
})(jQuery);



