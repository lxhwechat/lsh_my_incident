sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"zwx/sm/itsm/myincidents/util/Util"
], function(UI5Object, MessageBox, Util) {
	"use strict";

	return UI5Object.extend("zwx.sm.itsm.myincidents.view.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias zwx.sm.itsm.myincidents.controller.view.ErrorHandler
		 */
		constructor: function(oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				this._showServiceError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function(oEvent) {
				var oParams = oEvent.getParameters();
				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though
				if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf(
						"Cannot POST") === 0)) {
					this._showServiceError(oParams.response);
				}
			}, this);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function(sDetails) {
			var errorMessage;
			if (Util._bMessageOpen) {
				return;
			}

			if (sDetails.statusCode === "400") {

				var errorDetail = JSON.parse(sDetails.responseText);
				if (errorDetail) {
					var errorCode = errorDetail.error.code;
					errorMessage = errorDetail.error.message.value;
				}

				switch (errorCode) {
					case "CRM_ORDER/013":

						break;
					default:

						break;
				}

				var errorText = Util.getError().text;
				var errorTitle = Util.getError().title;

				if (errorText) {
					this._sErrorText = errorText;
				}

			} else {
				errorMessage = sDetails;

			}

			Util.showErrorMessageBox(errorText, errorTitle, errorMessage);

		}
	});

});