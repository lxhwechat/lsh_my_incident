sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/model/resource/ResourceModel"
], function(opaTest, ResourceModel) {
	"use strict";

	QUnit.module("Detail Page");

	opaTest("Should see the detail page on conversation tab with confirm and withdraw button visible", function(Given, When, Then) {

		// Arrangements
		Given.iStartTheApp();

		// Actions
		When.onTheMasterPage.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject().
		and.iShouldSeeTheRichTextEditor().
		and.iShouldSeeTheFeedList().
		and.theConversationTabShouldDisplayTheAmountOfTexts().
		and.iShouldSeeTheWithdrawButton().
		and.iShouldSeeTheConfirmButton();

	});

	opaTest("Check QuickView in FeedList", function(Given, When, Then) {

		// Actions 
		When.onTheDetailPage.iPressTheSenderInFeedListAtPositon(0);

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheQuickContactCard();
		// 	and.iShouldSeeTheFeedList().
		// 	and.theConversationTabShouldDisplayTheAmountOfTexts();

	});

	opaTest("Check Attachments Icon Tab filter and count", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheAttachmentTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAttachmentControl().
		and.theAttachmentTabShouldDisplayTheAmountOfAttachments();

	});

	opaTest("Delete Attachment Dialog", function(Given, When, Then) {

		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(1).
		and.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject();
		// Actions
		When.onTheDetailPage.iPressTheAttachmentDeleteButtonAtItemNo(0);

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheMessageBoxWithTitle("Delete File");

	});

	opaTest("Delete Attachment  ", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheDialogButtonWithTheText("OK");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAttachmentControl().
		and.theAttachmentTabCountShouldBeZero();

	});
	
	opaTest("Delete Attachment Dialog", function(Given, When, Then) {

		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(4).
		and.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject();
		// Actions
		When.onTheDetailPage.iPressTheAttachmentDeleteButtonAtItemNo(0);

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheMessageBoxWithTitle("Delete File");
		


	});

	opaTest("Delete Attachment failure - Error Box Should be seen  ", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheDialogButtonWithTheText("OK");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheMessageBoxWithTitle("Attachment Not Deleted");
		
		// Actions
		When.onTheDetailPage.iPressTheDialogButtonWithTheText("Close");
		
			// Assertions
		Then.onTheDetailPage.iShouldSeeTheAttachmentControl().
		and.theAttachmentTabShouldDisplayTheAmountOfAttachments();

	});


	opaTest("Switch to next item in list at position 3", function(Given, When, Then) {

		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(2).
		and.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject();

	});

	opaTest("Check Conversation Icon Tab filter and count", function(Given, When, Then) {
		// Actions 
		When.onTheDetailPage.iPressTheConversationTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheFeedInput().
		and.iShouldSeeTheFeedList().
		and.theConversationTabShouldDisplayTheAmountOfTexts();
	});

	opaTest("Check Attachments tab displays no entry", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheAttachmentTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAttachmentControl().
		and.theAttachmentTabCountShouldBeZero();

	});

	opaTest("Switch to item in list at position 2", function(Given, When, Then) {

		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(1).
		and.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject();

	});

	opaTest("Check Conversation Icon Tab filter and count", function(Given, When, Then) {

		// Actions 
		When.onTheDetailPage.iPressTheConversationTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRichTextEditor().
		and.iShouldSeeTheFeedList().
		and.theConversationTabShouldDisplayTheAmountOfTexts();

	});

	opaTest("Check Attachments Icon Tab filter and count", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheAttachmentTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheAttachmentControl().
		and.theAttachmentTabCountShouldBeZero();
		//	and.iTeardownMyAppFrame();
	});

	opaTest("Switch back to first item at position 1 and check if RichTextEditor is visible", function(Given, When, Then) {

		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(0).
		and.iRememberTheSelectedItem();
		When.onTheDetailPage.iPressTheConversationTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRichTextEditor().
		and.iShouldSeeTheFeedList();

	});

	opaTest("Check entering of text in RichTextEditor", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iEnterSomeTextInTheRichTextEditor("<strong>This</strong> is just a little text for testing.").
		and.iPressTheSubmitTextButton();

		// Assertions
		Then.onTheDetailPage.iShouldSeeAsFirstItemInTheFeedListTheText("<html><head></head><body><strong>This</strong> is just a little text for testing.</body></html>").
		and.theConversationTabShouldDisplayTheAmountOfTexts();
		//and.iTeardownMyAppFrame();
	});

	opaTest("Switch to Detail Tab and check elements", function(Given, When, Then) {

		// Actions
		When.onTheDetailPage.iPressTheDetailTabFilter();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject().
		and.iShouldSeeTheLabelwithTheText("Incident Number").
		and.iShouldSeeTheTextFieldWithTheText("800000123").
		and.iShouldSeeTheLabelwithTheText("Created By").
		and.iShouldSeeTheTextFieldWithTheText("Max Mock").
		and.iShouldSeeTheLabelwithTheText("Created On").
		and.iShouldSeeTheTextFieldWithTheText("16.02.17").
		and.iShouldSeeTheLabelwithTheText("Last Change").
		and.iShouldSeeTheTextFieldWithTheText("21.02.17").
		and.iShouldSeeTheLabelwithTheText("Priority").
		and.iShouldSeeTheObjectStatusWithTheText("3: Medium").
		and.iShouldSeeTheObjectStatusWithTheState("None").
		and.iShouldSeeTheLabelwithTheText("Category").
		and.iShouldSeeTheTextFieldWithTheText("Hardware").
		and.iShouldSeeTheLabelwithTheText("Component").
		and.iShouldSeeTheTextFieldWithTheText("SV-SMG-SUP").
		and.iShouldSeeTheLabelwithTheText("Configuration Item").
		and.iShouldSeeTheTextFieldWithTheText("Lenovo t520").
		and.iShouldSeeTheLabelwithTheText("Additional Contact").
		and.iShouldSeeTheTextFieldWithTheText("").
		and.iTeardownMyAppFrame();

	});

	opaTest("Check Confirm Button", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		// Actions
		When.onTheMasterPage.iRememberTheSelectedItem();
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject().
		and.iShouldSeeTheConfirmButton().and.theButtonShouldBeEnabledandEmphasized("Confirm");
	});

	opaTest("Check Confirm Button Dialog open", function(Given, When, Then) {
		// Actions
		When.onTheAppPage.theAppIsLoaded();
		When.onTheDetailPage.iPressTheConfirmButton();
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheDialogWithTitle("Confirm Incident").
		and.iShouldSeeTheTextFieldWithTheText("CONFIRM_POPUP_QUESTION").
		and.iShouldSeeTheTextFieldWithTheText("If you select Yes, the system will close the incident.").
		and.iShouldSeeTheTextAreaWithPlaceholderText("POP_UP_FINAL_COMMENTS").
		and.iShouldSeeTheButtonWithTheText("Yes").
		and.iShouldSeeTheButtonWithTheText("No");
	});

	opaTest("Check 'No' Option of Confirm Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheButtonWithTheText("No");
		// Assertions
		Then.onTheDetailPage.theConfirmDialogShouldBeClosed();
	});

	opaTest("Reopen Confirm Button Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheConfirmButton();
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheDialogWithTitle("Confirm Incident").
		and.iShouldSeeTheTextFieldWithTheText("CONFIRM_POPUP_QUESTION").
		and.iShouldSeeTheTextFieldWithTheText("If you select Yes, the system will close the incident.").
		and.iShouldSeeTheTextAreaWithPlaceholderText("POP_UP_FINAL_COMMENTS").
		and.iShouldSeeTheButtonWithTheText("Yes").
		and.iShouldSeeTheButtonWithTheText("No");
	});

	opaTest("Check 'Yes' Option of Confirm Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheButtonWithTheText("Yes");
		// Assertions
		Then.onTheDetailPage.theConfirmDialogShouldBeClosed();
	});

	opaTest("Check Withdraw Button", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();
		// Actions
		When.onTheMasterPage.iPressOnTheObjectAtPosition(4).
		and.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject().
		and.iShouldSeeTheWithdrawButton().
		and.theButtonShouldBeEnabledandEmphasized("Withdraw");
	});

	opaTest("Check Withdraw Button Dialog open", function(Given, When, Then) {
		// Actions
		When.onTheAppPage.theAppIsLoaded();
		When.onTheDetailPage.iPressTheWithdrawButton();
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheDialogWithTitle("Withdraw Incident").
		and.iShouldSeeTheTextFieldWithTheText("WITHDRAW_POPUP_QUESTION").
		and.iShouldSeeTheTextFieldWithTheText("POPUP_CONSEQUENCE_TEXT").
		and.iShouldSeeTheTextAreaWithPlaceholderText("POP_UP_ADDITIONAL_COMMENTS").
		and.iShouldSeeTheButtonWithTheText("Yes").
		and.iShouldSeeTheButtonWithTheText("No");
	});

	opaTest("Check 'No' Option of Withdraw Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheButtonWithTheText("No");
		// Assertions
		Then.onTheDetailPage.theWithdrawDialogShouldBeClosed();
	});

	opaTest("Reopen Withdraw Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheWithdrawButton();
		// Assertions
		Then.onTheDetailPage.iShouldSeeTheDialogWithTitle("Withdraw Incident").
		and.iShouldSeeTheTextFieldWithTheText("WITHDRAW_POPUP_QUESTION").
		and.iShouldSeeTheTextFieldWithTheText("POPUP_CONSEQUENCE_TEXT").
		and.iShouldSeeTheTextAreaWithPlaceholderText("POP_UP_ADDITIONAL_COMMENTS").
		and.iShouldSeeTheButtonWithTheText("Yes").
		and.iShouldSeeTheButtonWithTheText("No");
	});

	opaTest("Check 'Yes' Option of Confirm Dialog", function(Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheButtonWithTheText("Yes");
		// Assertions
		Then.onTheDetailPage.theWithdrawDialogShouldBeClosed().
		and.iTeardownMyAppFrame();
	});

});