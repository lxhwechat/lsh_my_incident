sap.ui.define([
	"zwx/sm/itsm/myincidents/util/Formatter",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function(Formatter) {
	"use strict";

	QUnit.module("Formatter Tests");

	QUnit.test("Check if date is correctly shortened", function() {

		// Instantiate the object to be tested
		var objectToTest = Formatter;
		// A placeholder for the actual result
		var actualResult;
		// Input parameters for the tested function    
		var date = new Date("August 15, 1977 11:13:00");
		// Call the tested function
		if (typeof objectToTest === "function") {
			actualResult = objectToTest.prototype.dateShort(date);
		} else {
			actualResult = objectToTest.dateShort(date);
		}

		// Assertion calls
		equal(actualResult, "15.08.1977");
	});

	QUnit.test("Check if date and time gets correctly returned", function() {
		var actualResult;
		var objectToTest = Formatter;
		var date = new Date("August 15, 1977 11:13:00");
		actualResult = objectToTest.dateTime(date);

		// Assertion calls
		equal(actualResult, "15.08.1977 11:13");

	});

	QUnit.test("PicBuffer", function() {

		var objectToTest = Formatter;
		objectToTest.picBuffer = [];

		ok(Formatter.getPicture("") === "", "No picture testing");

		objectToTest.isJamSupported = false;
		ok(Formatter.getPicture("id0") === "", "Returns no picture id Jam Model is not supported");

		objectToTest.isJamSupported = true;
		var oPicBufferMockEntry = {
			id: "id1",
			url: "bufferedURL"

		};

		objectToTest.picBuffer.push(oPicBufferMockEntry);

		ok(Formatter.getPicture("id1") === "bufferedURL", "Returns buffered Pic URL if loaded before");

		//simulate jamModel Read
		var MockJamModel = {
			read: function(serviceUrl, param1, param2, param3, succcessFunction, errorFunction) {
				ok(true, "Read of Jam Model has been called");
				var results = {
					results: [{
						ThumbnailImage: {
							__metadata: {
								media_src: "fooURL"
							}
						}
					}]
				};

				succcessFunction(results);

			}
		};

		objectToTest.jamModel = MockJamModel;

		ok(Formatter.getPicture("id2") === "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/fooURL", "Returns URL read from Jam Model");
		ok(Formatter.picBuffer[1].id === "id2", "Newly loaded ID correctly buffered");
		ok(Formatter.picBuffer[1].url === "/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData/fooURL", "Newly loaded URL correctly buffered");
	});

	QUnit.test("FileSize Atrributes conversion", function() {

		ok(Formatter.formatFileSizeAttribute("") === "", "No Files Size if empty");
		ok(Formatter.formatFileSizeAttribute("917") === "917 Bytes", "Show Bytes correctly");
		ok(Formatter.formatFileSizeAttribute("20917") === "20.9 KB",
			"Show KiloBytes correctly");
		ok(Formatter.formatFileSizeAttribute("2220917") === "2.2 MB",
			"Show Megabytes correctly");
		ok(Formatter.formatFileSizeAttribute("202220917") === "202.2 MB",
			"Show Megabytes correctly");
		ok(Formatter.formatFileSizeAttribute("2202220917") === "2.2 GB",
			"Show Gigabytes correctly");
		ok(Formatter.formatFileSizeAttribute(undefined) === undefined,
			"undefined value gets not converted");
	});

});