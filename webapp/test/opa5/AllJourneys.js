jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 MessageResultSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Common",
	"sap/ui/test/opaQunit",
	"zwx/sm/itsm/myincidents/test/opa5/pages/App",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Browser",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Master",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Detail",
	"zwx/sm/itsm/myincidents/test/opa5/pages/NotFound",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Create"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zwx.sm.itsm.myincidents.view.",
		  timeout: 60
	});

	sap.ui.require([
		"zwx/sm/itsm/myincidents/test/opa5/NotFoundJourney",
		"zwx/sm/itsm/myincidents/test/opa5/BusyJourney",
		"zwx/sm/itsm/myincidents/test/opa5/FLPIntegrationJourney",
		"zwx/sm/itsm/myincidents/test/opa5/MasterJourney",
		"zwx/sm/itsm/myincidents/test/opa5/DetailJourney",
		"zwx/sm/itsm/myincidents/test/opa5/CreateJourney",
		"zwx/sm/itsm/myincidents/test/opa5/NavigationJourney"
	], function() {
		QUnit.start();
	});
});