jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Common",
	"sap/ui/test/opaQunit",
	"zwx/sm/itsm/myincidents/test/opa5/pages/App",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Browser",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Master",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Detail",
	"zwx/sm/itsm/myincidents/test/opa5/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zwx.sm.itsm.myincidents.view."
	});

	sap.ui.require([
		"zwx/sm/itsm/myincidents/test/opa5/NavigationJourneyPhone",
		"zwx/sm/itsm/myincidents/test/opa5/NotFoundJourneyPhone",
		"zwx/sm/itsm/myincidents/test/opa5/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});