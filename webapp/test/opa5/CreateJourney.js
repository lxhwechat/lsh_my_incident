sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/model/resource/ResourceModel"
], function(opaTest, ResourceModel) {
	"use strict";

	QUnit.module("Create Page");

	opaTest("Pressing the 'Create' button should navigate to the create View with all elements", function(Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		// Actions

		When.onTheMasterPage.iRememberTheSelectedItem().
		and.iPressTheCreateButton();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheCreatePageWithTitle("Create Incident").
		and.iShouldSeeTheSimpleFormWithTitle("Incident Details").
		and.iShouldSeeTheLabelwithTheText("Title").
		and.iShouldSeeTheTitleInputField().
		and.iShouldSeeTheLabelwithTheText("Priority").
		and.iShouldSeeThePrioritySelectWithPriority(3).
		and.iShouldSeeTheLabelwithTheText("Component").
		and.iShouldSeeTheComponentInputFieldWithText("").
		and.iShouldSeeTheLabelwithTheText("Description").
		and.iShouldSeeTheDescriptionTextArea().
		and.iShouldSeeTheSaveButton().
		and.iShouldSeeTheCancelButton();

	});

	opaTest("Cancel on Create should navigate Back to Detail Page", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheCancelButton();

		// Assertions
		Then.onTheDetailPage.
		iShouldSeeTheRememberedObject();

	});

	opaTest("Create after Cancel should navigate again to the create View with all elements", function(Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		// Actions
		When.onTheMasterPage.iRememberTheSelectedItem().
		and.iPressTheCreateButton();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheCreatePageWithTitle("Create Incident").
		and.iShouldSeeTheSimpleFormWithTitle("Incident Details").
		and.iShouldSeeTheLabelwithTheText("Title").
		and.iShouldSeeTheTitleInputField().
		and.iShouldSeeTheLabelwithTheText("Priority").
		and.iShouldSeeThePrioritySelectWithPriority(3).
		and.iShouldSeeTheLabelwithTheText("Component").
		and.iShouldSeeTheComponentInputFieldWithText("").
		and.iShouldSeeTheLabelwithTheText("Description").
		and.iShouldSeeTheDescriptionTextArea().
		and.iShouldSeeTheSaveButton().
		and.iShouldSeeTheCancelButton();

	});

	opaTest("Save without 'title' should bring up 'Complete Input' Dialog", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheSaveButton();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheAlertMessageBoxWithText("Enter all required data first").
		and.theTitleInputShouldHaveErrorStateWithErrorText("Title must not be empty. Maximum 40 characters.");

	});

	opaTest("Close Complete Input Dialog", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheOKButtonInTheMessageBox();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheCreatePageWithTitle("Create Incident");

	});

	opaTest("Enter a text in Title that is too long", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iEnterInTheTitleTheText("This is a title that is too long to be valid");

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheTitleInputFieldWithEnteredText("This is a title that is too long to be valid").
		and.theTitleInputShouldHaveErrorStateWithErrorText("Title must not be empty. Maximum 40 characters.");

	});

	opaTest("Enter a valid text in Title", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iEnterInTheTitleTheText("This is a valid title");

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheTitleInputFieldWithEnteredText("This is a valid title").
		and.theTitleInputShouldHaveNoErrorState();

	});

	opaTest("Select Prio 'Very High'", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSelectPriority(1);

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeThePrioritySelectWithPriority(1);

	});

	opaTest("Save without 'title' should bring up 'Complete Input' Dialog", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheSaveButton();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheAlertMessageBoxWithText("Enter all required data first").
		and.theComponentInputShouldHaveErrorStateWithErrorText("Very High Priority requires a Component.");

	});

	opaTest("Close Complete Input Dialog", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheOKButtonInTheMessageBox();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheCreatePageWithTitle("Create Incident");

	});

	opaTest("Open the Component Value Help", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentInputField();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentValueHelpPopover();

	});

	opaTest("Close the Component Value Help on Close Button", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheCloseButtonOnComponentValueHelp();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentInputFieldWithText("").
		and.theComponentInputShouldHaveErrorStateWithErrorText("Very High Priority requires a Component.");

	});

	opaTest("Open the Component Value Help again", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentInputField();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentValueHelpPopover().and.iShouldSeeANumberOfComponents(3);

	});

	opaTest("Navigate to second Component level in Value Help", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentListItemAtPosition(2);

		// Assertions

		Then.onTheCreatePage

			.theFirstListItemShouldBeSelectable().
		and.iShouldSeeANumberOfComponents(1);

	});
	
	opaTest("Navigate to third Component level in Value Help", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentListItemAtPosition(0);

		// Assertions

		Then.onTheCreatePage

			.theFirstListItemShouldBeSelectable().
		and.iShouldSeeANumberOfComponents(1);

	});

	opaTest("Navigate back to second Component level in Value Help", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheNavBackButton();

		// Assertions

		Then.onTheCreatePage.

		iShouldSeeANumberOfComponents(1);

	});
	
	// opaTest("Navigate back to first Component level in Value Help", function(Given, When, Then) {

	// 	// Actions
	// 	When.onTheCreatePage.iPressTheNavBackButton();

	// 	// Assertions

	// 	Then.onTheCreatePage.

	// 	iShouldSeeANumberOfComponents(3);

	// });
	
	// opaTest("Navigate to second Component level again", function(Given, When, Then) {

	// 	// Actions
	// 	When.onTheCreatePage.iPressTheComponentListItemAtPosition(2);

	// 	// Assertions

	// 	Then.onTheCreatePage

	// 		.theFirstListItemShouldBeSelectable().
	// 	and.iShouldSeeANumberOfComponents(1);

	// });

	opaTest("Select Component", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSelectTheComponentAtPosition(0);

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentInputFieldWithText("SV-SMG").
		and.theComponentInputShouldHaveNoErrorState();

	});

	opaTest("Open the Component Value Help again", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentInputField();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentValueHelpPopover();

	});

	opaTest("Clear the Component with the Clear Button", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheClearButtonOnComponentValueHelp();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentInputFieldWithText("");

	});

	opaTest("Open the Component Value Help again", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iPressTheComponentInputField();

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentValueHelpPopover();

	});
	
	opaTest("Search for Component", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSearchForComponent("SV-SMG");

		// Assertions
	Then.onTheCreatePage

			.theFirstListItemShouldBeSelectable().
		and.iShouldSeeANumberOfComponents(1);

	});	
	
	opaTest("Search for Component", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSearchForComponent("");

		// Assertions
	Then.onTheCreatePage

			.theFirstListItemShouldBeSelectable().
		and.iShouldSeeANumberOfComponents(3);

	});	
	
	opaTest("Search for Component", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSearchForComponent("SV-SMG");

		// Assertions
	Then.onTheCreatePage

			.theFirstListItemShouldBeSelectable().
		and.iShouldSeeANumberOfComponents(1);

	});	

	opaTest("Select Component", function(Given, When, Then) {

		// Actions
		When.onTheCreatePage.iSelectTheComponentAtPosition(0);

		// Assertions
		Then.onTheCreatePage.
		iShouldSeeTheComponentInputFieldWithText("SV-SMG").
		and.iTeardownMyAppFrame();

	});
});