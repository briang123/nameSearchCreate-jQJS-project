(function ($) {
	//--- Author: Brian Gaines
	//--- March 8, 2017
	//--- Description: This file handles the Basic Search page ui (Sample page)
	//define the bg namespace if it does not already exist

	if ($.bg === undefined) { $.bg = {}; }
	if ($.bg.web === undefined) { $.bg.web = {}; }
	if ($.bg.web.namesearch === undefined) { $.bg.web.namesearch = {}; }
	if ($.bg.web.namesearch.basicsearch === undefined) { $.bg.web.namesearch.basicsearch = {}; }
	
	//  get property values from control mappings object
	var getControlMapping = function (container, key) {
    	return $.grep(this.controlMappings, function (item, i) {
        	return item.container.toUpperCase() === container.toUpperCase() &&
                	item.key.toUpperCase() === key.toUpperCase();
    	});
	};
	var testData = {
    	jsVersion: 223456789,
    	//  just some sample data at this point
    	regCategory: {
        	displayColumn: "text_column",
        	valueColumn: "value_column",
        	rows: function () {
            	return [
                	{ "value_column": "POOLS", "text_column": "POOLS" },
                	{ "value_column": "FCM", "text_column": "FCM" },
                	{ "value_column": "FDM", "text_column": "FDM" },
                	{ "value_column": "IB", "text_column": "IB" },
                	{ "value_column": "SD", "text_column": "SD" },
                	{ "value_column": "MSP", "text_column": "MSP" },
                	{ "value_column": "MEMBER", "text_column": "MEMBER" }
            	]
        	}
    	}
	};
	var locals = {
    	data: {
        	handler: null
    	},
    	config: {
        	categoryLabels: {
            	containerId: "namesearch_category_selection",
            	labelTemplate: "<span class=\"label label-success\" data-category=\"{{OPTION_VALUE}}\">{{OPTION_TEXT}} <i class=\"glyphicon glyphicon-remove\"></i></span>",
            	visible: true
        	},
        	categories: {
            	dropDownDisplayText: "Category",
            	optionTemplate: "<li><a href=\"#\"><input class=\"categories\" type=\"checkbox\" name=\"categories\" data-category=\"{{OPTION_VALUE}}\" />{{OPTION_TEXT}}</a></li>",
            	optionValue: "", //datasource column
            	optionText: "", //datasource column
            	selectedItems: ["IB", "MEMBER"] //list of option values to select
        	},
        	panelHeading: {
            	id: "namesearch_panel_heading",
            	class: "panel-heading generic-panel-heading",
            	style: "color:#860a2f;background-color:#dcdac3;cursor:pointer;",
            	text: "<strong class=\"text-left\" style=\"padding-right:10px;\">Basic Name Search</strong>"
        	},
        	panelBody: {
            	id: "namesearch_panel_body"
        	},
        	label: {
            	id: "entitySearchLabel",
            	labelText: "Entity",
            	helpText: "Please select a firm."
        	},
        	input: {
            	id: "entitySearchInput",
            	containerId: "input_container",
            	value: "",
            	attributes: {
                	"data-search-entity": "",
                	"data-search-history": "",
                	"data-reln-type": "",
                	"data-parm-key": "",
                	"data-input-value": "",
                	"data-default-values": "",
                	"data-related-entity-typeahead-selector": "related_entity",
                	"autocomplete": "off",
                	"placeholder": "Please select"
            	}
        	},
        	buttonGroup: {
            	searchButtonId: "btn_entitySearch"
        	},
        	advancedSearch: {
            	containerId: "name_search_relationship"
        	}
    	}
	};
	var search = function (config) {
    	return {
        	categories: {
            	init: function () {
                	var $categories = this;
                	$.bg.web.namesearch.control.multiselect.ui.init({
                    	jsVersion: testData.jsVersion,
                    	container: $("#categories").closest(".row"),
                    	control: $("#categories"),
                    	data: {
                        	dbValue: null,
                        	dataSource: testData.regCategory.rows(),
                        	displayColumn: testData.regCategory.displayColumn,
                        	valueColumn: testData.regCategory.valueColumn,
                        	defaultValue: $categories.defaultValue()
                    	},
                    	options: {
                        	includeSelectAllOption: true,
                        	numberDisplayed: 0,
                        	nonSelectedText: "Category"
                    	},
                    	events: {
                        	onInitCallback: function (localConfig) {
                            	$("#categories").closest(".row").find(".btn-group").addClass("btn-group-sm");
                            	$categories.changeEventHandler();
                        	},
                        	onChangeCallback: function (option, checked) {
                            	$categories.changeEventHandler();
                        	}
                    	},
                    	css: {
                        	maxHeight: 300
                    	}
                	});
            	},
            	defaultValue: function () {
                	return config.config.categories.selectedItems;
            	},
            	changeEventHandler: function () {
                	var $container = $("#namesearch_category_selection");
                	var $categoryControl = $("#categories");
                	var $selectedOptions = $categoryControl.find("option:selected");
                	$container.empty();
                	if ($selectedOptions) {
                    	$.each($selectedOptions, function (index, option) {
                        	var optionText = option.text;
                        	var optionValue = option.value;
                        	var label = $("<span />", {
                            	"id": "remove_" + optionValue.replace(/ /g, "_"),
                            	"class": "label label-success",
                            	"css": { "margin-right": "2px", "margin-bottom": "3px", "padding-top": "5px" },
                            	"data-category": optionValue,
                            	"text": optionText
                        	});
                        	label.append('<i class="glyphicon glyphicon-remove" data-value="' + optionValue + '" style="padding-left:2px;cursor:pointer;" title="Remove ' + optionText + ' Category"></i>');
                        	$container.append(label);
                    	});
                    	$container.on("click", "i.glyphicon-remove", function (e) {
                        	e.preventDefault();
                        	var value = $(this).attr("data-value");
                        	$container.find("#remove_" + value.replace(/ /g, "_")).fadeOut(function () {
                            	$(this).remove();
                        	});
                        	$categoryControl.multiselect('deselect', value);
                        	$container.closest(".row").find(".multiselect").text("Category").append(" <b class='caret'></b>");
                    	});
                	}
                	$container.closest(".row").find(".multiselect").text("Category").append(" <b class='caret'></b>");
            	}
        	},
			// TYPEAHEAD UNDER CONSTRUCTION
        	typeahead: {
        	  	configMap: function () {
        	      	return configData.getControlMapping(containerId, this.key)[0];
        	  	},
        	  	key: configData.controlKeys.CompFirm,
        	  	preinit: function (defaultValue) {
        	      	var defaultValue = defaultValue || this.defaultValue();
        	      	var $control = this.control();
        	      	$control
        	              	.val(this.dbIDValue() + ' - ' + this.dbNameValue() || defaultValue || "")
        	              	.data("input-value", this.dbIDValue() || defaultValue || "")
        	              	.data("parm-key", "")
        	              	.data("determinedUserId", false)
        	              	.data("typeaheadScrollReady", true)
        	              	.data("pageIndex", 1)
        	              	.data("matchedItemContext", { "ENTITY_ID": this.dbIDValue() || "", "ENTITY_NAME": this.dbNameValue() || "" })
        	              	.data("selectedRelatedEntities", [])
        	              	.data("reln-type", []);
        	      	$($control.data("relatedEntitiesGridSelector")).children().remove();
        	  	},
        	  	init: function () {
        	      	//  set visibility of controls on page
        	      	globals.setRowAttribute(this.control(), "show-create", this.configMap().visibility.create);
        	      	globals.setRowAttribute(this.control(), "show-edit", this.configMap().visibility.edit);
        	      	this.preinit();
        	      	var $control = this.control();
        	      	var $controls = matter(containerId, configData).controls;
        	      	$control.closest(".row").on("rowHide", function (e) {
        	          	$controls.matterTeam.clearSelection();
        	          	$controls.firmSwaps.clearSelection();
        	      	});
        	      	$control.change(function () { //prevent control from registering twice
        	          	var loadedFlag = $(this).attr('registered');
        	          	if (loadedFlag !== 'yes') {
        	              	$(this).attr('registered', 'yes');
        	          	}
        	          	matter(containerId, configData).events.validate();
        	      	}).on("entityComplete", function (e, entity) {
        	          	//var $controls = matter(containerId, configData).controls;
        	          	//  clear the sd/msp combo selection
        	          	$controls.firmSwaps.clearSelection();
        	          	//  check to see if we should enable the team owner lookup button
        	          	$controls.teamLookup.checkEnabled();
        	          	//  trigger the click event of the team lookup button
        	          	$controls.teamLookup.control().click();
        	      	});
        	      	//enable cross-domain requests
        	      	$.support.cors = true;
        	      	$.bg.web.namesearch.common.utility.register({});
        	      	$.bg.web.namesearch.common.ui.typeahead.register({});
        	      	$.bg.web.namesearch.common.ui.typeahead.bind(
        	                                  	$control,           	//control
        	                                  	[],                 	//data
        	                                  	0,                  	//itemsToDisplay
        	                                  	false,              	//lookupDelay
        	                                  	false,              	//minSearchChars
        	                                  	function () {       	//afterSelectFunc
        	                                      	$.bg.web.facts.matters.controls.mattercreate.ui.updateEntityControl();
        	                                  	},
        	                                  	false,              	//matcherFunc
        	                                  	false,              	//loadingContainerClass
        	                                  	$radarCore.getAppRoot() + "images/spin-sm.gif", //loadingImagePath
        	                                  	false,              	//addPageFunc
        	                                  	false,              	//extendedKeyDownFunc
        	                                  	false,              	//extendedKeyPressFunc
        	                                  	false,              	//extendedKeyUpFunc
        	                                  	false,              	//sorterFunc
        	                                  	false,              	//matchFoundCallback
        	                                  	false);             	//extendedKeyUpFuncEx
        	      	var entityIdSearch = $control;
        	      	var advancedNameSearchContainer = $("#" + containerId + " [id$=name_search_relationship]");
        	      	var entityIdSearchGoButton = $("#" + containerId + " [id$=btn_" + $control.prop("id") + "]");
        	      	entityIdSearchGoButton.click(function (e) {
        	          	var $this = $(this);
        	          	var id = $this.attr("id");
        	          	if (id) {
        	              	var $searchDiv = $("#" + containerId + " [id$=" + id.replace("btn_", "") + "]");
        	              	var $entity = $("#" + containerId + " [id$=" + id.replace("btn_", "") + "]");
        	              	var entityValue = $entity.val();
        	              	var entityId = $searchDiv.data("matchedItemContext") && $searchDiv.data("matchedItemContext").ENTITY_ID ? $searchDiv.data("matchedItemContext").ENTITY_ID : "";
        	              	var entityName = $searchDiv.data("matchedItemContext") && $searchDiv.data("matchedItemContext").ENTITY_NAME ? $searchDiv.data("matchedItemContext").ENTITY_NAME : "";
        	              	var searchHistory = $entity.attr("data-search-history");
        	              	var searchEntity = $entity.attr("data-search-entity");
        	              	var relnType = $searchDiv.attr("data-reln-type");
        	              	if (advancedNameSearchContainer.hasClass("hidden")) {
        	                  	var src = "http://localhost:56278/RelationshipSearch.aspx" +
        	                                        	"?sys=FACTSPlus" +
        	                                        	"&id=" + advancedNameSearchContainer.selector.replace("#", "") +
        	                                        	"&entity=" + searchEntity +
        	                                        	"&relntype=" + relnType +
        	                                        	"&history=" + searchHistory +
        	                                        	"&entity_search_value=" + encodeURIComponent(entityValue) +
        	                                        	"&entityId=" + entityId +
        	                                        	"&entityName=" + encodeURIComponent(entityName) +
        	                                        	"&isContextSwitcher=true" +
        	                                        	"&canSelectMultipleEntities=false" +
        	                                        	"&canChangeRelatedEntity=true";
        	                  	advancedNameSearchContainer
        	                                  	.removeClass('hidden')
        	                                  	.html("<iframe style='width:1000px;height:400px;' src='" + src + "' scrollbars='no' frameborder='0'/>").slideDown("slow");
        	              	} else {
        	                  	$searchDiv.addClass("hidden")
        	              	}
        	          	}
        	      	});
        	  	},
        	  	reinit: function () {
        	      	this.preinit();
        	  	},
        	  	control: function () {
        	      	return matter(containerId, configData).getControl(this.key);
        	  	},
        	  	defaultValue: function () {
        	      	return "";
        	  	},
        	  	val: function () {
        	      	return $.bg.web.facts.common.utility.getString(this.control().val());
        	  	},
        	  	dbIDValue: function () {
        	      	return configData.cache.matterData ? configData.cache.matterData.PRIMARY_PARTY_ID : null;
        	  	},
        	  	dbNameValue: function () {
        	      	return configData.cache.matterData ? configData.cache.matterData.PRIMARY_PARTY_NAME : null;
        	  	},
        	  	isValid: function () {
        	      	if (matter(containerId, configData).controls.matterDept.val() !== globals.defaults.SWAPS_DEPT_CODE) {
        	          	if (this.val().length > 0) {
        	              	if (this.val().substr(0, 1).toUpperCase() === "P") {
        	                  	globals.setValidationError(this.control(), { klass: configData.ERROR_CLASS_SHOW, text: "Pool ID not allowed." });
        	                  	return false;
        	              	} else {
        	                  	globals.setValidationError(this.control(), { klass: configData.ERROR_CLASS_HIDE, text: "" });
        	                  	return true;
        	              	}
        	          	} else {
        	              	globals.setValidationError(this.control(), { klass: configData.ERROR_CLASS_SHOW, text: globals.messages.REQUIRED_FIELD.replace("{{VALUE}}", this.configMap().validationPrefix) });
        	              	return false;
        	          	}
        	      	} else {
        	          	//  swaps dept selected, so just return true because we'll validate the swaps sd/msp field values
        	          	globals.setValidationError(this.control(), { klass: configData.ERROR_CLASS_HIDE, text: "" });
        	          	return true;
        	      	}
        	  	}
        	}
    	}
	};
	
	//namespace functions
	$.bg.web.namesearch.basicsearch.ui = {
    	register: function (context) {
        	locals.data.handler = new QueryHandler();
    	},
    	init: function () {
        	search(locals).categories.init();
    	}
	}
})(jQuery);