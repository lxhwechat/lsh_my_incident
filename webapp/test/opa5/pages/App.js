sap.ui.define([
	"sap/ui/test/Opa5",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Common",
	"sap/ui/test/matchers/PropertyStrictEquals",
		"sap/ui/test/actions/Press"
], function(Opa5, Common, PropertyStrictEquals, Press) {
	"use strict";

	var sViewName = "App",
		sAppControl = "idAppControl";


	Opa5.createPageObjects({
		onTheAppPage: {
			baseClass: Common,

			actions: {

				iWaitUntilTheBusyIndicatorIsGone: function() {
					return this.waitFor({
						id: sAppControl,
						viewName: sViewName,
						// inline-matcher directly as function
						matchers: function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getParent().getBusy() === false;
						},
						errorMessage: "The app is still busy."
					});
				},
				
					theAppIsLoaded: function() {

				return this.waitFor({
					id: sAppControl,
					viewName: sViewName,
					success: function(oPage) {
					 
						Opa5.assert.ok(true, "Page rendered");
					},
					errorMessage: "Page not rendered."
				});
			},
			
					iCloseTheMessageBox: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new PropertyStrictEquals({
							name: "text",
							value: "Close"
						}),
						actions: new Press(), 
						success: function() {
							Opa5.assert.ok(true, "The MessageBox was closed");
						}
					});
				}

			},

		

			assertions: {

				iShouldSeeTheBusyIndicator: function() {
					return this.waitFor({
						id: sAppControl,
						viewName: sViewName,
						success: function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(oRootView.getParent().getBusy(), "The app is busy");
						},
						errorMessage: "The app is not busy."
					});
				},

				iShouldSeeTheMessageBox: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Dialog",
						matchers: new PropertyStrictEquals({
							name: "type",
							value: "Message"
						}),
						success: function() {
							Opa5.assert.ok(true, "The correct MessageBox was shown");
						}
					});
				}

			}

		}

	});

});