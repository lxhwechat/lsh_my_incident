sap.ui.define([
	"zwx/sm/itsm/myincidents/util/TableOperations",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"

], function(TableOperations) {
	"use strict";

	QUnit.module("Util Tests",

		{
			setup: function() {

				this.i18NModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "../../i18n/i18n.properties"
				});

			},

			teardown: function() {

			}

		}

	);

	// function createListStub(bCreateListItem, sBindingPath) {
	// 	var fnGetParameter = function() {
	// 			return true;
	// 		},
	// 		oDataStub = {
	// 			getParameter: fnGetParameter
	// 		},
	// 		fnAttachEventOnce = function(sEventName, fnCallback) {
	// 			fnCallback(oDataStub);
	// 		},
	// 		fnGetBinding = this.stub().returns({
	// 			attachEventOnce: fnAttachEventOnce
	// 		}),
	// 		fnAttachEvent = function(sEventName, fnCallback, oContext) {
	// 			fnCallback.apply(oContext);
	// 		},
	// 		oListItemStub = {
	// 			getBindingContext: this.stub().returns({
	// 				getPath: this.stub().returns(sBindingPath)
	// 			})
	// 		},
	// 		aListItems = [];

	// 	if (bCreateListItem) {
	// 		aListItems.push(oListItemStub);
	// 	}

	// 	return {
	// 		attachEvent: fnAttachEvent,
	// 		attachEventOnce: fnAttachEventOnce,
	// 		getBinding: fnGetBinding,
	// 		getItems: this.stub().returns(aListItems)
	// 	};
	// }

	// QUnit.test("applyTableOperaions - Search & Filter changed", function() {

	// 	function createStubbedListItem(sBindingPath) {
	// 		return {
	// 			getBindingContext: this.stub().returns({
	// 				getPath: this.stub().returns(sBindingPath)
	// 			})
	// 		};
	// 	}
	// 	// Arrange

	// 	var oDummyFilter = new sap.ui.model.Filter({
	// 		path: "...",
	// 		operator: "...",
	// 		value1: "...",
	// 		value2: "..."
	// 	});

	// 	var oListMock = createListStub.call(this, "yet another list binding");
		
	// 	this._oTableOperations = new TableOperations(oListMock, ["Description", "ObjectId"]);
	// 	// this._oTableOperations.aSearchFilter.push(oDummyFilter);
	// 	// this._oTableOperations.aActiveFilter.push(oDummyFilter);
	// 	this._oTableOperations.bSearchChanged = true;
	 



	// 	this._oTableOperations.applyTableOperations();
	// 	equal(this._oTableOperations.aFilterList.length, 1);

	// });

});