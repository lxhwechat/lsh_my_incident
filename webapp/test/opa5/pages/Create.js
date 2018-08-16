sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals"

], function(Opa5, Press, EnterText, Common, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals) {
	"use strict";

	var sViewName = "Create";

	Opa5.createPageObjects({
		onTheCreatePage: {
			baseClass: Common,

			actions: {

				iPressTheCancelButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: "CancelButton",
						viewName: sViewName,

						actions: new Press(),
						errorMessage: "Did not find the 'Cancel' button on create page"
					});
				},

				iPressTheSaveButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: "SaveButton",
						viewName: sViewName,

						actions: new Press(),
						errorMessage: "Did not find the 'Save' button on create page"
					});
				},

				iPressTheOKButtonInTheMessageBox: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "OK"
						}),

						actions: new Press(),
						success: function(oMessagebox) {
							Opa5.assert.ok(true, "OK Button Pressed");
						},
						errorMessage: "OK Button not found"
					});
				},

				iEnterInTheTitleTheText: function(text) {
					return this.waitFor({
						id: "ShortTextInput",
						viewName: sViewName,

						actions: new EnterText({
							text: text
						}),
						success: function() {
							Opa5.assert.ok(true, "The test '" + text + "' has been entered as 'Title'");
						},
						errorMessage: "The 'Title' Input field was not found"
					});
				},

				iPressTheComponentInputField: function() {
					return this.waitFor({
						id: "ComponentInput",
						viewName: sViewName,

						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "Component Input Field pressed");
						},
						errorMessage: "The Component Input field was not found"
					});
				},

				iPressTheCloseButtonOnComponentValueHelp: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Close"
						}),

						actions: new Press(),
						success: function(oMessagebox) {
							Opa5.assert.ok(true, "Close Button Pressed");
						},
						errorMessage: "Close Button not found"
					});
				},

				iSearchForComponent: function(oText) {
					return this.waitFor({
						searchOpenDialogs: true,
						id: "searchField",
						viewName: sViewName,
						actions: [new EnterText({
							text: oText
						})],
						errorMessage: "Failed to find search field in Master view.'"
					});
				},

				iPressTheNavBackButton: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "type",
							value: "Back"
						}),

						actions: new Press(),
						success: function(oMessagebox) {
							Opa5.assert.ok(true, "Close Button Pressed");
						},
						errorMessage: "Close Button not found"
					});
				},

				iPressTheClearButtonOnComponentValueHelp: function() {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: "Clear"
						}),

						actions: new Press(),
						success: function(oMessagebox) {
							Opa5.assert.ok(true, "Clear Button Pressed");
						},
						errorMessage: "Clear Button not found"
					});
				},

				iPressTheComponentListItemAtPosition: function(iPosition) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",

						matchers: function(oList) {
							return oList.getItems()[iPosition];
						},
						actions: new Press(),
						errorMessage: "List 'list' in view '" + sViewName + "' does not contain an ObjectListItem at position '" + iPosition + "'"
					});

				},

				iSelectTheComponentAtPosition: function(iPosition) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",

						matchers: function(oList) {
							return oList.getItems()[iPosition];
						},

						actions: function(oCustomItem) {
							sap.ui.test.Opa5.getJQuery()(".sapMLnk").trigger("tap");

						},

						errorMessage: "List 'list' in view '" + sViewName + "' does not contain an ObjectListItem at position '" + iPosition + "'"
					});

				},

				iSelectPriority: function(iPrioCode) {
					return this.waitFor({

						controlType: "sap.m.Select",
						id: "PrioritySelect",
						viewName: sViewName,

						actions: function(oSelect) {
							oSelect.setSelectedKey(iPrioCode);
						},
						errorMessage: "Selection of Prio with Code '" + iPrioCode + "' not possible"
					});

				}

			},

			assertions: {

				iShouldSeeTheCreatePageWithTitle: function(title) {

					return this.waitFor({
						controlType: "sap.m.Page",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "title",
							value: title
						}),
						success: function() {
							Opa5.assert.ok(true, "Create Page with title '" + title + "' is visible");
						},
						errorMessage: "Create Page with title '" + title + "' was not found"

					});

				},

				iShouldSeeTheSimpleFormWithTitle: function(title) {

					return this.waitFor({
						id: "createForm",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "title",
							value: title
						}),
						success: function() {
							Opa5.assert.ok(true, "Simple Form with title '" + title + "' is visible");
						},
						errorMessage: "Simple Form with title '" + title + "' was not found"

					});

				},

				iShouldSeeTheLabelwithTheText: function(labelText) {

					return this.waitFor({
						controlType: "sap.m.Label",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: labelText
						}),
						success: function() {
							Opa5.assert.ok(true, "Label '" + labelText + "' is visible");
						},
						errorMessage: "The Label with text '" + labelText + "' was not found"

					});

				},

				iShouldSeeTheTitleInputField: function() {
					return this.waitFor({
						id: "ShortTextInput",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The 'Title' Input field is visible");
						},
						errorMessage: "The 'Title' Input field was not found"
					});
				},

				iShouldSeeTheTitleInputFieldWithEnteredText: function(text) {
					return this.waitFor({
						id: "ShortTextInput",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "value",
							value: text
						}),
						success: function() {
							Opa5.assert.ok(true, "The 'Title' Input field is visible with entered text '" + text + "'");
						},
						errorMessage: "The 'Title' Input field was not found"
					});
				},

				iShouldSeeThePrioritySelectWithPriority: function(iPrioCode) {
					return this.waitFor({
						id: "PrioritySelect",
						viewName: sViewName,
						matchers: function(oSelect) {
							return (oSelect.getSelectedKey() === iPrioCode.toString());
						},
						success: function() {
							Opa5.assert.ok(true, "The 'Priority' Select Box is visible. Priority Code '" + iPrioCode + "' has been selected");
						},
						errorMessage: "The 'Priority' Select Box was not found"
					});
				},

				iShouldSeeTheComponentInputFieldWithText: function(text) {
					return this.waitFor({
						id: "ComponentInput",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "value",
							value: text
						}),
						success: function() {
							Opa5.assert.ok(true, "The 'Component' Input field is visible");
						},
						errorMessage: "The 'Component' Input field was not found"
					});
				},

				iShouldSeeTheDescriptionTextArea: function() {
					return this.waitFor({
						id: "DescriptionTextArea",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The Text Area 'Description' is visible");
						},
						errorMessage: "The Text Area 'Description' was not found"
					});
				},

				iShouldSeeTheSaveButton: function() {
					return this.waitFor({
						id: "SaveButton",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The 'Save' button is visible");
						},
						errorMessage: "The 'Save' button was not found"
					});
				},

				iShouldSeeTheCancelButton: function() {
					return this.waitFor({
						id: "CancelButton",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The 'Cancel' button is visible");
						},
						errorMessage: "The 'Cancel' button was not found"
					});
				},

				iShouldSeeTheAlertMessageBoxWithText: function(text) {

					return this.waitFor({
						pollingInterval: 100,
						viewName: sViewName,
						check: function() {

							if (sap.ui.test.Opa5.getJQuery()(".sapMMessageDialog").find(
									".sapMText").text() === text) {
								return true;
							} else {
								return false;
							}
						},
						success: function(oMessagebox) {
							Opa5.assert.ok(true, "The Alert Box with text '" + text + "' is visible");
						},
						errorMessage: "The Alert Box with text text '" + text + "' has not been shown"
					});
				},

				iShouldSeeTheComponentValueHelpPopover: function() {

					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oList) {
							Opa5.assert.ok(true, "The 'Component Value Help Popover' is visible");
						},
						errorMessage: "The  'Component Value Help Popover' was not found"
					});

				},

				theFirstListItemShouldBeSelectable: function() {

					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						check: function(oList) {
							return oList[0].getItems()[0].getContent()[0].getTitleActive();

						},
						success: function(oList) {
							Opa5.assert.ok(true, "The 'Component Value Help Popover' is visible");
						},
						errorMessage: "The  'Component Value Help Popover' was not found"
					});

				},

				iShouldSeeANumberOfComponents: function(n) {

					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.List",
						check: function(oList) {
							return (oList[0].getItems().length === n);

						},
						success: function(oList) {
							Opa5.assert.ok(true, "The 'Component Value Help Popover' shows " + n + " Components");
						},
						errorMessage: "The 'Component Value Help Popover' does not show " + n + " Components"
					});

				},

				theTitleInputShouldHaveErrorStateWithErrorText: function(errorText) {
					return this.waitFor({
						id: "ShortTextInput",
						viewName: sViewName,
						check: function(oInput) {
							if (oInput.getValueState() === "Error" && oInput.getValueStateText() === errorText) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "The 'Title' shows Error State with Error State text '" + errorText + "'");
						},
						errorMessage: "The 'Title' shows no Error State"
					});
				},

				theTitleInputShouldHaveNoErrorState: function(errorText) {
					return this.waitFor({
						id: "ShortTextInput",
						viewName: sViewName,
						check: function(oInput) {
							if (oInput.getValueState() === "None") {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "The 'Title' shows no Error State");
						},
						errorMessage: "The 'Title' shows an Error State"
					});
				},

				theComponentInputShouldHaveErrorStateWithErrorText: function(errorText) {
					return this.waitFor({
						id: "ComponentInput",
						viewName: sViewName,
						check: function(oInput) {
							if (oInput.getValueState() === "Error" && oInput.getValueStateText() === errorText) {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "The 'Component' shows Error State with Error State text '" + errorText + "'");
						},
						errorMessage: "The 'Component' shows no Error State"
					});
				},

				theComponentInputShouldHaveNoErrorState: function(errorText) {
					return this.waitFor({
						id: "ComponentInput",
						viewName: sViewName,
						check: function(oInput) {
							if (oInput.getValueState() === "None") {
								return true;
							} else {
								return false;
							}
						},
						success: function() {
							Opa5.assert.ok(true, "The 'Component' shows no Error State");
						},
						errorMessage: "The 'Component' shows an Error State"
					});
				}
			}

		}

	});

});