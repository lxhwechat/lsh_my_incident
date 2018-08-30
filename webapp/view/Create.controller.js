/*global history */
sap.ui.define([
	"zwx/sm/itsm/myincidents/view/BaseController",
	"sap/ui/core/routing/History",
	"zwx/sm/itsm/myincidents/util/Util",
	"sap/m/MessageBox"
], function(BaseController, History, Util, MessageBox) {
	"use strict";

	return BaseController.extend("zwx.sm.itsm.myincidents.view.Create", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		_sIdentity: "zwx.sm.itsm.myincidents",
		onInit: function() {
			var that = this;

			 this.getRouter().attachRoutePatternMatched(function(oEvent) {
				// when create navigation occurs, initialize  the create form
				if (oEvent.getParameter("name") === "toCreate") {
					that.initializeCreateForm();
					// Set default Priority
					that.setDefaultPriority();
				}
			});

			//get  Controls
			this.oTitleControl = this.byId("ShortTextInput");
			this.oPrioSelect = this.byId("PrioritySelect");
			this.oDescriptionTextArea = this.byId("DescriptionTextArea");
			this.oComponentInput = this.byId("ComponentInput");
			this.aFilterStack = [];
			this.mClearModel = false;

			this.jModel = new sap.ui.model.json.JSONModel({
				title: "",
				component: "",
				description: ""
			});

			this.oTitleControl.setModel(this.jModel);
			this.oComponentInput.setModel(this.jModel);
			this.oDescriptionTextArea.setModel(this.jModel);

			// attach handlers for validation errors
			sap.ui.getCore().attachValidationError(function(evt) {
				var control = evt.getParameter("element");
				if (control && control.setValueState) {
					control.setValueState("Error");
				}
			});
			// sap.ui.getCore().attachValidationSuccess(function(evt) {
			// 	var control = evt.getParameter("element");
			// 	if (control && control.setValueState) {
			// 		control.setValueState("None");
			// 	}
			// });

			/**
			 * @ControllerHook [Hook to update/initialize ]
			 *
			 * This hook is called in the onInit method of the create controller
			 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookCreateOnInit
			 * @param {sap.ca.scfld.md.controller.ScfldMasterController} Create View Controller
			 * @return {void}  ...
			 */
			if (this.extHookCreateOnInit) { // check whether any extension has implemented the hook...
				this.extHookCreateOnInit(this); // ...and call it
			}

		},

		initializeCreateForm: function() {
			this.jModel.setData({
				title: "",
				component: "",
				description: ""
			});

			var inputs = [
				this.oComponentInput,
				this.oTitleControl,
				this.oDescriptionTextArea
			];

			jQuery.each(inputs, function(i, input) {
				input.setValue("");
				input.setValueState("None");
			});

		},


		onAfterRendering: function() {
			this.initializeCreateForm();
		},

		onSave: function() {

			var oView = this.getView();
			var that = this;
			var inputs = [
				// this.oComponentInput,
				this.oTitleControl
				// this.oDescriptionTextArea
			];

			// check that inputs are not empty
			// this does not happen during data binding as this is only triggered by changes
			jQuery.each(inputs, function(i, input) {
				if (!input.getValue()) {
					input.setValueState("Error");
				}
			});

			// check states of inputs
			var canContinue = true;

			if (this.oPrioSelect.getSelectedKey() === "1" && !this.oComponentInput.getValue()) {
				this.oComponentInput.setValueState("Error");
				//this.oComponentInput.openValueStateMessage();
				canContinue = false;
			}

			jQuery.each(inputs, function(i, input) {
				if (input.getValueState() === "Error") {
					canContinue = false;
					return false;
				}
			});

			/**
			 * @ControllerHook [Hook to validate Data before Save ]
			 *
			 * This hook is called in the onSave method of the create controller
			 * Beofore creating a message the system can validate the given inputs
			 * If the canContinue flag is set to TRUE the message gets saved
			 * @callback sap.ca.scfld.md.controller.ScfldMasterController~extHookOnCreateBeforeSaveValidation
			 * @param {boolean} canContinueFlag
			 * @return {void}  ...
			 */
			if (this.extHookOnCreateBeforeSaveValidation) { // check whether any extension has implemented the hook...
				this.extHookOnCreateBeforeSaveValidation(canContinue); // ...and call it
			}

			if (canContinue) {

				// 			// instantiate dialog
				// 			if (!this._dialog) {
				// 				this._dialog = sap.ui.xmlfragment("myIncidents.view.fragments.BusyDialog", this);
				// 				this.getView().addDependent(this._dialog);
				// 			}

				this._dialog = Util.getBusyDialog("busyPopoverSave", this.getResourceBundle().getText("CREATING_IN_PROGRESS"), oView, this);
				this._dialog.open();

				var
					oText = this.oDescriptionTextArea.getValue(),
					oComponent = this.oComponentInput.getValue(),
					oSubject = this.oTitleControl.getValue(),
					oPrio = this.oPrioSelect.getSelectedKey();

				// We want to avoid mandatory fields therfore:
				// If Description is empty - > copy over text from Title
				// Since "Description" is needed in /UI2/INTEROP Service

				if (oText === "") {
					oText = oSubject;
				}

				var
					sRelativeUrl = "Messages",
					oSupportTicketData = {
					text: oText,
					component: oComponent,
					subject: oSubject,
					priority: oPrio
				};

				var oDataWrapper = this.getUI2ODataWrapper();



				oDataWrapper.create(sRelativeUrl, oSupportTicketData,

					// Success
					function(response) {
						that.getModel().refresh();

						var objectID = response.messageNumber;
						Util.setCreatedObjectId(objectID);

						// Broadcast the information about the successfull withdraw action. Actually, only master view is listening.
						that.getEventBus().publish(that._sIdentity, "saveExecuted");

					},

					// Error
					function(sErrorMessage) {
						that._dialog.close();
						MessageBox.alert(sErrorMessage ,
						{
							title : that.getResourceBundle().getText("INCIDENT_CREATION_FAILURE"),
							id : "messageBoxSaveError"
						});
					});

			} else {

				MessageBox.alert(this.getResourceBundle().getText("COMPLETE_INPUT"));
			}

		},

		getUI2ODataWrapper: function() {
			var
				sBaseUrl = "/sap/opu/odata/UI2/INTEROP/",
				oDataWrapper;

				jQuery.sap.require("sap.ui2.srvc.ODataWrapper");
				jQuery.sap.require("sap.ui2.srvc.ODataService");
				oDataWrapper = new sap.ui2.srvc.ODataWrapper(sBaseUrl, this);
				sap.ui2.srvc.ODataService.call(this, oDataWrapper, function() {
					return false;
				});
			return oDataWrapper;
		},

		onNavToNextLevel: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			//var oNavCon = sap.ui.core.Fragment.byId("componentPopover", "navCon");
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);

			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oFilter = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.EQ, oEntity.CompID);
			this.aFilterStack.unshift(oFilter);

			if (this.aFilterStack.length >= 1) {
				oDetailPage.setShowNavButton(true);
			}

			jQuery.sap.delayedCall(100, this, function() {
				listBinding.filter([oFilter]);
			});

			//	oDetailPage.bindElement(oCtx.getPath());
		},

		// onTextAreaLiveChange: function() {

		// 	if (this.oDescriptionTextArea.getValue().length < 1) {
		// 		this.oDescriptionTextArea.setValueState("Error");
		// 	} else {
		// 		this.oDescriptionTextArea.setValueState("None");
		// 	}

		// },

		onTitleInputLiveChange: function() {

			if (this.oTitleControl.getValue().length < 1 || this.oTitleControl.getValue().length > 40)

			{
				this.oTitleControl.setValueState("Error");
			} else {
				this.oTitleControl.setValueState("None");
			}

		},

		onChangePriority: function() {

			if (this.oPrioSelect.getSelectedKey !== 1)

			{
				this.oComponentInput.setValueState("None");
			}

		},


		onComponentValueHelp: function(oEvent) {

			this._oPopover = sap.ui.xmlfragment("componentPopover", "zwx.sm.itsm.myincidents.view.fragments.ComponentPopover", this);
			this._oPopover.setModel(this.getView().getModel());
			this._oPopover.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");

			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oPopover);

			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			if (this.aFilterStack.length === 0) {
				oDetailPage.setShowNavButton(false);
			}

			// check if entry already exists to enable/disable "clear" button.
			var oClearButton = sap.ui.core.Fragment.byId("componentPopover", "clearButton");
			if (!oEvent.getSource().getValue()) {
				oClearButton.setEnabled(false);
			} else {
				oClearButton.setEnabled(true);
			}

			this._oPopover.open();

		},

		onComponentSearch: function(oEvent) {
			var searchedValue = oEvent.getParameter("newValue");
			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			if (searchedValue.length > 1) {
				//	var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
				//var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);

				oDetailPage.setShowNavButton(false);
				this.aFilterStack = [];
				var oFilter = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.Contains, searchedValue);
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilter]);
				});
			} else if (searchedValue.length === 0) {
				var oFilter2 = new sap.ui.model.Filter("CompID", sap.ui.model.FilterOperator.Contains, searchedValue);
				jQuery.sap.delayedCall(0, this, function() {
					listBinding.filter([oFilter2]);
				});
			}
		},

		onCompTitleClicked: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingContext();
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oEntity = oDetailPage.getModel().getData(oCtx.getPath(), oCtx);
			var oInput = this.byId("ComponentInput");
			oInput.setValue(oEntity.CompID);
			oInput.setValueState("None");
			this._oPopover.close();
			this.destroyPopover();

			//	oDetailPage.bindElement(oCtx.getPath());
		},

		onCompPopoverClear: function() {
			this._oPopover.close();
			this.destroyPopover();
			var oInput = this.byId("ComponentInput");
			oInput.setValue("");
			oInput.setValueState("None");

		},

		// onNavButtonPressCreate: function() {
		// 	if (sap.ui.Device.system.phone) {
		// 		this.oRouter.navTo("master");
		// 	} else {
		// 		this.oRouter.navTo("toDetail", true);
		// 	}
		// },

		onNavButtonPress: function() {
			var oDetailPage = sap.ui.core.Fragment.byId("componentPopover", "master");
			var oListDetail = sap.ui.core.Fragment.byId("componentPopover", "PopoverList");
			var listBinding = oListDetail.getBinding("items");

			if (this.aFilterStack.length > 1) {
				this.aFilterStack.shift();
				listBinding.filter([this.aFilterStack[0]]);
			} else {
				var oInitialFilter = [];
				oDetailPage.setShowNavButton(false);
				this.aFilterStack.shift();
				listBinding.filter(oInitialFilter);
			}
		},

		onPopoverCancel: function() {
			this._oPopover.close();
			this.destroyPopover();
		},

		onPopoverAfterClose: function() {

			this.destroyPopover();
		},

		destroyPopover: function() {

			if (sap.ui.core.Fragment.byId("componentPopover", "PopoverList")) {
				sap.ui.core.Fragment.byId("componentPopover", "PopoverList").destroy();
			}
			if (sap.ui.core.Fragment.byId("componentPopover", "closeButton")) {
				sap.ui.core.Fragment.byId("componentPopover", "closeButton").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "searchField")) {
				sap.ui.core.Fragment.byId("componentPopover", "searchField").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "componentListItem")) {
				sap.ui.core.Fragment.byId("componentPopover", "componentListItem").destroy();
			}

			if (sap.ui.core.Fragment.byId("componentPopover", "master")) {
				sap.ui.core.Fragment.byId("componentPopover", "master").destroy();
			}

			if (this._oPopover) {
				this._oPopover.destroy();
			}

			this.aFilterStack = [];

		},

		onAfterModelUpdate: function() {
			this._dialog.close();
		},

		setDefaultPriority: function() {
			if (this.oPrioSelect) {
				if (this.defaultPrio) {
					this.oPrioSelect.setSelectedKey(this.defaultPrio);

				} else {
					var that = this;
					var url = "/getDefaultPriority";

					this.getView().getModel().callFunction(url, {
						method: "GET",

						success: function(oData) {

							that.defaultPrio = oData.getDefaultPriority.defaultPrio;
							if (that.defaultPrio) {
								that.oPrioSelect.setSelectedKey(that.defaultPrio);
							}
						},
						error: function() {}
					});
				}

			}
		}



	});

});
