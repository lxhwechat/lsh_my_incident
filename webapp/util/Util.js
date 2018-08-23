sap.ui.define([
	"zwx/sm/itsm/myincidents/util/Util",
	"sap/ui/Device",
	"sap/m/MessageBox"
], function(util, Device, MessageBox) {
	"use strict";

	return {
		util: util,
		init: function() {

			this.busyDialogBuffer = [];
			this.createdObejctId = "";
			this.createdObejctGuid = "";
			this.inAppCreation = true;
			this.checkCreationMode();
			this._sError = {
				text: undefined,
				title: undefined
			};

		},

		checkCreationMode: function() {
			var that = this;
			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				// Check if Navaigation to Create Incident App is supported
				oCrossAppNavigator.isNavigationSupported([{
					target: {
						semanticObject: "Action",
						action: "SMCreateIncident"
					}
				}]).done(function(aResponses) {
					if (aResponses[0].supported === true) {
						that.setInAppCreation(false);
					} else {
						that.setInAppCreation(true);
					}
				}).fail(function() {
					that.setInAppCreation(true);
				});

				// } else {

				// this.setInAppCreation(true);

				// }
				//   }
				// , this));

			}
		},
		// getRefreshUIObject: function(oModel, contextPath, expand) {

		// 	if (!this.refreshList) {
		// 		this.refreshList = new sap.m.List();
		// 	} else {
		// 		this.refreshList.unbindElement();
		// 		this.refreshList.setModel(null);
		// 	}

		// 	var oList = this.refreshList;

		// 	if (expand) {
		// 		oList.bindElement(contextPath, {
		// 			expand: expand
		// 		});
		// 	} else {
		// 		oList.bindElement(contextPath);
		// 	}
		// 	oList.setModel(oModel);
		// 	var oBinding = oList.getElementBinding();

		// 	var fnCleanUp = null;
		// 	fnCleanUp = jQuery.proxy(function(response) {
		// 		if (oBinding) {
		// 			oBinding.detachDataRequested(fnCleanUp);
		// 			oBinding = null;
		// 		}
		// 	}, this);
		// 	oBinding.attachDataRequested(fnCleanUp);

		// 	var oRefreshObject = {
		// 		refresh: function(fnDataReceived) {
		// 			if (fnDataReceived) {
		// 				oBinding.attachDataReceived(fnDataReceived);
		// 			}
		// 			if (oBinding) {
		// 				oBinding.refresh();
		// 			}
		// 		},
		// 		destroy: function() {
		// 			fnCleanUp();
		// 		}
		// 	};

		// 	return oRefreshObject;
		// },

		// splitString2Array: function(sStringOfFilenames, oContext) {
		// 	if (oContext.getMultiple() === true && !(sap.ui.Device.browser.msie && sap.ui.Device.browser.version <= 9)) {
		// 		sStringOfFilenames = sStringOfFilenames.substring(1, sStringOfFilenames.length - 2);
		// 	}
		// 	return sStringOfFilenames.split(/\" "/);
		// },

		// stringToBoolean: function(string) {
		// 	switch (string.toLowerCase()) {
		// 		case "true":
		// 		case "yes":
		// 		case "1":
		// 			return true;
		// 		case "false":
		// 		case "no":
		// 		case "0":
		// 		case null:
		// 			return false;
		// 		default:
		// 			return Boolean(string);
		// 	}
		// },

		// getUploadedFilesFromUploaderEvent: function(oEvent) {
		// 	var sUploadedFiles = oEvent.getSource().getProperty("value");
		// 	return Util.splitString2Array(sUploadedFiles, this);
		// },

		getDateAtMidnight: function(d, oDays) {
			var date = new Date(d);
			date.setDate(date.getDate() - oDays);
			date.setHours("00");
			date.setMinutes("00");
			date.setSeconds("00");
			date.setMilliseconds("00");

			return date;

		},

		setDateToMidnight: function(d) {

			d.setHours("00");
			d.setMinutes("00");
			d.setSeconds("00");
			d.setMilliseconds("00");

			return d;

		},

		getMonday: function(d) {
			var date = new Date(d);
			var day = date.getDay(),
				diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
			return new Date(date.setDate(diff));
		},

		getMondayLastWeek: function(d) {
			var date = this.getDateAtMidnight(this.getMonday(d), 7);
			return date;
		},

		getFirstDayOfCurrentMonth: function(d) {
			var date = new Date(d.getFullYear(), d.getMonth(), 1);
			return date;
		},

		getFirstDayOfPrevMonth: function(d) {
			var date = new Date(d.getFullYear(), d.getMonth() - 1, 1);
			return date;
		},

		getFirstDayOf2MonthsAgo: function(d) {
			var date = new Date(d.getFullYear(), d.getMonth() - 2, 1);
			return date;
		},

		getFirstDayOfCurrentYear: function(d) {
			var date = new Date(d.getFullYear(), 0, 1);
			return date;
		},

		getFirstDayOfPrevYear: function(d) {
			var date = new Date(d.getFullYear() - 1, 0, 1);
			return date;
		},

		// getModel: function() {
		// 	return this.oModel;
		// },
		// setModel: function(oModel) {
		// 	this.oModel = oModel;
		// },

		// getRouter: function() {
		// 	return this.oRouter;
		// },
		// setRouter: function(oRouter) {
		// 	this.oRouter = oRouter;
		// },

		// getGuidFromContext: function(Context) {
		// 	var guid = Context.split("(");
		// 	guid = guid[1].split(")");
		// 	guid = guid[0];

		// 	return guid;
		// },

		getGuidFromPath: function(Context) {
			var guid = Context.split("(");
			guid = guid[1].split("'");
			guid = guid[1];

			return guid;
		},

		// getBundle: function() {
		// 	return this.oBundle;
		// },
		// setBundle: function(oBundle) {
		// 	this.oBundle = oBundle;
		// },

		setInAppCreation: function(sBoolean) {
			this.inAppCreation = sBoolean;
		},
		getInAppCreation: function() {
			return this.inAppCreation;
		},

		getBusyDialog: function(id, oTitle, oView, context) {

			var oDialog;

			$.each(this.busyDialogBuffer, function(index, value) {
				if (value.id === id) {

					oDialog = {
						id: value.id,
						title: value.title,
						view: value.view,
						dialog: value.dialog

					};
				}
			});

			// instantiate dialog
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(id, "zwx.sm.itsm.myincidents.view.fragments.BusyDialog", context);
				oView.addDependent(oDialog);
				oDialog.setTitle(oTitle);
				jQuery.sap.syncStyleClass("sapUiSizeCompact", oView, oDialog);
				oDialog = {
					id: id,
					title: oTitle,
					view: oView,
					dialog: oDialog

				};

				this.busyDialogBuffer.push(oDialog);

			}

			return oDialog.dialog;

		},

		getItemsWithoutGroupHeader: function(oItems) {

			var newItems = [];

			$.each(oItems, function(index, value) {

				if (value.getId().indexOf("MAIN_LIST_ITEM") > -1)

				{
					newItems.push(value);
				}

			});
			return newItems;
		},

		setCreatedObjectId: function(ObjectId) {

			this.createdObejctId = ObjectId;
		},

		getCreatedObejctId: function(ObjectId) {
			return this.createdObejctId;
		},

		setError: function(sText, title) {
			this._sError.text = sText;
			this._sError.title = title;
		},

		getError: function() {
			return this._sError;
		},

		showErrorMessageBox: function( errorText, errorTitle, errorMessage) {

			if (errorTitle) {
				this._bMessageOpen = true;
				MessageBox.error(
					errorText, {
						title: errorTitle,
						id: "serviceErrorMessageBox",
						details: errorMessage,
						styleClass: this.getContentDensityClass(),
						actions: [MessageBox.Action.CLOSE],
							onClose : function () {
							this._bMessageOpen = false;
						}.bind(this)

					}
				);

			} else {

				this._bMessageOpen = true;
				MessageBox.error(
					errorText, {
						id: "serviceErrorMessageBox",
						details: errorMessage,
						styleClass: this.getContentDensityClass(),
						actions: [MessageBox.Action.CLOSE],
				onClose : function () {
							this._bMessageOpen = false;
						}.bind(this)


					}
				);

			}
		},


		dateTime: function(oDate) {
			var oDate2 = (oDate instanceof Date) ? oDate : new Date(oDate);
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd.MM.yyyy HH:mm"
			});
			return dateFormat.format(oDate2);
		},

		formatFileSizeAttribute: function(sValue) {
			jQuery.sap.require("sap.ui.core.format.FileSizeFormat");
			if (jQuery.isNumeric(sValue)) {
				return sap.ui.core.format.FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	};

});
