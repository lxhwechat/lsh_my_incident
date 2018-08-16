sap.ui.define([
	"sap/ui/test/opaQunit"
], function(opaTest) {
	"use strict";

	QUnit.module("Master List");

	opaTest("Should see the master list with all entries", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();

		//Actions
		When.onTheMasterPage.iLookAtTheScreen().
		and.iWaitUntilTheListIsLoaded();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheList().
		and.theListShouldHaveAllEntries().
		and.theHeaderShouldDisplayAllEntries();
	});
	
	// opaTest("Nav Button Press - Should keep you on Master Page", function(Given, When, Then) {
	 

	// 	//Actions
	// 	When.onTheMasterPage.iPressTheNavBackButton().
	// 	and.iWaitUntilTheListIsLoaded();

	// 	// Assertions
	// 	Then.onTheMasterPage.iShouldSeeTheList().
	// 	and.theListShouldHaveAllEntries().
	// 	and.theHeaderShouldDisplayAllEntries();
	// });

	opaTest("Search for the First object should deliver results that contain the firstObject in the name", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iSearchForTheFirstObject();

		// Assertions
		Then.onTheMasterPage.theListShowsOnlyObjectsWithTheSearchStringInTheirTitle();
	});


	opaTest("Entering something that cannot be found into search field and pressing 'search' should display the list's 'not found' message",
		function(Given, When, Then) {
			//Actions
			When.onTheMasterPage.iSearchForSomethingWithNoResults();

			// Assertions
			Then.onTheMasterPage.iShouldSeeTheNoDataTextForNoSearchResults().
			and.theListHeaderDisplaysZeroHits();
		});

	opaTest("Should display items again if the searchfield is emptied", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iClearTheSearch();

		// Assertions
		Then.onTheMasterPage.theListShouldHaveAllEntries();
		//and.iTeardownMyAppFrame();

	});

	opaTest("Group Select Menu should be visible", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iPressTheGroupButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheGroupMenu();

	});

	opaTest("Group After Status", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iGroupAfter("GROUP_STATUS");

		// Assertions
		Then.onTheMasterPage.theListShouldContainAGroupHeader().
		and.theGroupedListShouldBeSortedOnField("Concatstatuser", "ASC");

	});

	opaTest("Group after Priority", function(Given, When, Then) {
		When.onTheMasterPage.iPressTheGroupButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheGroupMenu();

		//Actions
		When.onTheMasterPage.iGroupAfter("GROUP_PRIORITY");

		// Assertions
		Then.onTheMasterPage.theListShouldContainAGroupHeader().
		and.theGroupedListShouldBeSortedOnField("Priority", "ASC");

	});

	opaTest("Group after Last Change Date", function(Given, When, Then) {
		When.onTheMasterPage.iPressTheGroupButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheGroupMenu();

		//Actions
		When.onTheMasterPage.iGroupAfter("GROUP_LAST_CHANGE_DATE");

		// Assertions
		Then.onTheMasterPage.theListShouldContainAGroupHeader().
		and.theGroupedListShouldBeSortedOnField("ChangedAtDate", "DESC");

	});

	opaTest("Remove Grouping", function(Given, When, Then) {
		When.onTheMasterPage.iPressTheGroupButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheGroupMenu();

		//Actions
		When.onTheMasterPage.iGroupAfter("GROUP_NONE");

		// Assertions
		Then.onTheMasterPage.theListShouldNotContainGroupHeaders().
		and.theListShouldBeSortedOnField("PostingDate", "DESC");

	});

	opaTest("Flter Select Menu should be visible", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

	});

	opaTest("Filter Status New", function(Given, When, Then) {
		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_NEW");

		// Assertions
		Then.onTheMasterPage.theListShouldOnlyContainItemsInStatus("New").
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Filter Status In Process", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_IN_PROCESS");

		// Assertions
		Then.onTheMasterPage.theListShouldOnlyContainItemsInStatus("In Process").
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Filter Status Customer Action", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_CUSTOMER_ACTION");

		// Assertions
		Then.onTheMasterPage.theListShouldOnlyContainItemsInStatus("Customer Action").
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Filter Status Proposed Solution", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_PROPOSED_SOLUTION");

		// Assertions
		Then.onTheMasterPage.theListShouldOnlyContainItemsInStatus("Solution Provided").
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Filter Status Withdrawn", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_WITHDRAWN");

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheNoDataTextForNoSearchResults().
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Filter Status Closed", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_CLOSED");

		// Assertions
		Then.onTheMasterPage.theListShouldOnlyContainItemsInStatus("Closed").
		and.theFilterToolBarShouldBeVisible();

	});

	opaTest("Remove Filter", function(Given, When, Then) {

		//Actions
		When.onTheMasterPage.iPressTheFilterButton();

		// Assertions
		Then.onTheMasterPage.iShouldSeeTheFilterMenu();

		//Actions
		When.onTheMasterPage.iFilterOn("FILTER_ALL_OPEN");

		// Assertions
		Then.onTheMasterPage.theListShouldBeSortedOnField("PostingDate", "DESC").
		and.iTeardownMyAppFrame();

	});

});