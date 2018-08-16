sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"zwx/sm/itsm/myincidents/model/models",
		"zwx/sm/itsm/myincidents/view/ListSelector",
		"zwx/sm/itsm/myincidents/view/ErrorHandler",
		"zwx/sm/itsm/myincidents/util/Formatter",
		"zwx/sm/itsm/myincidents/util/Util"
	], function (UIComponent, Device, models, ListSelector, ErrorHandler, Formatter, Util) {
		"use strict";

		return UIComponent.extend("zwx.sm.itsm.myincidents.Component", {

			metadata : {
				manifest : "json"
			},

			/**
			 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
			 * In this method, the FLP and device models are set and the router is initialized.
			 * @public
			 * @override
			 */
			init : function () {
				this.oListSelector = new ListSelector();
				this._oErrorHandler = new ErrorHandler(this);

				// set the device model
				this.setModel(models.createDeviceModel(), "device");
				// set the FLP model
				this.setModel(models.createFLPModel(), "FLP");

				// call the base component's init function and create the App view
				UIComponent.prototype.init.apply(this, arguments);

				// create the views based on the url/hash
				this.getRouter().initialize();
				
				Formatter.init();
				Util.init();
			},

			/**
			 * The component is destroyed by UI5 automatically.
			 * In this method, the ListSelector and ErrorHandler are destroyed.
			 * @public
			 * @override
			 */
			destroy : function () {
				this.oListSelector.destroy();
				this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			}


		});

	}
);