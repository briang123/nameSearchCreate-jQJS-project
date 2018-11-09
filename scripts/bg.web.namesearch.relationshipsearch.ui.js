(function ($) {
	//--- Author: Brian Gaines
	//--- August 25, 2015
	//--- Description: This file handles the Relationship Search page ui
	//define the bg namespace if it does not already exist

	if ($.bg === undefined) { $.bg = {}; }
	if ($.bg.web === undefined) { $.bg.web = {}; }
	if ($.bg.web.namesearch === undefined) { $.bg.web.namesearch = {}; }
	if ($.bg.web.namesearch.relationshipsearch === undefined) { $.bg.web.namesearch.relationshipsearch = {}; }
	
	//local variables
	var $utility = $.bg.web.namesearch.common.utility,
    	$combos = $.bg.web.namesearch.common.ui.combo,
    	$typeahead = $.bg.web.namesearch.common.ui.typeahead;
		
	var proper,
    	scrollReady,
    	relatedEntitiesGridPageIndex,
    	relatedEntitiesGridPageSize,
    	entitySearchPageIndex,
    	entitySearchPageSize,
    	matchedItemContext,
    	selectedRelatedEntities,
    	defaultInitiated,
    	query,
    	relationshipTypes,
    	entitySearch,
    	relatedEntitiesButton,
    	relatedEntityResultsTable,
    	relatedEntityItemsContainer,
    	scrollContainer,
    	relatedEntityItemsContainerChildren,
    	relatedEntityItemsReplacePatterns,
    	bottomNavBar,
    	bottomLeftMenu,
    	bottomRightMenu,
    	backToTopButton,
    	cancelButton,
    	saveCloseButton,
    	idParmVal = function () {
        	return $.trim($utility.requestQueryString("id"));
    	},
    	entityIdParamVal = function () {
        	return $.trim($utility.requestQueryString("entityId"));
    	},
    	entityNameParamVal = function () {
        	return $.trim(decodeURIComponent($utility.requestQueryString("entityName")));
    	},
    	relationshipTypeParmVal = function () {
        	var _strRelationshipTypeParmVal = $.trim($utility.requestQueryString("relntype"));
        	return (_strRelationshipTypeParmVal === undefined || _strRelationshipTypeParmVal === "undefined" || _strRelationshipTypeParmVal.length === 0) ? "69" : _strRelationshipTypeParmVal;
    	},
    	entitySearchParmVal = function () {
        	return $.trim(decodeURIComponent($utility.requestQueryString("entity_search_value")));
    	},
    	searchHistoryParmVal = function () {
        	return $.trim($utility.requestQueryString("history"));
    	},
    	appKeyParmValue = function () {
        	return "FACTSPLUS";
        	//return $.trim($utility.requestQueryString("app"));
    	},
    	isContextSwictherParmVal = function () {
        	return $.trim($utility.requestQueryString("isContextSwitcher")) === "true" ? true : false;
    	},
    	canSelectMultipleRelatedEntities = function () {
        	return $.trim($utility.requestQueryString("canSelectMultipleEntities")) === "true" ? true : false;
    	},
    	canChangeRelatedEntity = function () {
        	return $.trim($utility.requestQueryString("canChangeRelatedEntity")) === "true" ? true : false;
    	},
		bindPage = function () {
			if ($.isFunction(window.parent.disableBasicNameSearch)) {
				window.parent.disableBasicNameSearch(true);
			}
			if (!isContextSwictherParmVal() || $.trim(entitySearchParmVal()).length === 0)
				saveCloseButton.prop("disabled", true);
			backToTopButton.prop("disabled", true)
			var relnTypeDataQry = query.getRelationshipTypes("");
			//bind relationship types
			$combos.bindRelationshipControl(relationshipTypes, relnTypeDataQry.result.rows, relationshipTypeParmVal(), null);
			//format combo box if empty
			$combos.reSizeEmptyMultiSelects();
			//carry forward the entity id/name value
			entitySearch.val(entitySearchParmVal());
			//default page_load datasource query using passed in entityId
			var _entityId = entityIdParamVal();
			var _entityName = entityNameParamVal();
			if (entitySearchParmVal() && $.trim(entitySearchParmVal()).length > 0)
				entitySearch.data("matchedItemContext", (_entityId !== undefined && _entityId !== null && _entityId.length > 0) ? { "ENTITY_ID": _entityId, "ENTITY_NAME": _entityName} : {});
			//setTypeAhead(entitySearch);
			entitySearch.data("defaultInitiated", true);
			entitySearch.data("relnTypes", relationshipTypes.data("multiselect").getSelected().val());
			entitySearch.data("SEARCH_DIV_ID", idParmVal());
			entitySearch.data("relatedEntitiesGridSelector", relatedEntityItemsContainer.selector);
			relatedEntitiesButton.click();
		},
			addRelatedEntitiesRows = function (response) {
				if (response !== undefined &&
					response !== null &&
					response.result !== undefined &&
					response.result !== null &&
					response.result.result !== undefined &&
					response.result.result !== null) {
					var _rows = response.result.result.rows;
					if (_rows.length > 0) {
						if (saveCloseButton.prop("disabled"))
							saveCloseButton.prop("disabled", false);
						relatedEntityItemsContainer.find(".no-results-message").remove();
						$.each(_rows, function (index, row) {
							$.each(relatedEntityItemsContainerChildren, function (index, child) {
								relatedEntityItemsContainer.append(child);
								$.each(relatedEntityItemsReplacePatterns, function (index, pattern) {
									var propertyName = $.grep(Object.keys(row), function (n, i) {
										return "{{" + n + "}}" === pattern;
									});
									switch (pattern) {
										case "{{STATUS}}":
											var selector = $(relatedEntityItemsContainer.children().last().selector + " td:contains('" + pattern + "')");
											var status = row.REG_CAT ? row.REG_CAT : "";
											status += row[propertyName] ? " (" + row[propertyName] + ")" : "";
											selector.html(selector.html().replace(pattern, status));
											//var qryResponse = query.getEntityRegCategories("", row.ENTITY_ID);
											//var entityRegCategories = qryResponse.result.rows;
											break;
										case "{{NAME}}":
											var selector = $(relatedEntityItemsContainer.children().last().selector + " td:contains('" + pattern + "')");
											//BG: WE CAN JUST GET ID AND NAME FROM THE GRID ROW -- MOVED THE ICON TO CHKBOX COLUMN
											//var selector = $(relatedEntityItemsContainer.children().last().selector + " td:contains('" + pattern + "')").find("a:first");
											//selector.attr("data-nfaname", row.NAME).attr("data-userid", row.ENTITY_ID);
											//selector = selector.parent();
											//selector.html(selector.html().replace(pattern, row[propertyName] !== null ? proper(row[propertyName]) : ""));
											selector.html(selector.html().replace(pattern, row[propertyName] !== null ? row[propertyName] : ""));
											break;
										default:
											var selector = $(relatedEntityItemsContainer.children().last().selector + " td:contains('" + pattern + "')");
											var dateValue = "";
											if (pattern.search(/_DATE/) > -1) {
												dateValue = new Date(Date.parse(_row[propertyName]));
												dateValue = (dateValue.getMonth() + 1) + "/" + dateValue.getDate() + "/" + dateValue.getFullYear() + " " + dateValue.toLocaleTimeString();
											}
											selector.html(selector.html().replace(pattern, row[propertyName] !== null ? (pattern.search(/_DATE/) > -1 ? dateValue : (pattern.search(/LAST_UPDATED_BY_USERID/) > -1 ? row[propertyName].toUpperCase() : proper(row[propertyName]))) : ""));
											break;
									}
								});

							});
							if (isContextSwictherParmVal() || canChangeRelatedEntity()) {
								var selector = relatedEntityItemsContainer.children().last().find(" td:eq(0)");
								selector.prepend("<a bg-entity-id=\"" + row.ENTITY_ID +
								"\" bg-entity-name=\"" + row.NAME +
								"\" class=\"cs-replace-search\" href=\"javascript:void(0);\" title=\"Change Entity to " + row.ENTITY_ID + "\">" +
								"<span class=\"glyphicon glyphicon-arrow-up\" style=\"font-size:16px;\"></span></a>");
								selector.find("a[bg-entity-id=" + row.ENTITY_ID + "]").click(function () {
									replaceEntitySearch($(this).attr("bg-entity-id"), $(this).attr("bg-entity-name"));
								}).tooltip({ placement: "right" });
								selector.find("span.glyphicon.glyphicon-ok-sign:first").css("display", "none");
								relatedEntityItemsContainer.children().last().dblclick(function (e) {
									var arrow = $(this).find(" td:eq(0)").find("a[bg-entity-id=" + row.ENTITY_ID + "]");
									replaceEntitySearch(arrow.attr("bg-entity-id"), arrow.attr("bg-entity-name"));
									saveCloseButton.trigger("click");
								});
							}
						});
						entitySearch.data("scrollReady", true);
					}
					relatedEntitiesGridPageIndex++;
				}
			},
			replaceEntitySearch = function (entityId, entityName) {
				entitySearch.val(entityId + " - " + entityName);
				var _entityId = entityId;
				var _entityName = entityName;
				entitySearch.data("matchedItemContext", (_entityId !== undefined && _entityId !== null && _entityId.length > 0) ? { "ENTITY_ID": _entityId, "ENTITY_NAME": _entityName} : {});
				entitySearch.data("defaultInitiated", true);
				entitySearch.data("relnTypes", relationshipTypes.data("multiselect").getSelected().val());
				entitySearch.data("SEARCH_DIV_ID", idParmVal());
				entitySearch.data("relatedEntitiesGridSelector", relatedEntityItemsContainer.selector);
				//        	if ($.isFunction(window.parent.disableBasicNameSearch)) {
				//            	window.parent.disableBasicNameSearch(true);
				//        	}
				relatedEntitiesButton.click();
				entitySearch.data("scrollReady", false);
			},
			setButtonClicks = function () {
				//find related entities based on selected relationship type
				relatedEntitiesButton.click(function (e) {
					e.preventDefault();
					backToTopButton.prop("disabled", true);
					if (entitySearch.data("determinedUserId") === false)
						return false;
					$.each(relatedEntityItemsContainer.children(), function (index, child) {
						$(child).off("click");
					});
					relatedEntityItemsContainer.find(".no-results-message").remove();
					$.bg.web.namesearch.common.ui.typeahead.clearRelatedEntities(entitySearch);
					//GET ENTITY'S RELATIONSHIPS OF A SPECIFIC RELATIONSHIP TYPE (API CALL)
					relatedEntitiesGridPageIndex = 1;
					query.getRelatedEntities("", (entitySearch.data("matchedItemContext") !== undefined && entitySearch.data("matchedItemContext").ENTITY_ID !== undefined && entitySearch.data("matchedItemContext").ENTITY_ID.length > 0) ? entitySearch.data("matchedItemContext").ENTITY_ID : "", relationshipTypes.data("multiselect").getSelected().val(), relatedEntitiesGridPageIndex, relatedEntitiesGridPageSize, function (response) {
						addRelatedEntitiesRows(response);
						setGridEvents();
						if (!response || !response.result || !response.result.result || !response.result.result.rows || response.result.result.rows.length === 0) {
							relatedEntityItemsContainer.find(".no-results-message").remove();
							relatedEntityItemsContainer.append("<tr class=\"no-results-message\"><td>No results found.</td></tr>");
						}
					});
				});
				backToTopButton.click(function (e) {
					scrollContainer.scrollTop(0);
					setTimeout(function () {
						backToTopButton.prop("disabled", true);
					}, 100);
				});

				cancelButton.click(function (e) {
					callerDataUpdate({ "ACTION": "Cancel", "SEARCH_DIV_ID": entitySearch.data("SEARCH_DIV_ID"), "SELECTED_ENTITIES": entitySearch.data("selectedRelatedEntities") });
				});
				saveCloseButton.click(function () {
					if (!isContextSwictherParmVal())
						callerDataUpdate({ "ACTION": "Save", "SEARCH_DIV_ID": entitySearch.data("SEARCH_DIV_ID"), "SELECTED_ENTITIES": entitySearch.data("selectedRelatedEntities") });
					else
						callerDataUpdate({ "ACTION": "Save", "SEARCH_DIV_ID": entitySearch.data("SEARCH_DIV_ID"), "SELECTED_ENTITIES": [{ entityId: entitySearch.data("matchedItemContext").ENTITY_ID}] });
				});
			},
			setGridEvents = function () {
				//SHOWING POPOVER WHEN MOUSE OVER COMMENT ICON
				$('[data-toggle="popover"]').off("mouseenter");
				$('[data-toggle="popover"]').on("mouseenter", function () {
					var _entityDetails = "";
					var _qryResponse = query.getEntityDetails("", $(this).parent().parent().find("td:eq(1)").text());
					if (_qryResponse !== undefined &&
								_qryResponse !== null &&
								_qryResponse.result !== undefined &&
								_qryResponse.result !== null &&
								_qryResponse.result.rows !== undefined &&
								_qryResponse.result.rows !== null &&
								_qryResponse.result.rows.length > 0) {
						$.each(_qryResponse.result.rows, function (index, row) {
							_entityDetails += row.INFO;
						});
						//remove the first <br/>
						if (_entityDetails.substring(0, 4).toLowerCase() === "<br/>")
							_entityDetails = _entityDetails.substring(5, _entityDetails.length - 5);
					}
					$(this).css("cursor", "pointer").off("popover");
					$(this).css("cursor", "pointer").attr("data-content", _entityDetails).popover('show');
				}).on('mouseleave', function () {
					setTimeout(function () {
						$(this).popover('hide')
					}, 5000);
				}).popover({
					html: 'true',
					placement: 'auto right',
					trigger: 'hover',
					width: "500px",
					height: "475px",
					title: function () {
						return $(this).parent().parent().find("td:eq(2)").text() + " (" + $(this).parent().parent().find("td:eq(1)").text() + ")";
					},
					content: function () {
						return "<div class='body'>" + $(this).attr("data-content") + "</div>"
					}
				});

				relatedEntityItemsContainer.find("tr").off("click");
				relatedEntityItemsContainer.find("tr").on("click", function () {
					if (isContextSwictherParmVal())
						return false;
					saveCloseButton.prop("disabled", false);
					//--- first time here? initialize value to empty array
					if (!entitySearch.data("selectedRelatedEntities")) {
						entitySearch.data("selectedRelatedEntities", [])
					}
					//--- already selected?
					var $thisClickedItem = $(this);
					var isAlreadySelected = false;
					$.each($(this).parent().find("tr.entity-selected"), function (index, selectedItem) {
						$(selectedItem).text() === $thisClickedItem.closest("tr").text() ? isAlreadySelected = true : "";
					});
					//if (!canSelectMultipleRelatedEntities()) {
					if (isAlreadySelected) {
						//--- remove selected
						var _entityIdItemToRemove = $thisClickedItem.find("td:eq(1)").text();
						$thisClickedItem.find("td:eq(0)").find("span:first").css("visibility", "hidden");
						//$(this).parent().find("tr.entity-selected").find("td:eq(0)").find("input[type=\"checkbox\"]").prop("checked", false);
						$thisClickedItem.removeClass("entity-selected");
						$.each(entitySearch.data("selectedRelatedEntities"), function (index, entityItem) {
							if (entityItem && entityItem.ENTITY_ID === _entityIdItemToRemove)
								entitySearch.data("selectedRelatedEntities").splice(index, 1);
						});
					}
					else if (!canSelectMultipleRelatedEntities()) {
						var _selectedRow = $thisClickedItem.parent().find("tr.entity-selected");
						if (_selectedRow.length > 0) {
							var _entityIdItemToRemove = $thisClickedItem.parent().find("tr.entity-selected").find("td:eq(1)").text();
							$thisClickedItem.parent().find("tr.entity-selected").find("td:eq(0)").find("span:first").css("visibility", "hidden");
							$thisClickedItem.parent().find("tr.entity-selected").removeClass("entity-selected");
							$.each(entitySearch.data("selectedRelatedEntities"), function (index, entityItem) {
								if (entityItem && entityItem.ENTITY_ID === _entityIdItemToRemove)
									entitySearch.data("selectedRelatedEntities").splice(index, 1);
							});
						}
					}
					//}
					//--- already selected? then nothing to else to do
					if (isAlreadySelected /*&& !canSelectMultipleRelatedEntities()*/) {
						return;
					} else if (entitySearch.data("selectedRelatedEntities").length === 0 || canSelectMultipleRelatedEntities()) {
						//--- add selected
						$(this).find("td:first").find("span:first").css("visibility", "visible"); //.prepend("<span class=\"glyphicon glyphicon-play-circle\" style=\"font-size:16px\"></span>");
						//$(this).closest("tr").eq(0).find("input[type=\"checkbox\"]").prop("checked", true);
						$(this).addClass("entity-selected"); //.css("background-color", "yellow");
						entitySearch.data("selectedRelatedEntities").push({
							"ENTITY_ID": $(this).closest("tr").find("td:eq(1)").text(),
							"ENTITY_NAME": $(this).closest("tr").find("td:eq(2)").text(),
							"RELATIONSHIP_TYPE": relationshipTypes.find("option:selected").text(),
							"RELATIONSHIP_TYPE_ID": relationshipTypes.data("multiselect").getSelected().val(),
							"PARENT_ENTITY_ID": entitySearch.data("matchedItemContext").ENTITY_ID,
							"PARENT_ENTITY_NAME": entitySearch.data("matchedItemContext").ENTITY_NAME
						});
					}

				});
				scrollContainer.off("scroll");
				scrollContainer.scroll(function (e) {
					var $this = $(this);
					if ($this[0].scrollHeight - $this.scrollTop() == $this.outerHeight() && entitySearch.data("scrollReady")) {
						entitySearch.data("scrollReady", false);
						//GET ENTITY'S RELATIONSHIPS OF A SPECIFIC RELATIONSHIP TYPE (API CALL)
						query.getRelatedEntities("", (entitySearch.data("matchedItemContext") !== undefined && entitySearch.data("matchedItemContext").ENTITY_ID !== undefined && entitySearch.data("matchedItemContext").ENTITY_ID.length > 0) ? entitySearch.data("matchedItemContext").ENTITY_ID : "", relationshipTypes.data("multiselect").getSelected().val(), relatedEntitiesGridPageIndex, relatedEntitiesGridPageSize, function (response) {
							addRelatedEntitiesRows(response);
							setGridEvents();
						});
					}
					if (backToTopButton.prop("disabled") && $this.scrollTop() !== 0)
						backToTopButton.prop("disabled", false);
					else if ($this.scrollTop() === 0)
						backToTopButton.prop("disabled", true);
				});

			},
			callerDataUpdate = function (action) {
				window.parent.processSearchDivRequest(action);
			}

	//namespace functions
	$.bg.web.namesearch.relationshipsearch.ui = {
    	register: function (context) {
        	query = new QueryHandler();
        	relationshipTypes = context.relationshipTypes;
        	entitySearch = context.entitySearch;
        	relatedEntitiesButton = context.relatedEntitiesButton;
        	relatedEntityResultsTable = context.relatedEntityResultsTable;
        	relatedEntityItemsContainer = context.relatedEntityItemsContainer;
        	scrollContainer = context.scrollContainer;
        	relatedEntityItemsContainerChildren = context.relatedEntityItemsContainerChildren;
        	relatedEntityItemsReplacePatterns = context.relatedEntityItemsReplacePatterns;
        	bottomNavBar = context.bottomNavBar;
        	bottomLeftMenu = context.bottomLeftMenu;
        	bottomRightMenu = context.bottomRightMenu;
        	backToTopButton = context.backToTopButton;
        	cancelButton = context.cancelButton;
        	saveCloseButton = context.saveCloseButton;
    	},
    	init: function () {
        	entitySearch.data("scrollReady", true);
        	relatedEntitiesGridPageIndex = 1;
        	relatedEntitiesGridPageSize = 15;
        	entitySearchPageIndex = 1
        	entitySearchPageSize = 15;
        	proper = $.bg.web.namesearch.common.utility.toProperCase;
        	$("#load_message").hide();
        	if (typeof String.prototype.startsWith != 'function') {
            	String.prototype.startsWith = function (str) {
                	return this.slice(0, str.length) == str;
            	};
        	}
        	setButtonClicks();
        	bindPage();
        	//setGridEvents();
    	}
	};
})(jQuery);