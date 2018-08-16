sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	function getFrameUrl(sHashParam, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("zwx/sm/itsm/myincidents/app", ".html");
		var sHash = sHashParam || "";
		var sUrlParametersNew = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#MyIncidents-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#MyIncidents-display";
		}

		return sUrl + sUrlParametersNew + sHash;
	}

	return Opa5.extend("zwx.sm.itsm.myincidents.test.opa5.pages.Common", {

		iStartTheApp: function(oOptionsParam) {
			var oOptions = oOptionsParam || {};
			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, "serverDelay=50"));
		},

		iStartTheAppWithDelay: function(sHash, iDelay) {
			this.iStartMyAppInAFrame(getFrameUrl(sHash, "serverDelay=" + iDelay));
		},

		iLookAtTheScreen: function() {
			return this;
		},
		
	
			
		 

		iStartMyAppOnADesktopToTestErrorHandler: function(sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		},

		createAWaitForAnEntitySet: function(oOptions) {
			return {
				success: function() {
					var bMockServerAvailable = false,
						aEntitySet;

					this.getMockServer().then(function(oMockServer) {
						aEntitySet = oMockServer.getEntitySetData(oOptions.entitySet);
						bMockServerAvailable = true;
					});

					return this.waitFor({
						check: function() {
							return bMockServerAvailable;
						},
						success: function() {
							oOptions.success.call(this, aEntitySet);
						}
					});
				}
			};
		},

		getMockServer: function() {
			return new Promise(function(success) {
				Opa5.getWindow().sap.ui.require(["zwx/sm/itsm/myincidents/localService/mockserver"], function(mockserver) {
					success(mockserver.getMockServer());
				});
			});
		},

		theUnitNumbersShouldHaveTwoDecimals: function(sControlType, sViewName, sSuccessMsg, sErrMsg) {
			var rTwoDecimalPlaces = /^-?\d+\.\d{2}$/;

			return this.waitFor({
				controlType: sControlType,
				viewName: sViewName,
				success: function(aNumberControls) {
					Opa5.assert.ok(aNumberControls.every(function(oNumberControl) {
							return rTwoDecimalPlaces.test(oNumberControl.getNumber());
						}),
						sSuccessMsg);
				},
				errorMessage: sErrMsg
			});
		}
		


	 
		

	});

});