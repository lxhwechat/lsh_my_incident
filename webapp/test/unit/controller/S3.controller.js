sap.ui.define([
	"zwx/sm/itsm/myincidents/view/S3.controller",
	"zwx/sm/itsm/myincidents/util/Util",
	"zwx/sm/itsm/myincidents/util/Formatter",
	"sap/m/List",
	"sap/m/semantic/FilterSelect",
	"sap/m/semantic/GroupSelect",
	"sap/ui/richtexteditor/RichTextEditor",

	// "sap/m/Input",
	// "sap/m/TextArea",
	// "sap/m/Select",
	// "sap/ui/model/json/JSONModel",
	// "sap/ui/model/odata/v2/ODataModel",

	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"

], function(DetailController, Util, Formatter, List, FilterSelect, GroupSelect, RichTextEditor
	// Input, TextArea, Select, JSONModel, ODataModel 
) {
	"use strict";
	var id = 1;
	QUnit.module("Detail Controller - Tests",

		{
			setup: function() {

				var that = this;
				this.callbacksForTest = {};
				this.callbacksForCreateTextTest = {};
				this.oDummyUploadCollection = new sap.m.UploadCollection();
				
				Util.init();

				this.fakeView = {
					createId: function() {
						return "id" + id++;
					},
					addDependent: function() {},
					addEventDelegate: function() {},
					getModel: function() {
						var fakeModel = {
							read: jQuery.proxy(function(sPath, callbacks) {
								this.callbacksForTest = callbacks;
							}, that),

							create: jQuery.proxy(function(sPath, entity, callbacks) {
								equal(entity.TextString, "<html><head></head><body></body></html>", "Text has been stored");
								this.callbacksForCreateTextTest = callbacks;
							}, that),

							callFunction: jQuery.proxy(function(sPath, callbacks) {
								ok(true, "Call Function has been called");
								this.callbacksForCallFunction = callbacks;
							}, that)
						};
						return fakeModel;
					},
					setModel: function() {},
				
					richTextEditor : new sap.ui.richtexteditor.RichTextEditor(),
					attachmentfltr: new sap.m.IconTabFilter(),
					attachmentCollection: this.oDummyUploadCollection,
					notescntrl: new sap.m.List(),
					notesfltr: new sap.m.IconTabFilter(),
					sPath: "MessageResultSet(guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7')"
				};

				// jQuery.sap.require("sap.m.Input");
				// jQuery.sap.require("sap.m.TextArea");

				this.controller = new DetailController();
				//	this.controller.oView = fakeView;

				this.i18NModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "../../i18n/i18n.properties"
				});

				this.fakeOwnerComponent = {

				};
				// sinon.stub(this.controller, "getResourceBundle").returns(this.i18NModel.getResourceBundle());

				// sinon.stub(this.controller, "getEventBus").returns({
				// 	publish: function(sIdentity, identifier) {
				// 		// ok(sIdentity === "zwx.sm.itsm.myincidents", "Save Executed Event with Identity " + sIdentity + " has been called");
				// 		// ok(identifier === "saveExecuted", "Save Executed Event with identfier " + identifier + " has been called");

				// 	},

				// 	subscribe: function(sIdentity, identifier, callback) {
				// 		if (identifier === "saveExecuted") {
				// 			that.controller.callbackSaveExecuted = callback;
				// 			ok(sIdentity === "zwx.sm.itsm.myincidents", "Save Executed Event with Identity " + sIdentity + " has been registered");
				// 			ok(identifier === "saveExecuted", "Save Executed Event with identfier " + identifier + " has been registered");
				// 		}

				// 		if (identifier === "confirmExecuted") {
				// 			this.callbackConfirmExecuted = callback;
				// 			ok(sIdentity === "zwx.sm.itsm.myincidents", "Event with Identity " + sIdentity + " has been registered");
				// 			ok(identifier === "confirmExecuted", "Event with identfier " + identifier + " has been registered");
				// 		}

				// 		if (identifier === "withdrawExecuted") {
				// 			this.callbackWithdrawExecuted = callback;
				// 			ok(sIdentity === "zwx.sm.itsm.myincidents", "Event with Identity " + sIdentity + " has been registered");
				// 			ok(identifier === "withdrawExecuted", "Event with identfier " + identifier + " has been registered");
				// 		}

				// 	}
				// });

				sinon.stub(this.controller, "getView").returns(this.fakeView);

				// var oListMock = new List();

				// oListMock.attachEventOnce = function(identifier, callback, param2) {
				// 	if (identifier === "updateFinished" && param2 === undefined) {
				// 		that.controller.callbackUpdateFinished = callback;
				// 	}
				// };

				// sinon.stub(this.controller, "byId").withArgs("list").returns(oListMock)
				// 	.withArgs("filterSelect").returns(new FilterSelect())
				// 	.withArgs("selectGroup").returns(new GroupSelect());

				var oDataModelMock = {
					refresh: function() {
						return true;
					},

					getProperty: function(property) {
						return property;
					},

					metadataLoaded: function() {
						var oMetaDataLoadedPromise = new jQuery.Deferred();
						return oMetaDataLoadedPromise;
					},

					getSecurityToken: function() {
						return "dummyToken";
					}
				};

				sinon.stub(this.controller, "getModel").returns(oDataModelMock);

				// this.controller.jModel = new JSONModel({
				// 	title: "",
				// 	component: "",
				// 	description: ""
				// });

				// this.controller.oComponentInput = new Input();
				// this.controller.oTitleControl = new Input();
				// this.controller.oDescriptionTextArea = new TextArea();
				// this.controller.oPrioSelect = new Select();

				//	this.controller.bundle = new FakeModel(mResourcetexts).getResourceBundle();

			},
			teardown: function() {

				if (this.controller._dialog) {
					this.controller._dialog.destroy();
				}

				sap.ushell = undefined;
				// this.oMockServer.destroy();
				// ok(true, "Mock Server has been stopped");
			}
		});

	QUnit.test("on Share Email Press.. ", function() {
		sinon.stub(sap.m.URLHelper, "triggerEmail").returns();
		this.controller.onShareEmailPress();

		ok(true, "onShareEmailPress Triggered");

	});

	QUnit.test("on Share in Jam Press.. ", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();

		var oMockDialog = {
			open: function() {
				return "";
			}
		};
		sinon.stub(sap.ui.getCore(), "createComponent").returns(oMockDialog);
		this.controller.onShareInJamPress();

		ok(true, "Controller Hook On Master Init has been called");

	});

	QUnit.test("check for onDetailContextUpdate controller hook", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();
		var oDummyEvent = {
			getParameter: function() {
				var oEntity = {
					objectId: "80808080"
				};
				return oEntity;
			}

		};

		this.controller.extHookOnDetailContextUpdate = function(oInstance) {
			ok(true, "Controller Hook extHookOnDetailContextUpdate has been called");
		};
		this.controller._onObjectMatched(oDummyEvent);

	});

	QUnit.test("check for Contact Popover controller hook", function() {

		var oDummyEvent = {
			getParameter: function() {
			return function() {
				
			};
			},

			getSource: function() {
				return new sap.m.FeedListItem();
			}

		};

		this.controller.extHookContactPopoverData = function(oInstance) {
			ok(true, "Controller Hook extHookOnDetailContextUpdate has been called");
		};
		this.controller.bundle = this.i18NModel.getResourceBundle();
		this.controller.oEmployeeModel = new sap.ui.model.json.JSONModel();
		this.controller._oQuickView = { openBy : function(s)
			{
				
			}
		};
		this.controller.onPressSender(oDummyEvent);

	});

	QUnit.test("on Change with normal filename", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();

		var oDummyUploadCollection = new sap.m.UploadCollection();
		var oDummyEvent = {
			getParameter: function() {
				var oDummyUploadedFile = {
					files: [{
						name: "Screenshot.jpg"
					}]
				};
				return oDummyUploadedFile;
			},

			getSource: function() {
				return oDummyUploadCollection;
			}

		};

		this.controller.onChange(oDummyEvent);
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("name"), "x-csrf-token", "x-csrf-token parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("value"), "dummyToken", "x-csrf-token is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("name"), "content-disposition",
			"content-disposition parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("value"), 'inline; filename="Screenshot.jpg"', "filename is set");
	});

	QUnit.test("on Change with larger filename", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();

		var oDummyUploadCollection = new sap.m.UploadCollection();
		var oDummyEvent = {
			getParameter: function() {
				var oDummyUploadedFile = {
					files: [{
						name: "Screenshot_from_a_great_error_that_is_too_long.jpg"
					}]
				};
				return oDummyUploadedFile;
			},

			getSource: function() {
				return oDummyUploadCollection;
			}

		};

		this.controller.onChange(oDummyEvent);
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("name"), "x-csrf-token", "x-csrf-token parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("value"), "dummyToken", "x-csrf-token is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("name"), "content-disposition",
			"content-disposition parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("value"),
			'inline; filename="Screenshot_from_a_great_error_that_i.jpg"', "Long filename is set");
	});

	QUnit.test("on Change with larger filename without extension", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();

		var oDummyUploadCollection = new sap.m.UploadCollection();
		var oDummyEvent = {
			getParameter: function() {
				var oDummyUploadedFile = {
					files: [{
						name: "Screenshot_from_a_great_error_that_is_too_long"
					}]
				};
				return oDummyUploadedFile;
			},

			getSource: function() {
				return oDummyUploadCollection;
			}

		};

		this.controller.onChange(oDummyEvent);
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("name"), "x-csrf-token", "x-csrf-token parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[0].getProperty("value"), "dummyToken", "x-csrf-token is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("name"), "content-disposition",
			"content-disposition parameter is set");
		equal(oDummyUploadCollection.getHeaderParameters()[1].getProperty("value"),
			'inline; filename="Screenshot_from_a_great_error_that_is_to"', "Long filename is set");
	});

	QUnit.test("add New Upload Collection Item", function() {
		// sinon.stub(sap.m.URLHelper, "triggerEmail").returns();
		var array = [];
		var oAttachmentSet = {
			AttachmentSet: array
		};

		var oDummyCollection = {

			getModel: function() {
				var oEntity = {
					getData: function() {

						return oAttachmentSet;

					},

					setData: function(oData) {
						oAttachmentSet = oData;
					}

				};
				return oEntity;
			}

		};

		var oDummyItem = {
			documentId: "TestDocID",
			fileName: "Screenshot.jpg",
			fileSize: "000000192276",
			mimeType: "image/jpeg",
			language: "E",
			contributor: "Max Mock",
			uploadDate: "/Date(1487945581000)/",
			document: "01110011010100111111111010011111",
			url: "Testurl",
			enableEdit: false,
			enableDelete: true,
			visibleDelete: true,
			visibleEdit: false

		};

		var oSecondDummyItem = {
			documentId: "TestDocID2",
			fileName: "Screenshot2.jpg",
			fileSize: "000000192272",
			mimeType: "image/jpeg",
			language: "E",
			contributor: "Max Mock",
			uploadDate: "/Date(1487945581000)/",
			document: "01110011010100111111111010011111",
			url: "Testurl",
			enableEdit: false,
			enableDelete: true,
			visibleDelete: true,
			visibleEdit: false

		};

		this.controller.addNewUploadCollectionItem(oDummyCollection, oDummyItem);
		this.controller.addNewUploadCollectionItem(oDummyCollection, oSecondDummyItem);

		equal(this.controller.oAttachmentSet[0].documentId, "TestDocID2");
		equal(this.controller.oAttachmentSet[0].fileName, "Screenshot2.jpg");
		equal(this.controller.oAttachmentSet[0].fileSize, "000000192272");
		equal(this.controller.oAttachmentSet[0].mimeType, "image/jpeg");
		equal(this.controller.oAttachmentSet[0].url, "Testurl");
		equal(this.controller.oAttachmentSet[0].contributor, "Max Mock");
		equal(this.controller.oAttachmentSet[0].uploadDate, "/Date(1487945581000)/");
		equal(this.controller.oAttachmentSet[0].enableDelete, true);
		equal(this.controller.oAttachmentSet[0].enableEdit, false);
		equal(this.controller.oAttachmentSet[0].visibleDelete, true);
		equal(this.controller.oAttachmentSet[0].visibleEdit, false);

		equal(this.controller.oAttachmentSet[1].documentId, "TestDocID");
		equal(this.controller.oAttachmentSet[1].fileName, "Screenshot.jpg");
		equal(this.controller.oAttachmentSet[1].fileSize, "000000192276");
		equal(this.controller.oAttachmentSet[1].mimeType, "image/jpeg");
		equal(this.controller.oAttachmentSet[1].url, "Testurl");
		equal(this.controller.oAttachmentSet[1].contributor, "Max Mock");
		equal(this.controller.oAttachmentSet[1].uploadDate, "/Date(1487945581000)/");
		equal(this.controller.oAttachmentSet[1].enableDelete, true);
		equal(this.controller.oAttachmentSet[1].enableEdit, false);
		equal(this.controller.oAttachmentSet[1].visibleDelete, true);
		equal(this.controller.oAttachmentSet[1].visibleEdit, false);

	});

	QUnit.test("on Upload Complete Event", function() {

		var oDummyEvent = {

			getParameters: function() {
				return {
					getParameter: function(paramName) {

						switch (paramName) {

							case "status":
								return 201;

						}

					}
				};

			},

			getSource: function() {
				return this.oDummyUploadCollection;
			}

		};
		var errorResponseRaw =
			'<?xml version="1.0" encoding="utf-8"?><error xmlns=""><code>/IWFND/CM_COS/221</code><message xml:lang="en">Virus scan profile ZTEST is not active</message><innererror><application><component_id>SV-SMG-SUP</component_id><service_namespace>/SAP/</service_namespace><service_id>AI_CRM_GW_MYMESSAGE_SRV</service_id><service_version>0001</service_version></application><transactionid>34AAC781348411E7FFFFFFFFEBA94F5E</transactionid><timestamp>20170509072433.9489750</timestamp><Error_Resolution><SAP_Transaction>Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details</SAP_Transaction><SAP_Note>See SAP Note 1797736 for error analysis</SAP_Note></Error_Resolution><errordetails/></innererror></error>';

		var oDummyErrorEvent = {

			getParameters: function() {
				return {
					getParameter: function(paramName) {

						switch (paramName) {

							case "status":
								return 400;

							case "responseRaw":
								return errorResponseRaw;

						}

					}
				};

			},

			getSource: function() {
				return this.oDummyUploadCollection;
			}

		};

		var oDummyResponse = {
			results: [{

				"refGuid": "dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7",
				"loioId": "loioId 1",
				"phioId": "phioId 1",
				"documentId": "refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201'",
				"fileName": "Problem_Desription.docx",
				"fileSize": "000000101276",
				"mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				"language": "E",
				"uploadDateFormatted": "uploadDateFormatted 1",
				"uploadDate": "/Date(1444035581000)/",
				"userName": "JACK",
				"contributor": "Max Mock",
				"document": "01110011010100111111111010011111",
				"thumbnailUrl": "thumbnailUrl 1",
				"enableEdit": false,
				"enableDelete": true,
				"visibleDelete": true,
				"visibleEdit": false,
				"url": "url 1",
				"__metadata": {
					"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201')",
					"type": "AI_CRM_GW_MYMESSAGE_SRV.Attachment"
				},
				"MessageResultSet": {
					"__deferred": {
						"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201')/MessageResultSet"
					}

				}
			}]

		};

		var array = [];

		this.controller.bundle = this.i18NModel.getResourceBundle();
		this.controller.onUploadComplete(oDummyEvent);
		ok(this.oDummyUploadCollection.getBusy(), "AttachmentCollection is busy");
		this.controller.oAttachmentSet = array;
		sinon.stub(this.controller, "addNewUploadCollectionItem").returns();
		this.callbacksForTest.success(oDummyResponse);
		ok(!this.oDummyUploadCollection.getBusy(), "AttachmentCollection is not busy");

		this.controller.onUploadComplete(oDummyEvent);
		this.callbacksForTest.error(oDummyResponse);
		ok(!this.oDummyUploadCollection.getBusy(), "AttachmentCollection is not busy");

		var array2 = [{
			"refGuid": "dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7",
			"loioId": "loioId 1",
			"phioId": "phioId 1",
			"documentId": "refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201'",
			"fileName": "Problem_Desription.docx",
			"fileSize": "000000101276",
			"mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"language": "E",
			"uploadDateFormatted": "uploadDateFormatted 1",
			"uploadDate": "/Date(1444035581000)/",
			"userName": "JACK",
			"contributor": "Max Mock",
			"document": "01110011010100111111111010011111",
			"thumbnailUrl": "thumbnailUrl 1",
			"enableEdit": false,
			"enableDelete": true,
			"visibleDelete": true,
			"visibleEdit": false,
			"url": "url 1",
			"__metadata": {
				"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201')",
				"type": "AI_CRM_GW_MYMESSAGE_SRV.Attachment"
			},
			"MessageResultSet": {
				"__deferred": {
					"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201')/MessageResultSet"
				}
			}

		}, {
			"refGuid": "dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b8",
			"loioId": "loioId 3",
			"phioId": "phioId 3",
			"documentId": "refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b7',loioId='loioId%201',phioId='phioId%201'",
			"fileName": "Image.jpg",
			"fileSize": "000001692276",
			"mimeType": "image/jpeg",
			"language": "E",
			"uploadDateFormatted": "uploadDateFormatted 1",
			"uploadDate": "/Date(1487955581000)/",
			"userName": "JACK",
			"contributor": "Max Mock",
			"document": "01110011010100111111111010011111",
			"thumbnailUrl": "thumbnailUrl 1",
			"enableEdit": false,
			"enableDelete": true,
			"visibleDelete": true,
			"visibleEdit": false,
			"url": "url 1",
			"__metadata": {
				"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b8',loioId='loioId%203',phioId='phioId%203')",
				"type": "AI_CRM_GW_MYMESSAGE_SRV.Attachment"
			},
			"MessageResultSet": {
				"__deferred": {
					"uri": "AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b8',loioId='loioId%203',phioId='phioId%20')/MessageResultSet"
				}
			}

		}];

		// Set another Attachment
		this.controller.oAttachmentSet = array2;
		this.controller.onUploadComplete(oDummyEvent);
		this.callbacksForTest.success(oDummyResponse);
		ok(!this.oDummyUploadCollection.getBusy(), "AttachmentCollection is not busy");

		this.controller.onUploadComplete(oDummyErrorEvent);
		var oMessageBox = sap.ui.getCore().byId("serviceErrorMessageBox");
		ok(oMessageBox, "MessageBox Dialog should be created");
		oMessageBox.destroy();

	});

	QUnit.test("on Post Event - Error", function() {

		var oDummyEvent = {

			getParameter: function(paramName) {

				switch (paramName) {
					case "value":
						return "DummyText";

				}
			},

			getSource: function() {
				return new sap.m.Button();
			}

		};

		this.controller.bundle = this.i18NModel.getResourceBundle();
		this.controller.onPost(oDummyEvent);
		ok(true);
		//ok(this.fakeView.notescntrl.getBusy(), "Feed List is busy");
		//this.callbacksForCreateTextTest.error();
		//ok(!this.fakeView.notescntrl.getBusy(), "Feed List is not busy");

	});

	QUnit.test("onInit", function() {
		sinon.stub(this.controller, "getRouter").returns({
			attachRoutePatternMatched: function() {},
			getRoute: function(routeId) {

				ok(routeId === "object", "Route with ID '" + routeId + "' registered for Pattern Match");

				return {
					attachPatternMatched: function() {}
				};
			},
			attachBypassed: function() {}
		});

		sinon.stub(this.controller, "getOwnerComponent").returns({
			getModel: jQuery.proxy(function(modelname) {

				switch (modelname) {

					case "i18n":
						return this.i18NModel;

					default:
						return {
							metadataLoaded: function() {
								return new jQuery.Deferred();

							}
						};
				}

			}, this),

			getEventBus: function() {

			}

		});

		this.stub(this.controller, "byId").withArgs("fileupload").returns(new sap.m.UploadCollection())
			.withArgs("attachmentFilter").returns(new sap.m.IconTabFilter())
			.withArgs("confirmButton").returns(new sap.m.Button())
			.withArgs("withdrawButton").returns(new sap.m.Button())
			.withArgs("notesList").returns(new sap.m.List())
			.withArgs("notesFilter").returns(new sap.m.IconTabFilter())
			.withArgs("feedInput").returns(new sap.m.FeedInput());

		this.stub(Formatter, "getPicture").returns();

		sap.ushell = {
			Container: {
				getService: function(service) {
					return {
						getUser: function() {
							return {
								getEmail: function() {
									return "DummyMail@dummy.com";
								}
							};
						}
					};

				}
			}
		};

		this.controller.onInit();

	});

	QUnit.test("on Confirm - Error", function() {
		
		var oMockEventBus = {
			publish : function(sIdentity, event) {
					equal(sIdentity, "zwx.sm.itsm.myincidents");
					equal(event, "confirmExecuted");
					ok(true, "Event 'confirmExecuted' published");
			}
		};


		this.controller.bundle = this.i18NModel.getResourceBundle();
		this.controller.Confirm = new sap.m.Dialog();
		this.DummyTextArea = new sap.m.TextArea("confirmText");
		this.DummyTextArea.setValue("confirm Text for Test");
		this.controller.onConfirmDialogYESButton();
		this.callbacksForCallFunction.error();

		this.controller._oEventBus = oMockEventBus;		
		this.callbacksForCallFunction.success();

	});

});