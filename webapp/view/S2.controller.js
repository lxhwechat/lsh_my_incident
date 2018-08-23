/*global history */
sap.ui.define([
	"zwx/sm/itsm/myincidents/view/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"zwx/sm/itsm/myincidents/util/Formatter",
	"zwx/sm/itsm/myincidents/util/Util",
	"zwx/sm/itsm/myincidents/util/TableOperations",
	"sap/ui/core/routing/HashChanger"
], function(BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, Formatter, Util, TableOperations, HashChanger) {
	"use strict";

	return BaseController.extend("zwx.sm.itsm.myincidents.view.S2", {

		formatter: Formatter,
		_sIdentity: "zwx.sm.itsm.myincidents",

		// Test
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {
			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;
			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			// Subscribe to event that is triggered by other screens when Incident was withdrawn or confirmed
			var fnOnWithdrawExecuted = function() {
				this.onWithdrawExecuted("");
			};

			var fnOnConfirmExecuted = function() {
				this.onConfirmExecuted("");
			};

			var fnOnSaveExecuted = function() {
				this.onSaveExecuted("");
			};

			this._oEventBus = this.getEventBus();
			this._oEventBus.subscribe(this._sIdentity, "withdrawExecuted", jQuery.proxy(fnOnWithdrawExecuted, this));
			this._oEventBus.subscribe(this._sIdentity, "confirmExecuted", jQuery.proxy(fnOnConfirmExecuted, this));
			this._oEventBus.subscribe(this._sIdentity, "saveExecuted", jQuery.proxy(fnOnSaveExecuted, this));

			this._oTableOperations = new TableOperations(this._oList, ["Description", "ObjectId"]);
			// Get Ressource Model
			this.bundle = this.getResourceBundle();

			this.setModel(oViewModel, "masterView");
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function() {
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			this._oPrioGroups = {
				"Low": this.bundle.getText("PRIO_LOW"),
				"Medium": this.bundle.getText("PRIO_MEDIUM"),
				"High": this.bundle.getText("PRIO_HIGH"),
				"Very High": this.bundle.getText("PRIO_VERY_HIGH"),
				"unknownPrio": this.bundle.getText("PRIO_UNKNOWN")
			};

			this._oChangedOnGroups = {
				"Today": this.bundle.getText("TODAY"),
				"Yesterday": this.bundle.getText("YESTERDAY"),
				"ThisWeek": this.bundle.getText("THIS_WEEK"),
				"LastWeek": this.bundle.getText("LAST_WEEK"),
				"ThisMonth": this.bundle.getText("THIS_MONTH"),
				"LastMonth": this.bundle.getText("LAST_MONTH"),
				"ThisYear": this.bundle.getText("THIS_YEAR"),
				"LastYear": this.bundle.getText("LAST_YEAR"),
				"YearsAgo": this.bundle.getText("YEARS_AGO")
			};

			var aGroupItems = {
				itemsGroup: [{
					text: this.bundle.getText("GROUP_NONE"),
					key: "",
					id: "masterGroupNone"
				}, {
					text: this.bundle.getText("GROUP_PRIORITY"),
					key: "Priority",
					id: "masterGroupPriority"
				}, {
					text: this.bundle.getText("GROUP_STATUS"),
					key: "Concatstatuser",
					id: "masterGroupStatus"
				}, {
					text: this.bundle.getText("GROUP_LAST_CHANGE_DATE"),
					key: "ChangedAtDate",
					id: "masterGroupLastChange"
				}]

			};

			var aFilterItems = {
				itemsFilter: [{
					text: this.bundle.getText("FILTER_ALL_OPEN"),
					key: "All"
				}, {
					text: this.bundle.getText("FILTER_NEW"),
					key: "New"
				}, {
					text: this.bundle.getText("FILTER_IN_PROCESS"),
					key: "InProcess"
				}, {
					text: this.bundle.getText("FILTER_CUSTOMER_ACTION"),
					key: "CustomerAction"
				}, {
					text: this.bundle.getText("FILTER_PROPOSED_SOLUTION"),
					key: "SolutionProvided"
				}, {
					text: this.bundle.getText("FILTER_WITHDRAWN"),
					key: "Withdrawn"
				}, {
					text: this.bundle.getText("FILTER_CLOSED"),
					key: "Confirmed"
				}]

			};

			this.jsonModelGroups = new sap.ui.model.json.JSONModel();
			this.jsonModelGroups.setData(aGroupItems);

			this.jsonModelFilter = new sap.ui.model.json.JSONModel();
			this.jsonModelFilter.setData(aFilterItems);
			this.byId("filterSelect").setModel(this.jsonModelFilter, "jsonFilter");
			this.byId("selectGroup").setModel(this.jsonModelGroups, "jsonGroup");

			this.byId("selectGroup").bindAggregation("items", ({
				path: "jsonGroup>/itemsGroup",
				templateShareable: "true",
				sorter: {
					path: "Name"
				},

				template: new sap.ui.core.Item({
					key: "{jsonGroup>key}",
					text: "{jsonGroup>text}"

				})
			}));

			this.byId("filterSelect").bindAggregation("items", ({
				path: "jsonFilter>/itemsFilter",
				templateShareable: "true",
				sorter: {
					path: "Name"
				},

				template: new sap.ui.core.Item({
					key: "{jsonFilter>key}",
					text: "{jsonFilter>text}"

				})
			}));

			this.oRouter = this.getRouter();
			this.oRouter.getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.oRouter.attachBypassed(this.onBypassed, this);

			this._oGroupFunctions = {

				// Assumption is that all prices contain the currency code and that the currency conversion has to be done in
				// the backend system of the app
				Priority: function(oListItemContext) {
					var sKey, iPrio = Number(oListItemContext.getProperty("Priority"));
					if (iPrio === 1) {
						sKey = "Very High";
					} else if (iPrio === 2) {
						sKey = "High";
					} else if (iPrio === 3) {
						sKey = "Medium";
					} else if (iPrio === 4) {
						sKey = "Low";
					} else {
						sKey = "unknownPrio";
					}

					return {
						key: sKey,
						text: this._oPrioGroups[sKey]
					};
				},

				Concatstatuser: function(oListItemContext) {
					return this._getStatusName(oListItemContext);
				},

				ChangedAtDate: function(oListItemContext) {
					var sKey, sChangedOn = oListItemContext.getProperty("ChangedAtDate");
					sChangedOn = Util.setDateToMidnight(sChangedOn).getTime();

					if (sChangedOn === this.sCurrentDate) {
						sKey = "Today";

					} else if (sChangedOn < this.sCurrentDate && sChangedOn >= this.sYesterday) {
						sKey = "Yesterday";
					} else if (sChangedOn < this.sYesterday && sChangedOn >= this.sStartOfThisWeek) {
						sKey = "ThisWeek";
					} else if (sChangedOn < this.sStartOfThisWeek && sChangedOn >= this.sStartOfLastWeek) {
						sKey = "LastWeek";
					} else if (sChangedOn < this.sCurrentDate && sChangedOn >= this.sStartDayOfCurrentMonth) {
						sKey = "ThisMonth";
					} else if (sChangedOn < this.sStartDayOfCurrentMonth && sChangedOn >= this.sStartDayOfLastMonth) {
						sKey = "LastMonth";
					} else if (sChangedOn < this.sStartDayOfLastMonth && sChangedOn >= this.sStartDayOfCurrentYear) {
						sKey = "ThisYear";
					} else if (sChangedOn < this.sStartDayOfCurrentYear && sChangedOn >= this.sStartDayOfLastYear) {
						sKey = "LastYear";
					} else {
						sKey = "YearsAgo";
					}

					return {
						key: sKey,
						text: this._oChangedOnGroups[sKey]
					};

				}

			};

			/**
			 * @ControllerHook [Hook to update/initialize master data]
			 * This hook is called in the onInit method of the Master controller
			 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookOnMasterInit
			 * @param {sap.ca.scfld.md.controller.ScfldMasterController} MasterController
			 * @return {void}  ...
			 */
			if (this.extHookOnMasterInit) { // check whether any extension has implemented the hook...
				this.extHookOnMasterInit(this); // ...and call it
			}


			// Oliver
			this.hashChanger = HashChanger.getInstance();
			this.hashChanger.init();
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter and hides the pull to refresh control, if
		 * necessary.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Description", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		// This method is called whenever a refresh is triggered.
		_listRefresh: function() {
			// If metadata load has run into an error, this method can only be triggered by the user pressing the
			// refresh or search button in the search field.
			// In this case we take this action as a hint to retry to load the metadata.
			if (this._bHasMetadataError) {
				this._oModel.refreshMetadata();
			} else { // metadata are ok. Thus, we refresh the list. Note that this (normally) leads to a call of onUpdateFinished.
				this._oList.getBinding("items").refresh();
			}
		},

		onAddPress: function() {
			// if (window["wechatLauncherEnabled"]) {
			// 	this.zwechatLoadApp();
			// 	return;
			// }
			// standalone workaround
			sap.m.URLHelper.redirect('/sap/wechat/create_incident');
			return;
			
			if (Util.getInAppCreation()) {
				this.getRouter().navTo("toCreate", false);
			} else {
				this.navigateToExtCreation();
			}
		},

		zwechatLoadApp: function() {
			this.hashChanger.setHash("itsmcreate", true);
		},

		onMessageCreateExtern: function(sChannelId, sEventId, oData) {

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				var semanticObject = "Action";
				var action = "SMMyIncidents";
				/* eslint-disable sap-cross-application-navigation */
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: semanticObject,
						action: action

					},
					params: {
						"Guid": oData.objectGuid
					}

				});
				/* eslint-enable sap-cross-application-navigation */

			} else {
				jQuery.sap.log.info("Cannot Navigate - Application Running Standalone" , null , "zwx.sm.itsm.myincidents");
			}

		},

		onMessageCancelExtern: function() {

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				/* eslint-disable sap-cross-application-navigation */
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "Action",
						action: "SMMyIncidents"
					}

				});
				/* eslint-enable sap-cross-application-navigation */
			} else {
				jQuery.sap.log.info("Cannot Navigate - Application Running Standalone");
			}

		},

		navigateToExtCreation: function() {
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {

				sap.ui.getCore().getEventBus().subscribeOnce("sm.itsm.createincident", "afterCreate", this.onMessageCreateExtern, this);
				sap.ui.getCore().getEventBus().subscribeOnce("sm.itsm.createincident", "afterCancel", this.onMessageCancelExtern, this);

				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				/* eslint-disable sap-cross-application-navigation */
				oCrossAppNavigator.toExternal({
					target: {
						semanticObject: "Action",
						action: "SMCreateIncident"
					}

				});
				/* eslint-enable sap-cross-application-navigation */
			} else {
				jQuery.sap.log.info("Cannot Navigate - Application Running Standalone ? ");
			}
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function(oEvent) {
			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		// /**
		//  * Event handler for navigating back.
		//  * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		//  * If not, it will navigate to the shell home
		//  * @public
		//  */
		// onNavBack: function() {
		// 	var sPreviousHash = History.getInstance().getPreviousHash(),
		// 		oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

		// 	if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
		// 		history.go(-1);
		// 	} else {
		// 		/* eslint-disable sap-cross-application-navigation */
		// 		oCrossAppNavigator.toExternal({
		// 			target: {
		// 				shellHash: "#Shell-home"
		// 			}
		// 		});
		// 		/* eslint-enable sap-cross-application-navigation */
		// 	}
		// },

		handleGroupChange: function(evt) {
			var sortPath;
			var bDescending;
			this.selectedGroup = evt.getParameter("selectedItem").getProperty("key");
			if (this.oContainer) {
				this.oContainer.setItemValue("selectedGroup", evt);
				this.oContainer.save()
					.fail(function() {
						jQuery.sap.log.error("Saving personalization data failed.");
					})
					.done(function() {
						// Before the next save is triggered the last one has to be finished.
						// Could be done by disabling the save button during the save.
					});
			}
			if (this.sCurrentDate === undefined) {
				this.sCurrentDate = Util.setDateToMidnight(new Date());
				this.sYesterday = Util.getDateAtMidnight(this.sCurrentDate, 1).getTime();
				this.sStartOfThisWeek = Util.getMonday(this.sCurrentDate).getTime();
				this.sStartOfLastWeek = Util.getMondayLastWeek(this.sCurrentDate).getTime();
				this.sStartDayOfCurrentMonth = Util.getFirstDayOfCurrentMonth(this.sCurrentDate).getTime();
				this.sStartDayOfLastMonth = Util.getFirstDayOfPrevMonth(this.sCurrentDate).getTime();
				this.sStartDayOf2MonthsAgo = Util.getFirstDayOf2MonthsAgo(this.sCurrentDate).getTime();
				this.sStartDayOfCurrentYear = Util.getFirstDayOfCurrentYear(this.sCurrentDate).getTime();
				this.sStartDayOfLastYear = Util.getFirstDayOfPrevYear(this.sCurrentDate).getTime();
				this.sCurrentDate = this.sCurrentDate.getTime();
			}
			if (this.selectedGroup) {
				sortPath = this.selectedGroup;
				if (this.selectedGroup === "ChangedAtDate") {
					bDescending = true;
				} else {
					bDescending = false;
				}

				this._oTableOperations.setGrouping(new sap.ui.model.Sorter(sortPath, bDescending,
					this._oGroupFunctions[sortPath].bind(this)));
			} else {
				this._oTableOperations.removeGrouping();
			}

			this._oTableOperations.applyTableOperations();

		},

		handleFilterChange: function(evt) {

			var that = this;
			this.selectedFilter = evt.getParameter("selectedItem").getProperty("key");
			var aItems = evt.getSource().getItems();
			this._oListFilterState.aFilter = [];
			//var oView = this.getView();

			// // add filter for search
			// var searchString = this.getView().byId("searchField").getValue();
			// if (searchString && searchString.length > 0) {
			// 	var filter = new sap.ui.model.Filter("Description",
			// 		sap.ui.model.FilterOperator.Contains, searchString);
			// 	this._oListFilterState.aSearch.push(filter);
			// }

			var filterMap = {
				"New": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "NEW"),
				"InProcess": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "IN_PROC"),
				"CustomerAction": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "CUSTACTION"),
				"SolutionProvided": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "PROP_SOL"),
				"Withdrawn": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "WITHDRAWN"),
				"Confirmed": new sap.ui.model.Filter("Concatstatuser",
					sap.ui.model.FilterOperator.EQ, "CONFIRMED")
			};
			if (filterMap[this.selectedFilter]) {
				this._oListFilterState.aFilter.push(filterMap[this.selectedFilter]);

				//filters.push(filterMap[this.selectedFilter]);
			} else {
				this._oListFilterState.aFilter = [];
			}
			this._applyFilterSearch();

			// // update list binding
			// var list = oView.byId("list");
			// var binding = list.getBinding("items");
			// binding.filter(filters);

			// update info toolbar

			if (filterMap[this.selectedFilter]) {
				jQuery.each(aItems, function(index) {
					if (aItems[index].getProperty("key") === that.selectedFilter) {
						that._updateFilterBar((aItems[index].getProperty("text")));
					}
				});

			} else {
				that._updateFilterBar();
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		// Reads the corresponding category name based on the list-item context
		_getStatusName: function(oListItemContext, sCategoryType) {
			var sKey = oListItemContext.getProperty("Concatstatuser");
			var sActionRequired = oListItemContext.getProperty("ActionRequired");

			if (sActionRequired)

			{
				return {
					key: "ActionRequired",
					text: this.bundle.getText("FILTER_ACTION_REQUIRED")
				};
			} else {
				return {
					key: sKey,
					text: sKey
				};
			}

		},

		_createViewModel: function() {
			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getResourceBundle().getText("LIST_PAGE_TITLE_WITH_NUMBER", [0]),
				noDataText: this.getResourceBundle().getText("MASTER_NO_DATA_TEXT"),
				sortBy: "Description",
				groupBy: "None"
			});
		},

		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function() {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function(mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}
					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("Guid");
					this.getRouter().navTo("object", {
						objectId: sObjectId
					}, true);
				}.bind(this),
				function(mParams) {
					if (mParams.error) {
						return;
					}
					this.getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function(oItem) {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Guid")
			}, bReplace);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showEmptyPage: function() {

				this.getRouter().getTargets().display("detailNoObjectsAvailable");

		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("LIST_PAGE_TITLE_WITH_NUMBER", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function() {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method to apply both group and sort state together on the list binding
		 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
		 * @private
		 */
		_applyGroupSort: function(aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function(sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", sFilterBarText);
		},

		onWithdrawExecuted: function(sPath) {

			var that = this;

			if (!sap.ui.Device.system.phone) {
				var oSelectedItem = this._oList.getSelectedItem(),
					sCurrentPath = oSelectedItem && oSelectedItem.getBindingContext().getPath();
				// If sPath is given (that is, swipe case) the currently selected Incident should stay selected if it is not the removed one
				this._sPreselectedContextPath = sPath && sPath !== sCurrentPath && sCurrentPath;
				// Now, this._sPreselectedContextPath is truthy exactly when the current selection should not be changed.
				// Otherwise, the following loop is used to find the currently selected Incident in the list of all items and identify the preferred neighbour.
				var aItems = this._oList.getItems(),
					i;

				aItems = Util.getItemsWithoutGroupHeader(aItems);

				for (i = 0; i < aItems.length && !this._sPreselectedContextPath; i++) {
					if (aItems[i].getBindingContext().getPath() === sCurrentPath) {
						var oNextItem = aItems[i === aItems.length - 1 ? (i - 1) : (i + 1)];
						this._sPreselectedContextPath = oNextItem && oNextItem.getBindingContext().getPath();
					}
				}
			}
			// The next line makes sure that the focus is set correctly in order to avoid a movement of the selected item within the list.

			this._oList.attachEventOnce("updateFinished", function() {
				// Note: Do not use oEvent here, because UI5 might have reinitialized this instance already (instance pooling for performance reasons)
				that.onWithdrawFinished();
			});

			this._oList.attachEventOnce("updateFinished", this._oList.focus, this._oList);
			this._bNavigationByManualHashChange = false;
			this._listRefresh();
		},

		onSaveExecuted: function() {
			var that = this;

			this._oList.attachEventOnce("updateFinished", function() {
				// Note: Do not use oEvent here, because UI5 might have reinitialized this instance already (instance pooling for performance reasons)
				that.onSaveFinished();
			});
			this._oList.attachEventOnce("updateFinished", this._oList.focus, this._oList);
			this._bNavigationByManualHashChange = false;
			this._listRefresh();
		},

		onConfirmExecuted: function(sPath) {

			var that = this;

			if (!sap.ui.Device.system.phone) {
				var oSelectedItem = this._oList.getSelectedItem(),
					sCurrentPath = oSelectedItem && oSelectedItem.getBindingContext().getPath();
				// If sPath is given (that is, swipe case) the currently selected PO should stay selected if it is not the removed one
				this._sPreselectedContextPath = sPath && sPath !== sCurrentPath && sCurrentPath;
				// Now, this._sPreselectedContextPath is truthy exactly when the current selection should not be changed.
				// Otherwise, the following loop is used to find the currently selected Incident in the list of all items and identify the preferred neighbour.
				var aItems = this._oList.getItems(),
					i;
				aItems = Util.getItemsWithoutGroupHeader(aItems);
				for (i = 0; i < aItems.length && !this._sPreselectedContextPath; i++) {
					if (aItems[i].getBindingContext().getPath() === sCurrentPath) {
						var oNextItem = aItems[i === aItems.length - 1 ? (i - 1) : (i + 1)];
						this._sPreselectedContextPath = oNextItem && oNextItem.getBindingContext().getPath();
					}
				}
			}
			// The next line makes sure that the focus is set correctly in order to avoid a movement of the selected item within the list.

			this._oList.attachEventOnce("updateFinished", function() {
				// Note: Do not use oEvent here, because UI5 might have reinitialized this instance already (instance pooling for performance reasons)
				that.onConfirmFinished();
			});

			this._oList.attachEventOnce("updateFinished", this._oList.focus, this._oList);
			this._bNavigationByManualHashChange = false;
			this._listRefresh();
		},

		// Event handler for the master list. It is attached declaratively.
		onWithdrawFinished: function() {

			this._setItem();

			this._dialog = Util.getBusyDialog("busyPopoverWithdraw");
			this._dialog.close();
			sap.m.MessageToast.show(this.bundle.getText("WITHDRAW_SUCCESS"));
		},

		// Event handler for the master list. It is attached declaratively.
		onConfirmFinished: function() {

			this._setItem();

			this._dialog = Util.getBusyDialog("busyPopoverConfirm");
			this._dialog.close();
			sap.m.MessageToast.show(this.bundle.getText("CONFIRM_SUCCESS"));
		},

		// Event handler for the master list. It is attached declaratively.
		onSaveFinished: function() {
			var createdObjectID = Util.getCreatedObejctId();
			this._setNewItem();

			this._dialog = Util.getBusyDialog("busyPopoverSave");
			this._dialog.close();
			sap.m.MessageToast.show(this.bundle.getText("INCIDENT_CREATION_SUCCESS", [createdObjectID]));
		},

		_setNewItem: function() {

			// In this method we serach for the newly created Incident in the List
			// Note the Object Guid is stored in Util.JS

			var aItems = this._oList.getItems();
			aItems = Util.getItemsWithoutGroupHeader(aItems);
			var oItemToSelect = aItems[0]; // Fallback: Display the first Incident in the list
			var createdObjectID = Util.getCreatedObejctId();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].data("ObjectId") === createdObjectID) {
					oItemToSelect = aItems[i];
					break;
				}
			}

			if (oItemToSelect) {
				// Now we know which item to select
				this._oList.setSelectedItem(oItemToSelect); // Mark it as selected in the master list
				this._showDetail(oItemToSelect);
			} else {
				if (createdObjectID) {
					sap.m.MessageBox.alert(this.bundle.getText("INCIDENT_CREATION_SUCCESS_NO_BP", createdObjectID));
				}
			}

		},

		// This method ensures that an incident is selected. This is either the incident specified by attribute _sPreselectedContextPath
		// or the first incident in the master list.
		_setItem: function(bNoFallback) {
			var aItems = this._oList.getItems();
			aItems = Util.getItemsWithoutGroupHeader(aItems);

			if (aItems.length === 0) {
				// If there are no Incidents show the empty page, except when search is responsible for the empty list
				// and we do not return from the summary detail view. In the latter case stay on the last displayed detail view.
				var sDetailViewName = this.oView.getParent().getParent().getCurrentDetailPage().getViewName();
				if (this._sCurrentSearchTerm === "" || !this._bIsMultiselect && sDetailViewName ===
					"zwx.sm.itsm.myincidents.view.S3") {
					this._showEmptyPage(this.bundle.getText("EMPTY_PAGE_NO_INCIDENTS"), true);
				}
			} else { // If there are Incidentss in the list, display one
				var oItemToSelect = bNoFallback ? null : aItems[0]; // Fallback: Display the first Incident in the list
				// But if another Incident is required: Try to select this one
				if (this._sPreselectedContextPath) {
					for (var i = 0; i < aItems.length; i++) {
						if (aItems[i].getBindingContext().getPath() === this._sPreselectedContextPath) {
							oItemToSelect = aItems[i];
							break;
						}
					}
				}
				// If the app was started via a saved tile for a Incident GUID which is no longer valid,
				// an empty page is already displayed. Therefore nothing has to be done in this method.
				if (this._bFirstCall && this._sPreselectedContextPath && oItemToSelect.getBindingContext().getPath() !== this._sPreselectedContextPath) {
					this._bFirstCall = false;
					return;
				}
				if (oItemToSelect === null) {
					return;
				}

				// Now we know which item to select
				this._oList.setSelectedItem(oItemToSelect); // Mark it as selected in the master list
				// When the App is started the scroll position should be set to the item to be selected.
				// Note that this is only relevant when the App has been started with a route specifying the
				// Incident to be displayed, because otherwise the first Incident in the list will be the selected one anyway.
				if (this._bFirstCall || this._bNavigationByManualHashChange) {
					this._bFirstCall = false;
					var oDomRef = oItemToSelect.getDomRef();
					if (oDomRef) {
						oDomRef.scrollIntoView();
					}
				}
				this._bNavigationByManualHashChange = true;
				this._showDetail(oItemToSelect); // and display the item on the detail page
			}
		}

	});

});
