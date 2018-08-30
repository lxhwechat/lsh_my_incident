/*global location */

sap.ui.define([
  "zwx/sm/itsm/myincidents/view/BaseController",
  "sap/ui/model/json/JSONModel",
  "zwx/sm/itsm/myincidents/util/Formatter",
  "zwx/sm/itsm/myincidents/util/Util",
  "zwx/sm/itsm/myincidents/view/ErrorHandler"
], function (BaseController, JSONModel, formatter, Util, ErrorHandler) {
  "use strict";

  return BaseController.extend("zwx.sm.itsm.myincidents.view.S3", {

    formatter: formatter,
    util: Util,

    _sIdentity: "zwx.sm.itsm.myincidents",

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    onInit: function () {
      // Model used to manipulate control states. The chosen values make sure,
      // detail page is busy indication immediately so there is no break in
      // between the busy indication for loading the view's meta data
      var oViewModel = new JSONModel({
        busy: false,
        delay: 0
      });

      this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

      this.setModel(oViewModel, "detailView");

      this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

      this._oEventBus = this.getOwnerComponent().getEventBus();
      //	var that = this;
      var oView = this.getView();

      // Get Ressource Model
      this.bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

      // Get UI Controls
      oView.attachmentCollection = this.byId("fileupload");
      oView.attachmentfltr = this.byId("attachmentFilter");
      oView.confirmButton = this.byId("confirmButton");
      oView.withdrawButton = this.byId("withdrawButton");
      oView.submitTextButton = this.byId("submitTextBtn");
      oView.notescntrl = this.byId("notesList");
      oView.notesfltr = this.byId("notesFilter");

      oView.feedinput = this.byId("feedInput");
      oView.richTextEditor = this.byId("richTextEditor");
      oView.detailForm = this.byId("detailForm");

      // UI Control Client Model - Batch Request Responses

      this.jsonModelTexts = new sap.ui.model.json.JSONModel();
      this.jsonModelStatusInfo = new sap.ui.model.json.JSONModel();

      // Json Model for QuickView
      this.oEmployeeModel = new sap.ui.model.json.JSONModel();

      // Set Model
      oView.notescntrl.setModel(this.jsonModelTexts);
      oView.confirmButton.setModel(this.jsonModelStatusInfo);
      oView.withdrawButton.setModel(this.jsonModelStatusInfo);

      // Util.setModel(oView.getModel());
      //Util.setBundle(this.bundle);

      // Icon in FeedInput
      //GetEmail
      if (typeof sap.ushell.Container !== "undefined") {
        oView.userEmail = sap.ushell.Container.getService("UserInfo").getUser().getEmail();
        //Get Picture from Jam and set Icon
        if (oView.userEmail) {
          oView.feedinput.setIcon(formatter.getPicture(oView.userEmail));
        }
      }
    },

    /* =========================================================== */
    /* event handlers                                              */
    /* =========================================================== */

    /**
     * Event handler when the share by E-Mail button has been clicked
     * @public
     */
    onShareEmailPress: function () {
      var oViewModel = this.getModel("detailView");

      sap.m.URLHelper.triggerEmail(
        null,
        oViewModel.getProperty("/shareSendEmailSubject"),
        oViewModel.getProperty("/shareSendEmailMessage")
      );
    },

    /**
     * Event handler when the share in JAM button has been clicked
     * @public
     */
    onShareInJamPress: function () {
      var oViewModel = this.getModel("detailView"),
        oShareDialog = sap.ui.getCore().createComponent({
          name: "sap.collaboration.components.fiori.sharing.dialog",
          settings: {
            object: {
              id: location.href,
              share: oViewModel.getProperty("/shareOnJamTitle")
            }
          }
        });

      oShareDialog.open();
    },

    /* =========================================================== */
    /* begin: internal methods                                     */
    /* =========================================================== */

    /**
     * Binds the view to the object path and expands the aggregated line items.
     * @function
     * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
     * @private
     */
    _onObjectMatched: function (oEvent) {

      var sObjectId = oEvent.getParameter("arguments").objectId;
      this.getModel().metadataLoaded().then(function () {
        var sObjectPath = this.getModel().createKey("MessageResultSet", {
          Guid: sObjectId
        });
        this._bindView("/" + sObjectPath);
      }.bind(this));

      var oView = this.getView();

      /**
       * @ControllerHook [Hook to update/initialize Detail data]
       *
       * This hook is called after the Route "Detail" is called
       * and the route pattern matched
       * This happens in the onInit Method of the Details Page Controller
       * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnDetailContextUpdate
       * @param {sap.ca.scfld.md.controller.BaseDetailController} Detail Controller
       * @return {void}  ...
       */
      if (this.extHookOnDetailContextUpdate) { // check whether any extension has implemented the hook...
        this.extHookOnDetailContextUpdate(oView); // ...and call it
      }

    },

    /**
     * Binds the view to the object path. Makes sure that detail view displays
     * a busy indicator while data for the corresponding element binding is loaded.
     * @function
     * @param {string} sObjectPath path to the object to be bound to the view.
     * @private
     */
    _bindView: function (sObjectPath) {

      //		var that = this;
      // Set busy indicator during view binding
      var oViewModel = this.getModel("detailView");
      var oView = this.getView();

      oView.textPath = sObjectPath + "/TextSet";
      oView.attachmentPath = sObjectPath + "/AttachmentSet";
      oView.textcountPath = sObjectPath + "/$count";
      oView.attachmentcountPath = sObjectPath + "/$count";
      oView.statusinfopath = sObjectPath;
      oView.statusinfopath = oView.statusinfopath.replace("MessageResultSet", "StatusSet");
      oView.sPath = sObjectPath;
      this.jsonModelAttachments = new sap.ui.model.json.JSONModel();

      // Clear all attachments first

      // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
      oViewModel.setProperty("/busy", false);

      this.getView().bindElement({
        path: sObjectPath,
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            oViewModel.setProperty("/busy", true);
          },
          dataReceived: function () {
            oViewModel.setProperty("/busy", false);
          }
        }
      });

      this.readTexts();
      this.readAttachments(oView);
      this.readStatusInfo(oView);

    },

    readTexts: function (sPath) {
      var that = this;

      var fnSuccess = function (oResponse) {

        that.getView().notescntrl.setBusy(false);
        that.oTextSet = oResponse.results;

        that.jsonModelTexts.setData({
          TextSet: that.oTextSet
        });

        that.oView.notesfltr.setCount(that.oTextSet.length);

      };

      var fnError = function (oResponse) {
        that.oView.notescntrl.setBusy(false);
      };

      this.getView().notescntrl.setBusy(true);
      this.getModel().read(this.getView().textPath, {
        success: fnSuccess,
        error: fnError
      });

    },

    setStausInfo: function (controller, StatusSet) {
      // Enable/Disable Upload Endabled
      controller.oView.attachmentCollection.setUploadEnabled(StatusSet.EnableUpload);

      // Set Confirm Button Properties
      controller.oView.confirmButton.setEnabled(StatusSet.EnableConfirm);
      controller.oView.confirmButton.setType(StatusSet.ButtonTypeConfirm);
      controller.oView.confirmButton.setVisible(StatusSet.VisibleConfirm);
      controller.oView.confirmButton.setText(controller.bundle.getText("BUTTON_CONFIRM"));

      // Set Withdraw Button Properties
      controller.oView.withdrawButton.setEnabled(StatusSet.EnableWithdraw);
      controller.oView.withdrawButton.setType(StatusSet.ButtonTypeWithdraw);
      controller.oView.withdrawButton.setVisible(StatusSet.VisibleWithdraw);
      controller.oView.withdrawButton.setText(controller.bundle.getText("BUTTON_WITHDRAW"));

      var textMode = StatusSet.TextMode;

      if (textMode === "H") {
        if (controller.oView.richTextEditor.getVisible() === false) {
          controller.oView.richTextEditor.setVisible(true);
          controller.oView.submitTextButton.setVisible(true);
        }
        controller.oView.feedinput.setVisible(false);
      } else {
        controller.oView.richTextEditor.setVisible(false);
        controller.oView.submitTextButton.setVisible(false);
        if (controller.oView.feedinput.getVisible() === false) {
          controller.oView.feedinput.setVisible(true);
        }
      }

    },

    readStatusInfo: function () {

      var that = this;

      var fnSuccess = function (oResponse) {

        //	that.getView().notescntrl.setBusy(false);
        that.oStatusSet = oResponse;

        that.setStausInfo(that, oResponse);

        // // Enable/Disable Upload Endabled
        // that.oView.attachmentCollection.setUploadEnabled(that.oStatusSet.EnableUpload);

        // // Set Confirm Button Properties
        // that.oView.confirmButton.setEnabled(that.oStatusSet.EnableConfirm);
        // that.oView.confirmButton.setType(that.oStatusSet.ButtonTypeConfirm);
        // that.oView.confirmButton.setVisible(that.oStatusSet.VisibleConfirm);
        // that.oView.confirmButton.setText(that.bundle.getText("BUTTON_CONFIRM"));

        // // Set Withdraw Button Properties
        // that.oView.withdrawButton.setEnabled(that.oStatusSet.EnableWithdraw);
        // that.oView.withdrawButton.setType(that.oStatusSet.ButtonTypeWithdraw);
        // that.oView.withdrawButton.setVisible(that.oStatusSet.VisibleWithdraw);
        // that.oView.withdrawButton.setText(that.bundle.getText("BUTTON_WITHDRAW"));

      };

      var fnError = function (oResponse) {

      };

      this.getModel().read(that.oView.statusinfopath, {
        success: fnSuccess,
        error: fnError
      });

    },

    onPost: function (oEvent) {

      var that = this;


      var sValue = oEvent.getParameter("value");

      var entity = {
        TextString: sValue
      };

      var fnSuccess = function (oResponse) {

        var oCtx = that.getView().getBindingContext();
        //	var path = oCtx.sPath + "?$expand=StatusSet";

        that.oTextSet.unshift(oResponse);
        that.getView().notescntrl.setBusy(false);
        //this.readAttachmentsFromBackend(true);

        that.jsonModelTexts.setData({
          TextSet: that.oTextSet
        });

        that.oView.notesfltr.setCount(that.oTextSet.length);

        that.getView().getModel().read(oCtx.sPath, {
          urlParameters: {
            "$expand": "StatusSet"
          },
          success: function (oResp) {
            that.getView().getModel().updateBindings();
            that.setStausInfo(that, oResp.StatusSet);
          }
        });

        sap.m.MessageToast.show(that.bundle.getText("TEXT_POST_SUCCESS"));

      };

      this.getView().notescntrl.setBusy(true);
      this.getView().getModel().create(this.getView().textPath, entity, {
        success: fnSuccess,
        error: jQuery.proxy(function (response) {
          that.getView().notescntrl.setBusy(false);
          Util.setError(this.bundle.getText("TEXT_POST_FAILURE_LOCK"), this.bundle.getText("TEXT_POST_FAILURE"));
          // 	Util.oDataServiceErrorHandling(this, this.bundle, response, this.bundle.getText("TEXT_POST_FAILURE"));
        }, this)

      });

    },

    readAttachments: function (oView) {
      var that = this;

      // set the upload URL for the current Incident
      if (this.getView().attachmentCollection.getUploadEnabled()) {
        oView.attachmentCollection.setUploadUrl(oView.getModel().sServiceUrl + oView.attachmentPath);
      }

      this.jsonModelAttachments = new sap.ui.model.json.JSONModel();
      oView.attachmentCollection.setModel(this.jsonModelAttachments);

      // Clear all attachments first
      oView.attachmentCollection.removeAllItems();
      oView.attachmentCollection.aItems = [];

      var fnSuccess = function (oResponse) {

        that.oView.attachmentCollection.setBusy(false);
        that.oAttachmentSet = oResponse.results;

        that.setAttachments(that, that.oAttachmentSet);

        // $.each(that.oAttachmentSet, function(index, value) {
        // 	that.oAttachmentSet[index].url = value.__metadata.media_src;
        // 	that.oAttachmentSet[index].documentId = "refGuid=guid'" + value.refGuid + "',loioId='" + value.loioId + "',phioId='" + value.phioId +
        // 		"'";

        // 	var oFile = value;

        // 	/**
        // 	 * @ControllerHook [Change UploadCollection Item data]
        // 	 *
        // 	 * This hook is called when the Attachment Collection is build up.
        // 	 * For each item in the Upload Collection (Attachment Tab) this hook will be called
        // 	 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookUploadCollectionItemData
        // 	 * @param {Array} oFile
        // 	 * @return {void}  ...
        // 	 */
        // 	if (this.extHookUploadCollectionItemData) { // check whether any extension has implemented the hook...
        // 		this.extHookUploadCollectionItemData(oFile); // ...and call it
        // 	}

        // });

        // that.jsonModelAttachments.setData({
        // 	AttachmentSet: that.oAttachmentSet
        // });

        // that.oView.attachmentfltr.setCount(that.oAttachmentSet.length);

        //that.setAttachmentBinding();
      };

      var fnError = function (oResponse) {
        that.oView.attachmentCollection.setBusy(false);
      };

      oView.attachmentCollection.setBusy(true);
      oView.getModel().read(oView.attachmentPath, {
        success: fnSuccess,
        error: fnError
      });

    },

    setAttachments: function (controller, AttachmentSet) {

      $.each(AttachmentSet, function (index, value) {
        AttachmentSet[index].url = value.__metadata.media_src;
        AttachmentSet[index].documentId = "refGuid=guid'" + value.refGuid + "',loioId='" + value.loioId + "',phioId='" + value.phioId +
          "'";

        var oFile = value;

        /**
         * @ControllerHook [Change UploadCollection Item data]
         *
         * This hook is called when the Attachment Collection is build up.
         * For each item in the Upload Collection (Attachment Tab) this hook will be called
         * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookUploadCollectionItemData
         * @param {Array} oFile
         * @return {void}  ...
         */
        if (this.extHookUploadCollectionItemData) { // check whether any extension has implemented the hook...
          this.extHookUploadCollectionItemData(oFile); // ...and call it
        }

      });

      controller.jsonModelAttachments.setData({
        AttachmentSet: AttachmentSet
      });

      controller.oView.attachmentfltr.setCount(AttachmentSet.length);
    },

    onPressSender: function (oEvent) {

      var oSourceItem = oEvent.getSource();

      var oEmpConfig = {
        pages: [{

          header: this.bundle.getText("CONTACT_INFO"),
          icon: oSourceItem.getIcon(),
          title: oSourceItem.getSender(),
          description: oSourceItem.data("department"),
          groups: [{
            heading: this.bundle.getText("CONTACT_DETAILS"),
            elements: [{
              label: this.bundle.getText("MOBILE"),
              value: oSourceItem.data("contactmobile"),
              elementType: sap.m.QuickViewGroupElementType.mobile
            }, {
              label: this.bundle.getText("PHONE"),
              value: oSourceItem.data("contactphone"),
              elementType: sap.m.QuickViewGroupElementType.phone
            }, {
              label: this.bundle.getText("EMAIL"),
              value: oSourceItem.data("email"),
              emailSubject: oSourceItem.data("emailsubject"),
              elementType: sap.m.QuickViewGroupElementType.email
            }]
          }, {
            heading: this.bundle.getText("COMPANY"),
            elements: [{
              label: this.bundle.getText("NAME"),
              value: oSourceItem.data("company")
              // url: "http://www.sap.com",
              // type: sap.m.QuickViewGroupElementType.link
            }, {
              label: this.bundle.getText("ADDRESS"),
              value: oSourceItem.data("companyaddress")
            }]
          }]
        }]
      };

      /**
       * @ControllerHook [Change Contact Information]
       * This hook is called when the quick overview of the Sender of text is shown
       * Here the displayed data can be modified
       * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookContactPopoverData
       * @param {Object} oEmpConfig
       * @return {void}  ...
       */
      if (this.extHookContactPopoverData) { // check whether any extension has implemented the hook...
        this.extHookContactPopoverData(oEmpConfig); // ...and call it
      }

      this.oEmployeeModel.setData(oEmpConfig);
      this.createPopover(this.oEmployeeModel);

      // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
      var oButton = oEvent.getSource()._oLinkControl;
      jQuery.sap.delayedCall(0, this, function () {
        this._oQuickView.openBy(oButton);
      });

    },

    createPopover: function (oModel) {
      if (!this._oQuickView) {
        this._oQuickView = sap.ui.xmlfragment("zwx.sm.itsm.myincidents.view.fragments.QuickView", this);
        this._oQuickView.setModel(oModel);
        this._oQuickView.setPlacement(sap.m.PlacementType.HorizontalPreferedLeft);
        this.getView().addDependent(this._oQuickView);
      }
    },

    // onQuickViewClose: function(oEvent) {
    // 	oEvent.getSource().destroy();

    // },

    // setAttachmentBinding: function() {

    // 	var oView = this.getView();
    // 	// Attachments

    // 	oView.attachmentCollection.bindAggregation("items", ({
    // 		path: "/AttachmentSet",
    // 		template: new sap.m.UploadCollectionItem({
    // 			documentId: "{documentId}",
    // 			mimeType: "{mimeType}",
    // 			fileName: "{fileName}",
    // 			enableDelete: "{enableDelete}",
    // 			enableEdit: "{enableEdit}",
    // 			visibleEdit: "{visibleEdit}",
    // 			visibleDelete: "{visibleDelete}",
    // 			url: "{url}",
    // 			attributes: [{
    // 				"title": this.bundle.getText("UPLOADED_BY"),
    // 				"text": "{contributor}"
    // 			}, {
    // 				"title": this.bundle.getText("UPLOADED_ON"),
    // 				"text": "{path: 'uploadDate',formatter: '.util.dateTime'}"
    // 			}, {
    // 				"title": this.bundle.getText("FILE_SIZE"),
    // 				"text": "{path: 'fileSize',formatter: '.util.formatFileSizeAttribute'}"
    // 			}]
    // 		})
    // 	}));

    // },

    onChange: function (oEvent) {
      //r oView = this.getView();
      var oModel = this.getModel();
      var oUploadCollection = oEvent.getSource();

      var token = this.sToken || oModel.getSecurityToken();

      // If filename exceeds 40 characters, trim it
      var filename = oEvent.getParameter("mParameters").files[0].name;
      if (filename.length > 40) {
        var aFilenameParts = filename.split(".");
        if (aFilenameParts.length === 1) {
          filename = filename.substring(0, 40);
        } else {
          var filenameExtension = aFilenameParts[aFilenameParts.length - 1];
          aFilenameParts = aFilenameParts.slice(0, aFilenameParts.length - 1);
          var remainingCharacters = 39 - filenameExtension.length;
          filename = aFilenameParts.join(".").substring(0, remainingCharacters) + "." + filenameExtension;
        }
      }
      /* eslint-disable JS_ODATA_MANUAL_TOKEN */
      // Header Token
      var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
        name: "x-csrf-token",
        value: token
      });
      /* eslint-enable JS_ODATA_MANUAL_TOKEN */
      oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

      // Header Content-Disposition
      var oCustomerHeaderContentDisp = new sap.m.UploadCollectionParameter({
        name: "content-disposition",
        value: "inline; filename=\"" + encodeURIComponent(filename) + "\""
      });
      oUploadCollection.addHeaderParameter(oCustomerHeaderContentDisp);
    },

    onUploadComplete: function (oEvent) {
      var that = this;
      var fnSuccess = function (oResponse) {

        var hasDocumentId = function (a, docId) {
          for (var i = 0, len = a.length; i < len; i++) {
            if (decodeURI(a[i].documentId) === docId) {
              return true;
            }
          }
        };

        var addedAttachments = [];

        $.each(oResponse.results, function (index, value) {
          oResponse.results[index].url = value.__metadata.media_src;
          oResponse.results[index].documentId = "refGuid=guid'" + value.refGuid + "',loioId='" + value.loioId + "',phioId='" + value.phioId +
            "'";

          if (hasDocumentId(that.oAttachmentSet, oResponse.results[index].documentId)) {
            // nothing to check
          } else {
            addedAttachments.push(oResponse.results[index]);
          }

        });

        $.each(addedAttachments, function (index, value) {
          that.addNewUploadCollectionItem(that.getView().attachmentCollection, value);
        });

        that.getView().attachmentfltr.setCount(that.oAttachmentSet.length);
        that.getView().attachmentCollection.setBusy(false);

      };

      var fnError = function (oResponse) {
        that.getView().attachmentCollection.setBusy(false);
      };

      if (oEvent.getParameters().getParameter("status") !== 201) // Bad request
      {
        var errorMsg = $($.parseXML(oEvent.getParameters().getParameter("responseRaw"))).find("message").text();
        that.getView().attachmentCollection.setBusy(false);
        Util.showErrorMessageBox(that.bundle.getText("ERROR_CONTACT_SYSADMIN"), that.bundle.getText("ATTACHMENT_UPLOAD_ERROR"), errorMsg);

      } else {

        this.getView().attachmentCollection.setBusy(true);
        this.getView().getModel().read(this.getView().attachmentPath, {
          success: fnSuccess,
          error: fnError
        });
        sap.m.MessageToast.show(this.bundle.getText("ATTACHMENT_UPLOAD_SUCCESS"));
      }
    },

    onDeleteFile: function (oEvent) {

      var that = this;
      var parameters = oEvent.getParameters();
      that.docIdToDelete = parameters.documentId;
      var removStartVal = "";
      removStartVal = parameters.documentId + ")";
      var path = "/AttachmentSet(";
      var url = path + removStartVal;
      var oView = this.getView();

      var fnError = function (oResponse) {
        Util.setError(that.bundle.getText("ATTACHMENT_DELETE_FAILURE"), that.bundle.getText("ATTACHMENT_DELETE_FAILURE"));
        that.oView.attachmentCollection.setBusy(false);
        sap.m.MessageToast.show(that.bundle.getText("ATTACHMENT_DELETE_FAILURE"));
      };

      var fnSuccess = function (oResponse) {

        var oModel = oView.attachmentCollection.getModel();
        var oData = oModel.getData();
        var aItems = oData.AttachmentSet;
        var bSetData = false;

        jQuery.each(aItems, function (index) {
          if (aItems[index] && aItems[index].documentId === that.docIdToDelete) {
            aItems.splice(index, 1);
            bSetData = true;

          }
        });
        if (bSetData === true) {
          oModel.setData(oData);
          oView.attachmentCollection.setModel(oModel);
          oModel.updateBindings(true);

          // Add 1 to fileupload count
          var newCount = parseInt(oView.attachmentfltr.getCount(), 10);
          newCount = newCount - 1;
          oView.attachmentfltr.setCount(newCount);

          sap.m.MessageToast.show(that.bundle.getText("ATTACHMENT_DELETE_SUCCESS"));
        }

        that.oView.attachmentCollection.setBusy(false);

      };

      oView.attachmentCollection.setBusy(true);
      oView.getModel().remove(url, {
        success: fnSuccess,
        error: fnError
      });
    },

    addNewUploadCollectionItem: function (oUploadCollection, item) {

      var oData = oUploadCollection.getModel().getData();
      var aItems = jQuery.extend(true, {}, oData).AttachmentSet;

      var oItem = {
        documentId: item.documentId,
        mimeType: item.mimeType,
        fileName: item.fileName,
        enableDelete: item.enableDelete,
        enableEdit: item.enableEdit,
        visibleEdit: item.visibleEdit,
        visibleDelete: item.visibleDelete,
        url: item.url,
        contributor: item.contributor,
        uploadDate: item.uploadDate,
        fileSize: item.fileSize
      };

      aItems.unshift(oItem);
      oUploadCollection.getModel().setData({
        "AttachmentSet": aItems
      });

      this.oAttachmentSet = aItems;

    },

    openDialog: function (sType) {

      var oView = this.getView();

      if (!this[sType]) {
        this[sType] = sap.ui.xmlfragment(
          "zwx.sm.itsm.myincidents.view.fragments." + sType + "Dialog",
          this // associate controller with the fragment
        );
        this.getView().addDependent(this[sType]);
        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this[sType]);

      }

      this[sType].bindElement(oView.sPath);
      this[sType].open();
    },

    onConfirmDialogYESButton: function () {

      // Close Confirm PopUp
      this.Confirm.close();
      var oView = this.getView();
      var that = this;

      this._busyConfirmDialog = Util.getBusyDialog("busyPopoverConfirm", this.bundle.getText(
        "CONFIRMING_IN_PROGRESS"), oView, this);
      this._busyConfirmDialog.open();

      var guid = Util.getGuidFromPath(oView.sPath);

      var comment = sap.ui.getCore().byId("confirmText").getValue();
      comment = jQuery.sap.encodeURL(comment);

      var url = "/confirmIncident";

      this.getView().getModel().
      callFunction(url, {
          method: "GET",
          urlParameters: {
            Guid: guid,
            Comments: comment
          },
          success: // Success

            // Success
            function (oData) {
              // Broadcast the information about the successfull withdraw action. Actually, only master view is listening.

              that._oEventBus.publish(that._sIdentity, "confirmExecuted");
              if (sap.ui.Device.system.phone) { // When the app is being used on a phone leave detail screen and go back to master
                that.getRouter().navTo("master", {}, true);
              }
            },

          // Error
          error: jQuery.proxy(function (response) {
            this._busyConfirmDialog.close();
            Util.setError(this.bundle.getText("TEXT_POST_FAILURE_LOCK"), this.bundle.getText("CONFIRM_FAILURE"));
            // Util.oDataServiceErrorHandling(this, this.bundle, response, );
          }, this)
        }

      );

      var empty = "";
      sap.ui.getCore().byId("confirmText").setValue(empty);

    },

    onWithdrawDialogYESButton: function () {
      // Close Withdraw PopUp
      this.Withdraw.close();
      var oView = this.getView();
      var that = this;

      this._WithdrawDialog = Util.getBusyDialog("busyPopoverWithdraw", this.bundle.getText(
        "WITHDRAWING_IN_PROGRESS"), oView, this);
      this._WithdrawDialog.open();

      var guid = Util.getGuidFromPath(oView.sPath);

      var comment = sap.ui.getCore().byId("withdrawText").getValue();
      comment = jQuery.sap.encodeURL(comment);

      var url = "/withdrawIncident";

      this.getView().getModel().
      callFunction(url, {
        method: "GET",
        urlParameters: {
          Guid: guid,
          Comments: comment
        },
        success: // Success
          function (oData) {

            // Broadcast the information about the successfull withdraw action. Actually, only master view is listening.
            that._oEventBus.publish(that._sIdentity, "withdrawExecuted");
            if (sap.ui.Device.system.phone) { // When the app is being used on a phone leave detail screen and go back to master
              sap.ui.core.UIComponent.getRouterFor(this).navTo("toMaster", {}, true);
            }

          },
        error: jQuery.proxy(function (response) {
          this._WithdrawDialog.close();
          Util.setError(this.bundle.getText("TEXT_POST_FAILURE_LOCK"), this.bundle.getText("WITHDRAW_FAILURE"));
          //	Util.oDataServiceErrorHandling(this, this.bundle, response, this.bundle.getText("WITHDRAW_FAILURE"));
        }, this)

      });

      var empty = "";
      sap.ui.getCore().byId("withdrawText").setValue(empty);

    },

    onWithdrawDialogNOButton: function () {
      this.Withdraw.close();
      var empty = "";
      sap.ui.getCore().byId("withdrawText").setValue(empty);
    },

    onConfirmDialogNOButton: function () {
      this.Confirm.close();
      var empty = "";
      sap.ui.getCore().byId("confirmText").setValue(empty);
    },

    onConfirm: function () {
      this.openDialog("Confirm");
    },

    onWithdraw: function () {
      this.openDialog("Withdraw");
    },

    _onBindingChange: function () {
      var oView = this.getView(),
        oElementBinding = oView.getElementBinding();

      // No data for the binding
      if (!oElementBinding.getBoundContext()) {
        this.getRouter().getTargets().display("detailObjectNotFound");
        // if object could not be found, the selection in the master list
        // does not make sense anymore.
        this.getOwnerComponent().oListSelector.clearMasterListSelection();
        return;
      }

      var sPath = oElementBinding.getPath(),
        oResourceBundle = this.getResourceBundle(),
        oObject = oView.getModel().getObject(sPath),
        sObjectId = oObject.ObjectId,
        sObjectName = oObject.Description,
        oViewModel = this.getModel("detailView");

      this.getOwnerComponent().oListSelector.selectAListItem(sPath);

      oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
      oViewModel.setProperty("/shareOnJamTitle", sObjectName);
      oViewModel.setProperty("/shareSendEmailSubject",
        oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
      oViewModel.setProperty("/shareSendEmailMessage",
        oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
    },

    _onMetadataLoaded: function () {
      // Store original busy indicator delay for the detail view
      var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
        oViewModel = this.getModel("detailView");

      // Make sure busy indicator is displayed immediately when
      // detail view is displayed for the first time
      oViewModel.setProperty("/delay", 0);

      // Binding the view will set it to not busy - so the view is always busy if it is not bound
      oViewModel.setProperty("/busy", true);
      // Restore original busy indicator delay for the detail view
      oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
    },

  });

});
