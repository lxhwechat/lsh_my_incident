sap.ui.define([
	"zwx/sm/itsm/myincidents/util/Util",
	"sap/ui/Device",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit",

], function(Util, Device) {
	"use strict";

	QUnit.module("Util Tests",

		{
			setup: function() {

				this.i18NModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "../../i18n/i18n.properties"
				});

			},

			teardown: function() {
				sap.ushell = undefined;
			}

		}

	);

	QUnit.test("Check Created Object Id set and get", function() {

		// Instantiate the object to be tested
		var objectToTest = Util;
		var value = "800000123";

		objectToTest.setCreatedObjectId(value);
		equal(objectToTest.getCreatedObejctId(), value);

	});

	// QUnit.test("oData Error Handling", function() {

	// 	// Instantiate the object to be tested
	// 	var objectToTest = Util;

	// 	var oMockErrorResponse = {
	// 		response: {
	// 			body: {
	// 				error: {
	// 					innererror: {
	// 						errordetails: [{
	// 							code: "CRM_ORDER/013",
	// 							message: "Object is locked"
	// 						}]
	// 					}
	// 				}
	// 			}
	// 		}
	// 	};

	// 	var oMockErrorResponseWithoutBody = {

	// 		error: {
	// 			code: "CRM_ORDER/000",
	// 			message: {
	// 				value: "Object is locked"

	// 			}
	// 		}

	// 	};
	// 	objectToTest.init();
	// 	//	objectToTest.showErrorMessageBox = sinon.spy();
	// 	objectToTest.oDataServiceErrorHandling(null, this.i18NModel.getResourceBundle(), oMockErrorResponse, "Test");
	// 	var oMessageBox = sap.ui.getCore().byId("mBoxWithDetails");
	// 	ok(oMessageBox, "MessageBox Dialog should be created");
	// 	oMessageBox.destroy();

	// 	objectToTest.oDataServiceErrorHandling(null, this.i18NModel.getResourceBundle(), oMockErrorResponseWithoutBody, "Test");
	// 	var oMessageBoxWithDetails = sap.ui.getCore().byId("mBoxWithoutDetails");
	// 	ok(oMessageBoxWithDetails, "MessageBox Dialog should be created");
	// 	oMessageBoxWithDetails.destroy();

	// });

	QUnit.test("Check Creation Mode Promise Reject", function() {

		// Instantiate the object to be tested
		var objectToTest = Util;
		objectToTest.init();

		var oNavCheckPromise = new jQuery.Deferred();

		sap.ushell = {
			Container: {
				getService: function(service) {
					var oServiceMock = {
						isNavigationSupported: function(target) {
							ok(true, "Navigation Supported Check has been called");
							return oNavCheckPromise;
						}
					};

					return oServiceMock;

				}
			}
		};

		objectToTest.checkCreationMode();
		oNavCheckPromise.reject();
		equal(objectToTest.inAppCreation, true);
		

		
	});
	
	QUnit.test("Check Creation Mode Promise Resolve", function() {

		// Instantiate the object to be tested
		var objectToTest = Util;
		objectToTest.init();

		var oNavCheckPromise = new jQuery.Deferred();

		sap.ushell = {
			Container: {
				getService: function(service) {
					var oServiceMock = {
						isNavigationSupported: function(target) {
							ok(true, "Navigation Supported Check has been called");
							return oNavCheckPromise;
						}
					};

					return oServiceMock;

				}
			}
		};
		
		var oMockResponse = [
			 {
			 	supported : true
			 }
			];

		objectToTest.checkCreationMode();
		oNavCheckPromise.resolve(oMockResponse);
		equal(objectToTest.inAppCreation, false);
		

		
	});

	// QUnit.test("getContentDensityClass", function() {

	// 	// Instantiate the object to be tested
	// 	var objectToTest = Util;
	// 	var result = objectToTest.getContentDensityClass();
	// 	equal(result, "sapUiSizeCompact");

	// 	objectToTest._sContentDensityClass = undefined;
	// 	var result2 = objectToTest.getContentDensityClass();
	// 	equal(result2, "sapUiSizeCompact");

	// 	Device.support.touch = true;
	// 	objectToTest._sContentDensityClass = undefined;
	// 	var result3 = objectToTest.getContentDensityClass();
	// 	equal(result3, "sapUiSizeCozy");

	// 	objectToTest._sContentDensityClass = undefined;
	// 	jQuery(document.body).addClass("sapUiSizeCozy");
	// 	var result4 = objectToTest.getContentDensityClass();
	// 	equal(result4, "");
	// });
	
	QUnit.test("set/get Error", function() {

		// Instantiate the object to be tested
		var objectToTest = Util;
		objectToTest.setError("This is a test error" , "This is an test error title");
		var result = objectToTest.getError();
		equal(result.text, "This is a test error");
		equal(result.title, "This is an test error title");
	
	});
});