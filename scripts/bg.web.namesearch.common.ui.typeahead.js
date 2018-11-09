(function ($) {
	//--- Author: Brian Gaines
	//--- September 9, 2015
	//--- Description: This file handles the inner workings of the typeahead
	//define the bg namespace if it does not already exist
	
	if ($.bg === undefined) { $.bg = {} }
	if ($.bg.web === undefined) { $.bg.web = {} }
	if ($.bg.web.namesearch === undefined) { $.bg.web.namesearch = {} }
	if ($.bg.web.namesearch.common === undefined) { $.bg.web.namesearch.common = {} }
	if ($.bg.web.namesearch.common.ui === undefined) { $.bg.web.namesearch.common.ui = {} }
	
	var q, s,
    	matchedItemContext,
    	applicationRootUrl,
    	pageSize,
    	dbPageSize,
    	$nsUtility;
	
	$.bg.web.namesearch.common.ui.typeahead = {
    	register: function (context) {
        	if (!q) this.init();
    	},
    	getLookupDelay: function () {
        	return 0; //delay (in seconds) before query
    	},
    	getMinSearchChars: function () {
        	return 1; //characters typed before query is performed
    	},
    	getPageSize: function () {
        	return !pageSize || pageSize === 0 ? dbPageSize : pageSize; //items to display per page
    	},
    	clearRelatedEntities: function (control) {
        	if (control.data("relatedEntitiesGridSelector")) {
            	//---- in the futre we will need to account for multiple selection
            	$.each($(control.data("relatedEntitiesGridSelector")).children(), function (index, child) {
                	if (!$(child).closest("tr").eq(0).find("input[type=\"checkbox\"]").prop("checked")) {
                    	$(child).remove();
                	}
            	});
            	$(control.data("relatedEntitiesGridSelector")).append("<tr class=\"no-results-message\"><td>No results found.</td></tr>");
        	}
    	},
    	getSearchResults: function (appKey, relnTypes, control, loadingContainerClass, searchValue, pageIndex, pageSize, scrolling, menu) {
        	if (!searchValue || searchValue.length === 0) {
            	control.data("typeaheadScrollReady", true);
            	return;
        	}
        	var thisInstance = this;
        	if (!searchValue) searchValue = "";
        	if (!pageIndex) pageIndex = 1;
        	if (!pageSize) pageSize = this.getPageSize();
        	//--- show a loading message.
        	if ($("#text_loading_spinner").length === 0)
            	$(loadingContainerClass).append("<span id=\"text_loading_spinner\" class=\"text-uppercase small text-muted\" padding=\"2px\"><img alt=\"\" src=\"" + control.data("loadingImagePath") + "\"/></span>");
        	var ajaxREQ = $.ajax({
            	url: applicationRootUrl + (relnTypes ? 'Api/QueryHandler.ashx/getBasicSearchDataByRelnType' : 'Api/QueryHandler.ashx/getBasicSearchData'),
            	type: 'GET',
            	cache: false,
            	data: "AppKey=" + "" + "&SearchValue=" + searchValue + "&PageIndex=" + pageIndex + "&PageSize=" + pageSize + (relnTypes ? "&RelationshipTypeList=" + relnTypes : ""),
            	dataType: 'json',
            	timeout: 11000,
            	error: function (e) {
                	if (e.statusText !== "abort") {
                    	$("#text_loading_spinner").remove();
                    	//--- add a delay and try to remove again
                    	//--- because sometimes it fails to remove
                    	//--- the first time
                    	setTimeout(function () {
                        	$("#text_loading_spinner").remove();
                    	}, 100);
                    	$("#name_search_relationship_userid").blur();
                	}
            	},
            	success: function (jsondata) {
                	if (!scrolling) {
                    	thisInstance.setSearchResults(control, jsondata);
                    	$("#text_loading_spinner").remove();
                    	//--- add a delay and try to remove again
                    	//--- because sometimes it fails to remove
                    	//--- the first time
                    	setTimeout(function () {
                        	$("#text_loading_spinner").remove();
                    	}, 100);
                	}
                	else {
                    	thisInstance.setPage(control, jsondata, menu);
                    	$("#text_loading_spinner").remove();
                    	//--- add a delay and try to remove again
                    	//--- because sometimes it fails to remove
                    	//--- the first time
                    	setTimeout(function () {
                        	$("#text_loading_spinner").remove();
                    	}, 100);
                	}
            	}
        	});
        	return ajaxREQ;
    	},
    	setSearchResults: function (control, jsondata) {
        	var _rows = jsondata.result.result.rows;
        	var _data = [];
        	for (i = 0; i < _rows.length; i++) {
            	var _row = _rows[i];
            	//--- add the display value to the row. ("name" is required)
            	_row.name = _row.ENTITY_ID + " - " + _row.ENTITY_NAME
            	_data.push(_row);
        	}
        	//--- set the datasource.
        	//--- trigger the typeahead dropdown.
        	//--- remove loading message.
        	control.data("typeahead").source = _data;
        	control.data("typeahead").render(control.data("typeahead").source)
        	if (!control.data("determinedUserId") && !control.data("typeahead").shown && control.data("typeahead").source.length > 0) {
            	control.data("typeahead").show();
            	control.data("typeahead").$menu.focus();
        	}
        	else if (control.data("typeahead").source.length === 0 && control.data("typeahead").shown) {
            	control.data("typeahead").hide();
        	}
    	},
    	getLoadingContainerClass: function () {
        	return ".text-loading";
    	},
    	getLoadingImagePath: function () {
        	return "../../images/spin-sm.gif";
    	},
    	addPageFunc: function (control, menu, loadingContainerClass) {
        	var pageIndex;
        	if (control.data("typeaheadScrollReady") || control.data("typeaheadScrollReady") === undefined) {
            	control.data("typeaheadScrollReady", false);
            	if (!control.data("pageIndex")) {
                	pageIndex = 2;
                	control.data("pageIndex", pageIndex);
            	}
            	else {
                	pageIndex = control.data("pageIndex") + 1;
            	}
            	var ajaxREQ = $.bg.web.namesearch.common.ui.typeahead.getSearchResults("", control.data("relnTypes"), control, loadingContainerClass, control.val(), pageIndex, control.data("typeahead").options.items, true, menu);
        	}
    	},
    	setPage: function (control, jsondata, menu) {
        	$.each(jsondata.result.result.rows, function (index, item) {
            	item.name = item.ENTITY_ID + " - " + item.ENTITY_NAME
            	control.data("typeahead").source.push(item);
        	});
        	control.data("typeahead").render(control.data("typeahead").source);
        	control.data("pageIndex", control.data("pageIndex") + 1);
        	control.data("typeaheadScrollReady", true);
    	},
    	afterSelectFunc: function (thisInstance, item, control) {
        	control.data("determinedUserId", true);
        	control.data("matchedItemContext", item);
        	//---- clear related entity if related entity control exists on the page.
        	if (control.data("related-entity-typeahead-selector")) {
            	$("#" + control.data("related-entity-typeahead-selector")).val("");
            	$("#" + control.data("related-entity-typeahead-selector")).data("input-value", "");
            	$("#" + control.data("related-entity-typeahead-selector")).data("parm-key", "");
            	$("#" + control.data("related-entity-typeahead-selector")).closest("div.row").parent().addClass('hidden').slideUp("slow");
        	}
        	try { window.parent.updateEntityControl() } catch (err) { }
        	if (control.data("relnTypes")) {
            	control.data("selectedRelatedEntities", [{ "SEARCH_DIV_ID": control.data("SEARCH_DIV_ID"), "PARENT_ENTITY_ID": control.data("matchedItemContext").ENTITY_ID, "PARENT_ENTITY_NAME": control.data("matchedItemContext").ENTITY_NAME}]);
            	// $(control.relatedEntityItemsContainerSelector).children().remove();
            	control.data("scrollReady", true);
        	}
        	return true;
    	},
    	extendedKeyDownFunc: function (control, e) {
    	},
    	extendedKeyPressFunc: function (control, e) {
    	},
    	extendedKeyUpFunc: function (control, e) {
        	switch (e.keyCode) {
            	case 13:
                	if (!control.data("typeahead").shown) {
                    	control.blur();
                	}
            	case 38: // up arrow
                	// control.data("typeahead").$menu.scrollTop(control.data("typeahead").$menu.find(".active").offset().top - control.data("typeahead").$menu.find(".active").height())
                	return;
                	break;
            	case 40: // down arrow
                	//	control.data("typeahead").$menu.scrollTop(control.data("typeahead").$menu[0].scrollHeight - control.data("typeahead").$menu.find(".active").offset().top)
                	return;
                	break;
        	}
        	if (e.keyCode !== 17) {
            	control.data("determinedUserId", false);
            	$.bg.web.namesearch.common.ui.typeahead.clearRelatedEntities(control);
        	}
        	control.data("typeahead").query = control.val().startsWith("*") ? control.val().substring(1) : control.val();
        	var ajaxREQ = $.bg.web.namesearch.common.ui.typeahead.getSearchResults("", control.data("relnTypes"), control, control.data("loadingContainerClass"), control.val(), 1, control.data("typeahead").options.items);
        	control.data("pageIndex", 1);
        	if (ajaxREQ)
            	control.typeAheadRequests.push(ajaxREQ);
        	for (i = 0; i < control.typeAheadRequests.length - 1; i++) {
            	if (control.typeAheadRequests[i])
                	control.typeAheadRequests[i].abort();
            	control.typeAheadRequests.shift();
        	}
        	if (control.data("typeahead").query.length === 7)
            	$.bg.web.namesearch.common.ui.typeahead.determineUserId(control);
    	},
    	extendedKeyUpFuncEx: function (control, e) {
    	},
    	determineUserId: function (control) {
        	var $this = this;
        	var query = control.data("typeahead").query;
        	//--- determine if it's just an userid.
        	//--- the reason we make sure it's length
        	//--- is 7 is because getPaddedUserId is
        	//--- smart enough to auto-complete(pad 0's)
        	//--- and in this case we don't want that
        	//--- since we may still be typing to see
        	//--- some typeahead results.
        	if (query.length === 7) {
            	var userIdCheck = $nsUtility.getPaddedUserId(query);
            	if (userIdCheck.success) {
                	//--- it appears to be a valid userid, so let's try to get the entity name.
                	//--- if we don't have an item
                	//--- row num, then we don't
                	//--- have a datasource and
                	//--- should not set the determined
                	//--- flag since the matcher function
                	//--- will not be called again and
                	//--- causing us to not be able
                	//--- to reset the flag later.
                	//                	if (item.RN !== undefined) {
                	//                    	control.data("determinedUserId", true)
                	//                	}
                	control.data("matchedItemContext", { "ENTITY_ID": control.val(), "ENTITY_NAME": "" });
                	//control.data("textSinceLastKeyDown", thisInstance.query)
                	var _entityName;
                	//--- we not already called, then make call to get entity name
                	if (!control.data("waitingForGetEntityNameResponse")) {
                    	q.getEntityName("", userIdCheck.paddedUserId, function (response) {
                        	if (response.result.result !== undefined && response.result.result !== null && response.result.result.length > 0) {
                            	control.data("waitingForGetEntityNameResponse", false);
                            	control.data("determinedUserId", true);
                            	control.val(userIdCheck.paddedUserId + " - " + response.result.result);
                            	control.data("matchedItemContext", { "ENTITY_ID": userIdCheck.paddedUserId, "ENTITY_NAME": response.result.result, "name": userIdCheck.paddedUserId + " - " + response.result.result });
                            	$this.matchFoundCallback(control);
                            	//---- clear related entity if related entity control exists on the page.
                            	if (control.data("related-entity-typeahead-selector")) {
                                	$("#" + control.data("related-entity-typeahead-selector")).val("");
                                	$("#" + control.data("related-entity-typeahead-selector")).data("input-value", "");
                                	$("#" + control.data("related-entity-typeahead-selector")).data("parm-key", "");
                                	$("#" + control.data("related-entity-typeahead-selector")).closest("div.row").parent().addClass('hidden').slideUp("slow");
                            	}
                            	try { window.parent.updateEntityControl() } catch (err) { }
                            	if (control.data("relnTypes")) {
                                	//control.data("selectedRelatedEntities", [{ "SEARCH_DIV_ID": control.data("SEARCH_DIV_ID"), "PARENT_ENTITY_ID": control.data("matchedItemContext").ENTITY_ID, "PARENT_ENTITY_NAME": control.data("matchedItemContext").ENTITY_NAME}]);
                                	control.data("scrollReady", true);
                            	}
                            	//--- we have an userid and an entity name
                            	//--- no need to continue to look for a
                            	//--- match, so just exit.
                            	$("#text_loading_spinner").remove();
                            	return false;
                        	}
                        	else //--- no entity name found for userid
                            	control.data("determinedUserId", false)
                    	});
                	}
                	control.data("waitingForGetEntityNameResponse", true);
            	}
            	else //--- no userid determined
                	control.data("determinedUserId", false);
        	}
    	},
    	matchFoundCallback: function (control) {
    	},
    	bind: function (control, data, itemsToDisplay, lookupDelay, minSearchChars, afterSelectFunc, matcherFunc, loadingContainerClass, loadingImagePath, addPageFunc, extendedKeyDownFunc, extendedKeyPressFunc, extendedKeyUpFunc, sorterFunc, matchFoundCallback, extendedKeyUpFuncEx) {
        	var $this = this;
        	pageSize = itemsToDisplay;
        	if (!itemsToDisplay) itemsToDisplay = this.getPageSize();
        	if (pageSize === 0)
            	itemsToDisplay = dbPageSize;
        	if (!lookupDelay) lookupDelay = this.getLookupDelay();
        	if (!minSearchChars) minSearchChars = this.getMinSearchChars();
        	if (!afterSelectFunc) afterSelectFunc = this.afterSelectFunc;
        	if (!matcherFunc) matcherFunc = this.matcherFunc;
        	if (!loadingContainerClass) loadingContainerClass = this.getLoadingContainerClass();
        	if (!loadingImagePath) loadingImagePath = this.getLoadingImagePath();
        	if (!addPageFunc) addPageFunc = this.addPageFunc;
        	if (!extendedKeyDownFunc) extendedKeyDownFunc = this.extendedKeyDownFunc;
        	if (!extendedKeyPressFunc) extendedKeyPressFunc = this.extendedKeyPressFunc;
        	if (!extendedKeyUpFunc) extendedKeyUpFunc = this.extendedKeyUpFunc;
        	if (!sorterFunc) sorterFunc = this.sorterFunc;
        	if (!matchFoundCallback) { matchFoundCallback = this.matchFoundCallback } else { this.matchFoundCallback = matchFoundCallback; };
        	if (!extendedKeyUpFuncEx) { extendedKeyUpFuncEx = this.extendedKeyUpFuncEx } else { this.extendedKeyUpFuncEx = extendedKeyUpFuncEx; };
        	control.typeAheadRequests = [];
        	control.data("loadingContainerClass", loadingContainerClass);
        	control.data("loadingImagePath", loadingImagePath);
        	control.typeahead({
            	items: itemsToDisplay,
            	delay: lookupDelay,
            	minLength: minSearchChars,
            	source: data,
            	afterSelect: function (obj) {
                	return afterSelectFunc(this, obj, control);
            	},
            	addPage: function (menu) {
                	return addPageFunc(control, menu, loadingContainerClass);
            	},
            	extendedKeyDown: function (e) {
                	return extendedKeyDownFunc(control, e);
            	},
            	extendedKeyPress: function (e) {
                	if (e.keyCode === 13) {
                    	e.preventDefault();
                    	control.blur();
                	}
                	return extendedKeyPressFunc(control, e);
            	},
            	extendedKeyUp: function (e) {
                	return extendedKeyUpFunc(control, e);
            	},
            	matchFoundCallback: function () {
                	return matchFoundCallback(control);
            	},
            	extendedKeyUpEx: function (e) {
                	return extendedKeyUpFuncEx(control, e);
            	}
        	});
			
        	control.blur(function (e) {
            	var thisInstance = $(this);
            	//control.data("textSinceLastKeyDown", thisInstance.val())
            	if (!control.data("determinedUserId")) {
                	if ($(":focus").parents(".bg-scrollable-typeahead.typeahead.dropdown-menu").length == 0 && !(control.parent()[0] === $(":focus")[0])) {
                    	setTimeout(function () {
                        	var userIdCheck = $nsUtility.getPaddedUserId(thisInstance.val());
                        	if (userIdCheck.success) {
                            	control.data("matchedItemContext", { "ENTITY_ID": control.val(), "ENTITY_NAME": "" });
                            	control.data("determinedUserId", true);
                            	//--- it appears to be a valid userid, so let's try to get the entity name.
                            	var _entityName = q.getEntityName("", userIdCheck.paddedUserId, function (response) {
                                	if (response.result !== undefined &&
                                	response.result !== null &&
                                	response.result.result !== undefined &&
                                	response.result.result !== null &&
                                	response.result.result.length > 0) {
                                    	control.val(userIdCheck.paddedUserId + " - " + response.result.result);
                                    	control.data("matchedItemContext", { "ENTITY_ID": userIdCheck.paddedUserId, "ENTITY_NAME": response.result.result, "name": userIdCheck.paddedUserId + " - " + response.result.result });
                                    	if (control.data("isContextSwitcherInitializing") !== undefined) {
                                        	if (control.data("isContextSwitcherInitializing"))
                                            	control.data("isContextSwitcherInitializing", false);
                                        	else {
                                            	$this.matchFoundCallback(control);
                                        	}
                                    	}
                                    	//---- clear related entity if related entity control exists on the page.
                                    	if (control.data("related-entity-typeahead-selector")) {
                                        	$("#" + control.data("related-entity-typeahead-selector")).val("");
                                        	$("#" + control.data("related-entity-typeahead-selector")).data("input-value", "");
                                        	$("#" + control.data("related-entity-typeahead-selector")).data("parm-key", "");
                                        	$("#" + control.data("related-entity-typeahead-selector")).closest("div.row").parent().addClass('hidden').slideUp("slow");
                                    	}
                                    	control.data("typeahead").hide();
                                    	try { window.parent.updateEntityControl() } catch (err) { }
                                    	$("#text_loading_spinner").remove();
                                    	return false;
                                	}
                            	});
                        	} else {
                            	if (!control.data("determinedUserId") && !control.data("typeahead").shown && control.data("typeahead").source.length > 0) {
                                	control.data("typeahead").render(control.data("typeahead").source).show();
                                	control.data("typeahead").$menu.focus();
                            	}
                        	}
                    	}, 10);
                	}
            	}
            	else if (control.data("typeahead").shown) {
                	control.data("typeahead").hide();
            	}
        	});
    	},
    	init: function () {
        	$nsUtility = $.bg.web.namesearch.common.utility;
        	if (!q) q = new QueryHandler();
        	if (!s) s = new SystemHandler();
        	applicationRootUrl = s.getSystemEnvironmentContext().result.ApplicationRootUrl;
        	applicationRootUrl = applicationRootUrl + (applicationRootUrl.substring(applicationRootUrl.length - 1) !== "/" ? "/" : "");
        	dbPageSize = s.getSystemEnvironmentContext().result.ComboPageSize;
    	},
    	getApplicationRootUrl: function () { return applicationRootUrl; },
    	data: {
        	getBasicSearchCategories: function () {
            	return [{ "displayValue": "POOLS", "value": "", "checked": false, "order": 5 },
                    	{ "displayValue": "FCM", "value": "", "checked": false, "order": 10 },
                    	{ "displayValue": "FDM", "value": "", "checked": false, "order": 15 },
                    	{ "displayValue": "IB", "value": "", "checked": false, "order": 20 },
                    	{ "displayValue": "SD", "value": "", "checked": false, "order": 25 },
                    	{ "displayValue": "MSP", "value": "", "checked": false, "order": 30 },
                    	{ "displayValue": "NFA MEMBER", "value": "", "checked": false, "order": 35}];
        	},
        	buildBasicSearchCategoryDropDown: function (parentId, labelContainerId) {
            	var tmpl = "<li><a href=\"#\"><input class=\"" + parentId + "_namesearch_categories\" type=\"checkbox\" {{CHECKED}}/>{{VALUE}}</a></li>";
            	var html = "";
            	$.each($.bg.web.namesearch.common.ui.typeahead.data.getBasicSearchCategories, function (item) {
                	html += tmpl.replace("{{VALUE}}", item.displayValue).replace("{{CHECKED}}", item.checked ? " checked": "");
            	});                     	
            	//  create/remove label when checkbox clicked
            	$(document).off().on("click", "." + parentId + "_namesearch_categories", function (checked) {
                	var $el = $("[data-parent-id=\"" + parentId + "\"][data-category=\"" + $(this).text() + "\"]");
                	if (checked) {
                    	if ($el.length == 0) {
                        	var label = "<span class=\"label label-success\" data-parent-id=\"{{PARENTID}}\" data-category=\"{{VALUE}}\">{{VALUE}}&nbsp;<i class=\"glyphicon glyphicon-remove\"></i></span>";
                        	$("#" + labelContainerId).append(label.replace(/{{VALUE}}/g, $(this).text()));
                    	}
                	} else {
                    	if ($el.length > 0) {
                        	$el.remove();
                    	}
                	}
                	//alert($(this).text());
            	});
            	return html;
        	}
    	}
	}
})(jQuery);
