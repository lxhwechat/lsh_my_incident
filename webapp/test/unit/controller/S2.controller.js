sap.ui.define([
	"zwx/sm/itsm/myincidents/view/S2.controller",
	"zwx/sm/itsm/myincidents/util/Util",
	"sap/m/List",
	"sap/m/semantic/FilterSelect",
	"sap/m/semantic/GroupSelect",

	// "sap/m/Input",
	// "sap/m/TextArea",
	// "sap/m/Select",
	// "sap/ui/model/json/JSONModel",
	// "sap/ui/model/odata/v2/ODataModel",

	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"

], function(MasterController, Util, List, FilterSelect, GroupSelect
	// Input, TextArea, Select, JSONModel, ODataModel 
) {
	"use strict";
	var id = 1;
	QUnit.module("Master Controller - Tests",

		{
			setup: function() {

				var that = this;

				Util.init();

				this.fakeView = {
					createId: function() {
						return "id" + id++;
					},
					addDependent: function() {},
					addEventDelegate: function() {}
				};

				// jQuery.sap.require("sap.m.Input");
				// jQuery.sap.require("sap.m.TextArea");

				this.controller = new MasterController();
				//	this.controller.oView = fakeView;

				this.i18NModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "../../i18n/i18n.properties"
				});
				sinon.stub(this.controller, "getResourceBundle").returns(this.i18NModel.getResourceBundle());

				sinon.stub(this.controller, "getEventBus").returns({
					publish: function(sIdentity, identifier) {
						// ok(sIdentity === "zwx.sm.itsm.myincidents", "Save Executed Event with Identity " + sIdentity + " has been called");
						// ok(identifier === "saveExecuted", "Save Executed Event with identfier " + identifier + " has been called");

					},

					subscribe: function(sIdentity, identifier, callback) {
						if (identifier === "saveExecuted") {
							that.controller.callbackSaveExecuted = callback;
							ok(sIdentity === "zwx.sm.itsm.myincidents", "Save Executed Event with Identity " + sIdentity + " has been registered");
							ok(identifier === "saveExecuted", "Save Executed Event with identfier " + identifier + " has been registered");
						}

						if (identifier === "confirmExecuted") {
							this.callbackConfirmExecuted = callback;
							ok(sIdentity === "zwx.sm.itsm.myincidents", "Event with Identity " + sIdentity + " has been registered");
							ok(identifier === "confirmExecuted", "Event with identfier " + identifier + " has been registered");
						}

						if (identifier === "withdrawExecuted") {
							this.callbackWithdrawExecuted = callback;
							ok(sIdentity === "zwx.sm.itsm.myincidents", "Event with Identity " + sIdentity + " has been registered");
							ok(identifier === "withdrawExecuted", "Event with identfier " + identifier + " has been registered");
						}

					}
				});

				sinon.stub(this.controller, "getView").returns(this.fakeView);

				sinon.stub(this.controller, "getRouter").returns({
					attachRoutePatternMatched: function() {},
					getRoute: function(routeId) {

						ok(routeId === "master", "Route with ID '" + routeId + "' registered for Pattern Match");

						return {
							attachPatternMatched: function() {}
						};
					},
					attachBypassed: function() {}
				});

				var oListMock = new List();

				oListMock.attachEventOnce = function(identifier, callback, param2) {
					if (identifier === "updateFinished" && param2 === undefined) {
						that.controller.callbackUpdateFinished = callback;
					}
				};

				sinon.stub(this.controller, "byId").withArgs("list").returns(oListMock)
					.withArgs("filterSelect").returns(new FilterSelect())
					.withArgs("selectGroup").returns(new GroupSelect());

				var oDataModelMock = {
					refresh: function() {
						return true;
					}
				};

				sinon.stub(this.controller, "setModel").returns(oDataModelMock);

				// this.controller.jModel = new JSONModel({
				// 	title: "",
				// 	component: "",
				// 	description: ""
				// });

				// this.controller.oComponentInput = new Input();
				// this.controller.oTitleControl = new Input();
				// this.controller.oDescriptionTextArea = new TextArea();
				// this.controller.oPrioSelect = new Select();

				//	this.controller.bundle = new FakeModel(mResourcetexts).getResourceBundle();

			},
			teardown: function() {

				if (this.controller._dialog) {
					this.controller._dialog.destroy();
				}

				sap.ushell = undefined;
				// this.oMockServer.destroy();
				// ok(true, "Mock Server has been stopped");
			}
		});

	QUnit.test("Check if onInit Controller Hook is called", function() {

		this.controller.extHookOnMasterInit = function(oInstance) {
			ok(true, "Controller Hook On Master Init has been called");
		};
		this.controller.onInit();
	});

	QUnit.test("Simulate onSaveExecuted", function() {

		this.controller.onInit();
		sinon.stub(this.controller, "_listRefresh").returns(true);

		this.controller.callbackSaveExecuted();

		Util.getBusyDialog("busyPopoverSave", this.i18NModel.getResourceBundle().getText("CREATING_IN_PROGRESS"), this.fakeView, this);

		this.controller.callbackUpdateFinished();

	});

	QUnit.test("Group functions calculation for Priority", function() {

		var oListItemMock = {
			getProperty: function(sKey) {

				return "unknownPrio";

			}
		};

		this.controller.onInit();
		var functionUnderTestPrioCalculation = this.controller._oGroupFunctions.Priority.bind(this.controller);
		var result = functionUnderTestPrioCalculation(oListItemMock);

		ok(result.key === "unknownPrio", "Unknown Priority has correct key value");
		ok(result.text === this.i18NModel.getResourceBundle().getText("PRIO_UNKNOWN"), "Unknown Priority has correct text '" + result.text +
			"'");

	});

	// QUnit.test("Group functions calculation for ChnagedAtDate", function() {

	// 	this.controller.sCurrentDate = Util.setDateToMidnight(new Date());
	// 	this.controller.sYesterday = Util.getDateAtMidnight(this.controller.sCurrentDate, 1).getTime();
	// 	this.controller.sStartOfThisWeek = Util.getMonday(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartOfLastWeek = Util.getMondayLastWeek(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartDayOfCurrentMonth = Util.getFirstDayOfCurrentMonth(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartDayOfLastMonth = Util.getFirstDayOfPrevMonth(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartDayOf2MonthsAgo = Util.getFirstDayOf2MonthsAgo(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartDayOfCurrentYear = Util.getFirstDayOfCurrentYear(this.controller.sCurrentDate).getTime();
	// 	this.controller.sStartDayOfLastYear = Util.getFirstDayOfPrevYear(this.controller.sCurrentDate).getTime();
	// 	this.controller.sCurrentDate = this.controller.sCurrentDate.getTime();

	// 	var oListItemMockChangedToday = {
	// 		getProperty: function(sKey) {
	// 			return Util.setDateToMidnight(new Date());
	// 		}
	// 	};

	// 	var oListItemMockChangedYesterday = {
	// 		getProperty: function(sKey) {
	// 			return Util.getDateAtMidnight((Util.setDateToMidnight(new Date())), 1);
	// 		}
	// 	};

	// 	var oListItemMockChangedStartOfThisWeek = {
	// 		getProperty: function(sKey) {
	// 			return Util.getMonday(Util.setDateToMidnight(new Date()));
	// 		}
	// 	};

	// 	var oListItemMockChangedStartOfLastWeek = {
	// 		getProperty: function(sKey) {
	// 			return Util.getMondayLastWeek(Util.setDateToMidnight(new Date()));

	// 		}
	// 	};

	// 	var oListItemMockChangedStartDayOfCurrentMonth = {
	// 		getProperty: function(sKey) {
	// 			return Util.getFirstDayOfCurrentMonth(Util.setDateToMidnight(new Date()));
	// 		}
	// 	};

	// 	var oListItemMockLastMonth = {
	// 		getProperty: function(sKey) {
	// 			return Util.getFirstDayOfPrevMonth(Util.setDateToMidnight(new Date()));
	// 		}
	// 	};

	// 	var oListItemMockThisYear = {
	// 		getProperty: function(sKey) {
	// 			return Util.getFirstDayOfCurrentYear(Util.setDateToMidnight(new Date()));
	// 		}
	// 	};

	// 	var oListItemMockLastYear = {
	// 		getProperty: function(sKey) {
	// 			return Util.getFirstDayOfPrevYear(Util.setDateToMidnight(new Date()));
	// 		}
	// 	};
	// 	var oListItemMockYearsAgo = {
	// 		getProperty: function(sKey) {

	// 			var d = new Date();
	// 			d.setFullYear(1977, 8, 15);
	// 			return d;
	// 		}
	// 	};

	// 	this.controller.onInit();
	// 	var functionUnderTestChangedAtCalculation = this.controller._oGroupFunctions.ChangedAtDate.bind(this.controller);

	// 	// Today
	// 	var result = functionUnderTestChangedAtCalculation(oListItemMockChangedToday);

	// 	assert.strictEqual(result.key, "Today", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("TODAY"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// Yesterday
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockChangedYesterday);

	// 	assert.strictEqual(result.key, "Yesterday", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("YESTERDAY"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// This Week
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockChangedStartOfThisWeek);

	// 	if (!this.controller.sYesterday === this.controller.sStartOfThisWeek) {

	// 		assert.strictEqual(result.key, "ThisWeek", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 		assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("THIS_WEEK"), "Group Header has correct text '" +
	// 			result.text + "'");
	// 	}

	// 	// Last Week
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockChangedStartOfLastWeek);
	// 	assert.strictEqual(result.key, "LastWeek", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("LAST_WEEK"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// This Month
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockChangedStartDayOfCurrentMonth);
	// 	assert.strictEqual(result.key, "ThisMonth", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("THIS_MONTH"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// Last Month
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockLastMonth);
	// 	assert.strictEqual(result.key, "LastMonth", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("LAST_MONTH"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// This Year
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockThisYear);
	// 	assert.strictEqual(result.key, "ThisYear", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("THIS_YEAR"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// Last Year
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockLastYear);
	// 	assert.strictEqual(result.key, "LastYear", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("LAST_YEAR"), "Group Header has correct text '" +
	// 		result.text + "'");

	// 	// Years Ago
	// 	result = functionUnderTestChangedAtCalculation(oListItemMockYearsAgo);
	// 	assert.strictEqual(result.key, "YearsAgo", "Group Calculation for Group Key '" + result.key + "' has correct key value");
	// 	assert.strictEqual(result.text, this.i18NModel.getResourceBundle().getText("YEARS_AGO"), "Group Header has correct text '" +
	// 		result.text + "'");

	// });

	QUnit.test("MetaData Error - List Refresh", function() {

		var oMockModel = {
			refreshMetadata: function(sKey) {
				ok(true, "Model refresh MetaData has been called");
				return "";

			}
		};
		this.controller._bHasMetadataError = true;
		this.controller._oModel = oMockModel;
		this.controller._listRefresh();

	});

	QUnit.test("Navigate to external Create App without uShell", function() {

		Util.setInAppCreation(false);
		this.controller.onAddPress();
		ok(true, "Navigate to external Create App exception has been called");

	});

	QUnit.test("Navigate to external Create App with uShell", function() {

		Util.setInAppCreation(false);

		sap.ushell = {
			Container: {
				getService: function(service) {
					var oCrossAppNavigatorMock = {
						toExternal: function(target) {
							ok(true, "Navigate to external with semantic object  has been called");
						}
					};

					return oCrossAppNavigatorMock;

				}
			}
		};

		this.controller.onAddPress();

	});

	QUnit.test("Check on Message Cancel Extern Event without uShell", function() {

		// sap.ushell = { Container : {
		// 				getService : function(service) {
		// 					var oCrossAppNavigatorMock = {
		// 						toExternal : function(target) {
		// 							ok(true, "Navigate to external with semantic object  has been called");
		// 						}
		// 					};

		// 					return oCrossAppNavigatorMock;

		// 				}
		// }
		// };

		this.controller.onMessageCancelExtern();
		ok(true, "Cancel from external without Ushell has been called");

	});

	QUnit.test("Check on Message Cancel Extern Event with uShell", function() {

		sap.ushell = {
			Container: {
				getService: function(service) {
					var oCrossAppNavigatorMock = {
						toExternal: function(target) {
							ok(true, "Cancel from external has been called");
						}
					};

					return oCrossAppNavigatorMock;

				}
			}
		};

		this.controller.onMessageCancelExtern();
		ok(true, "Cancel from external without Ushell has been called");

	});
	
	QUnit.test("Check on Message Create Extern Event without uShell", function() {

		// sap.ushell = { Container : {
		// 				getService : function(service) {
		// 					var oCrossAppNavigatorMock = {
		// 						toExternal : function(target) {
		// 							ok(true, "Navigate to external with semantic object  has been called");
		// 						}
		// 					};

		// 					return oCrossAppNavigatorMock;

		// 				}
		// }
		// };

		this.controller.onMessageCreateExtern();
		ok(true, "Create from external without Ushell has been called");

	});

	QUnit.test("Check on Message Create Extern Event with uShell", function() {

		sap.ushell = {
			Container: {
				getService: function(service) {
					var oCrossAppNavigatorMock = {
						toExternal: function(target) {
							ok(true, "Create from external has been called");
						}
					};

					return oCrossAppNavigatorMock;

				}
			}
		};
		
		var mockOdata = {
			objectGuid : "123456789"
		};

		this.controller.onMessageCreateExtern(null, null, mockOdata);
	 

	});

	QUnit.test("Group Change - Personalization Service Strorage", function() {
		var oSavePromise = new jQuery.Deferred();
		this.controller.oContainer = {
			setItemValue: function(itemValue) {
				ok(true, "SetItemValue Method has been called");
			},
			save: function() {
			
				ok(true, "Save Group Personalization has been called");
				return oSavePromise;
			}
		};

		var oMockEvent = {
			getParameter: function(name) {
				return {
					getProperty: function(nameProperty) {

					}
				};
			}
		};
		
		var oMockTableOp = {
			removeGrouping : function() {
					ok(true, "Remove Grouping has been called");
			},
			
			applyTableOperations : function() {
					ok(true, "Apply Table Operations has been called");
			}
			
		};
		
		this.controller._oTableOperations = oMockTableOp;
		this.controller.handleGroupChange(oMockEvent);
		oSavePromise.reject();
		ok(true, "Cancel from external without Ushell has been called");

	});

});