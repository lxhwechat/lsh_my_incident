sap.ui.define([
	"zwx/sm/itsm/myincidents/view/Create.controller",
 
	"zwx/sm/itsm/myincidents/util/Util",
 
	"sap/m/Input",
	"sap/m/TextArea",
	"sap/m/Select",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
 
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"

], function(CreateController,  Util, Input, TextArea, Select, JSONModel, ODataModel ) {
	"use strict";
	var id = 1;
	QUnit.module("Create Controller - Tests",

		{
			setup: function() {

				Util.init();

				var fakeView = {
					createId: function() {
						return "id" + id++;
					},
					addDependent: function() {}
				};

				// jQuery.sap.require("sap.m.Input");
				// jQuery.sap.require("sap.m.TextArea");

				this.controller = new CreateController();
				this.controller.oView = fakeView;
				this.controller.jModel = new JSONModel({
					title: "",
					component: "",
					description: ""
				});

				this.controller.oComponentInput = new Input();
				this.controller.oTitleControl = new Input();
				this.controller.oDescriptionTextArea = new TextArea();
				this.controller.oPrioSelect = new Select();

				//	this.controller.bundle = new FakeModel(mResourcetexts).getResourceBundle();

			},
			teardown: function() {
				
			if	(this.controller._dialog) {
					this.controller._dialog.destroy();
				}
				// this.oMockServer.destroy();
				// ok(true, "Mock Server has been stopped");
			}
		});

	QUnit.test("Check create form is initilized", function() {

		this.controller.initializeCreateForm();
		var data = this.controller.jModel.getData();

		ok(data.title === "", "Title is empty");
		ok(data.component === "", "Component is empty");
		ok(data.description === "", "Description is empty");
	});

	QUnit.test("Check create form is initilized with entered data before", function() {

		this.controller.jModel.setData({
			title: "Title of Incident",
			component: "SV-SMG-SUP",
			description: "I'm a unit test.. Please test me !!!"
		});

		this.controller.initializeCreateForm();
		var data = this.controller.jModel.getData();

		ok(data.title === "", "Title is empty");
		ok(data.component === "", "Component is empty");
		ok(data.description === "", "Description is empty");
	});

	QUnit.test("Save function Success&Error", function() {

		this.controller.jModel.setData({
			title: "Title of Incident",
			component: "SV-SMG-SUP",
			description: "I'm a unit test.. Please test me !!!"
		});

		var i18NModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "../../i18n/i18n.properties"
		});
		sinon.stub(this.controller, "getResourceBundle").returns(i18NModel.getResourceBundle());

		sinon.stub(this.controller, "getRouter").returns({
			attachRoutePatternMatched: function() {}
		});

		sinon.stub(this.controller, "getEventBus").returns({
			publish: function(sIdentity, identifier) {
				ok(sIdentity === "zwx.sm.itsm.myincidents", "Save Executed Event with Identity " + sIdentity + " has been called");
				ok(identifier === "saveExecuted", "Save Executed Event with identfier " + identifier + " has been called");

			}
		});

		this.controller.extHookOnCreateBeforeSaveValidation = function(canContinue) {
			ok(canContinue === true, "Controller Hook Before Save has been called");
		};
		 
		this.controller.extHookCreateOnInit = function(oInstance) {
			ok( true, "Controller Hook Create On Init has been called");
		};

		this.stub(this.controller, "byId").withArgs("ShortTextInput").returns(new Input())
			.withArgs("PrioritySelect").returns(new Select())
			.withArgs("DescriptionTextArea").returns(new TextArea())
			.withArgs("ComponentInput").returns(new Input());

		var oDataWrapperMockSuccess = {
			create: function(sRelativeUrl, oSupportTicketData, fnSuccessCallback, fnErrorCallback) {
				var response = {
					messageNumber: 8000001231
				};
				ok(true, "Success After Save has been called");
				fnSuccessCallback(response);

			}
		};

		var oDataWrapperMockFail = {
			create: function(sRelativeUrl, oSupportTicketData, fnSuccessCallback, fnErrorCallback) {
				ok(true, "Error After Save has been called");
				fnErrorCallback("Error in Backend");

			}
		};

		var oDataModelMock = {
			refresh: function() {
				return true;
			}
		};
		
	 

		var ODataWrapperStub = this.stub(this.controller, "getUI2ODataWrapper").returns(oDataWrapperMockSuccess);
		this.stub(this.controller, "getModel").returns(oDataModelMock);

		this.controller.onInit();
		
		this.controller.oTitleControl.setValue("Title");
		this.controller.onSave();



		ODataWrapperStub.restore();
		this.stub(this.controller, "getUI2ODataWrapper").returns(oDataWrapperMockFail);
		
	  
		this.controller.onSave();
		
			var oMessageBox = sap.ui.getCore().byId("messageBoxSaveError");
			ok(oMessageBox, "MessageBox Dialog should be created");
			oMessageBox.destroy();
	});
	
	QUnit.test("Check Change Priority removes Error State if not set to 'Very High'", function() {



		this.controller.oPrioSelect = new Select().setSelectedKey(1);
		this.controller.oComponentInput = new Input().setValueState("Error");
		this.controller.onChangePriority();

		ok(this.controller.oPrioSelect.getSelectedKey() === "1", "Prio value still maintained");
		ok(this.controller.oComponentInput.getValueState() === "None", "Value Statue set to 'None'");
 
	});
	
	QUnit.test("Check if Component Help closes correctly when 'ESC' is pressed", function() {

	 
		
		
		this.controller.destroyPopover = sinon.spy();
	 	ok(!this.controller.destroyPopover.called, "Destroy not called");
		this.controller.onPopoverAfterClose();

		 	ok(this.controller.destroyPopover.called, "Destroy called");
 
 
	});

	QUnit.test("Check if Dialog Close is called", function() {

	 
		this.controller._dialog = new sap.m.BusyDialog();                                                       
		
		this.controller._dialog.close = sinon.spy();
	 	ok(!this.controller._dialog.close.called, "dialog.close not called");
		this.controller.onAfterModelUpdate();

		 	ok(this.controller._dialog.close, "dialog.close called");
 
 
	});
	             

	
});