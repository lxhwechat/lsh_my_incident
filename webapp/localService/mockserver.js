sap.ui.define([
	"sap/ui/core/util/MockServer",
	"zwx/sm/itsm/myincidents/util/Formatter"
], function(MockServer, Formatter) {
	"use strict";

	var oMockServer,
		_sAppModulePath = "zwx/sm/itsm/myincidents/",
		_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		init: function() {
			var oUriParameters = jQuery.sap.getUriParameters(),
				sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
				sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
				sEntity = "MessageResultSet",
				sErrorParam = oUriParameters.get("errorType"),
				iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
				oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
				oMainDataSource = oManifest["sap.app"].dataSources.mainService,
				sMetadataUrl = jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
				// ensure there is a trailing slash
				sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

			oMockServer = new MockServer({
				rootUri: sMockServerUrl
			});

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: (oUriParameters.get("serverDelay") || 1000)
			});

			oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sJsonFilesUrl,
				bGenerateMissingMockData: true
			});

			var aRequests = oMockServer.getRequests(),
				fnResponse = function(iErrCode, sMessage, aRequest) {
					aRequest.response = function(oXhr) {
						oXhr.respond(iErrCode, {
							"Content-Type": "text/plain;charset=utf-8"
						}, sMessage);
					};
				};

			// aRequests.push({
			// 	method: "GET",
			// 	path: new new RegExp("filter=Concatstatuser"),

			// })

			aRequests.push({
				method: "GET",
				path: new RegExp("getDefaultPriority?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for getDefaultPrio");
					oXhr.readyState = 1;
					oXhr.respondJSON(200, {}, JSON.stringify({
						d: {
							getDefaultPriority: {
								defaultPrio: "3"
							}
						}
					}));

				}
			});

			aRequests.push({
				method: "POST",
				path: new RegExp(MockServer.prototype._escapeStringForRegExp(
					"MessageResultSet(guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512')/TextSet")),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for Text Post and locked Incident");

					oXhr.respondJSON(400, {}, JSON.stringify({
						"error": {
							"code": "CRM_ORDER/013",
							"message": {
								"lang": "en",
								"value": "Transaction 8000141797 is being processed by user SPENNEBERGA"
							},
							"innererror": {
								"application": {
									"component_id": "SV-SMG-SUP",
									"service_namespace": "/SAP/",
									"service_id": "AI_CRM_GW_MYMESSAGE_SRV",
									"service_version": "0001"
								},
								"transactionid": "80B157A6EB784F83A1F0196AC8840859",
								"timestamp": "20170421073243.8683680",
								"Error_Resolution": {
									"SAP_Transaction": "Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
									"SAP_Note": "See SAP Note 1797736 ",
									"Batch_SAP_Note": "See SAP Note 1869434 for details about working with $batch"
								},
								"errordetails": [{
									"code": "CRM_ORDER/013",
									"message": "Transaction 8000141797 is being processed by user SPENNEBERGA",
									"propertyref": "",
									"severity": "error",
									"target": "TEXT"
								}]
							}
						}
					}));

				}
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("withdrawIncident?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for withdraw");
					oXhr.respondJSON(200, {}, JSON.stringify({

						"d": {
							"withdrawIncident": {
								"__metadata": {
									"type": "AI_CRM_GW_MYMESSAGE_SRV.BAPIRET"
								},
								"Type": "E",
								"Id": "CRM_ORDER_MISC",
								"Number": "104",
								"MessageV1": "",
								"MessageV2": "",
								"MessageV3": "",
								"MessageV4": ""

							}
						}
					}));

				}
			});

			aRequests.push({
				method: "GET",
				path: RegExp(MockServer.prototype._escapeStringForRegExp(
					"withdrawIncident?Guid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512'") + "?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for withdraw");
					oXhr.respondJSON(400, {}, JSON.stringify({
						"error": {
							"code": "CRM_ORDER/013",
							"message": {
								"lang": "en",
								"value": "Transaction 8000141797 is being processed by user SPENNEBERGA"
							},
							"innererror": {
								"application": {
									"component_id": "SV-SMG-SUP",
									"service_namespace": "/SAP/",
									"service_id": "AI_CRM_GW_MYMESSAGE_SRV",
									"service_version": "0001"
								},
								"transactionid": "80B157A6EB784F83A1F0196AC8840859",
								"timestamp": "20170421073243.8683680",
								"Error_Resolution": {
									"SAP_Transaction": "Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
									"SAP_Note": "See SAP Note 1797736 ",
									"Batch_SAP_Note": "See SAP Note 1869434 for details about working with $batch"
								},
								"errordetails": [{
									"code": "CRM_ORDER/013",
									"message": "Transaction 8000141797 is being processed by user SPENNEBERGA",
									"propertyref": "",
									"severity": "error",
									"target": "TEXT"
								}]
							}
						}
					}));

				}
			});

			aRequests.push({
				method: "GET",
				path: new RegExp("confirmIncident?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for withdraw");
					oXhr.respondJSON(200, {}, JSON.stringify({

						"d": {
							"withdrawIncident": {
								"__metadata": {
									"type": "AI_CRM_GW_MYMESSAGE_SRV.BAPIRET"
								},
								"Type": "E",
								"Id": "CRM_ORDER_MISC",
								"Number": "104",
								"MessageV1": "",
								"MessageV2": "",
								"MessageV3": "",
								"MessageV4": ""

							}
						}
					}));

				}
			});

			aRequests.push({
				method: "GET",
				path: RegExp(MockServer.prototype._escapeStringForRegExp(
					"confirmIncident?Guid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c512'") + "?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for withdraw");
					oXhr.respondJSON(400, {}, JSON.stringify({
						"error": {
							"code": "CRM_ORDER/013",
							"message": {
								"lang": "en",
								"value": "Transaction 8000141797 is being processed by user SPENNEBERGA"
							},
							"innererror": {
								"application": {
									"component_id": "SV-SMG-SUP",
									"service_namespace": "/SAP/",
									"service_id": "AI_CRM_GW_MYMESSAGE_SRV",
									"service_version": "0001"
								},
								"transactionid": "80B157A6EB784F83A1F0196AC8840859",
								"timestamp": "20170421073243.8683680",
								"Error_Resolution": {
									"SAP_Transaction": "Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
									"SAP_Note": "See SAP Note 1797736 ",
									"Batch_SAP_Note": "See SAP Note 1869434 for details about working with $batch"
								},
								"errordetails": [{
									"code": "CRM_ORDER/013",
									"message": "Transaction 8000141797 is being processed by user SPENNEBERGA",
									"propertyref": "",
									"severity": "error",
									"target": "TEXT"
								}]
							}
						}
					}));

				}
			});
			
		// Add Request to check deletion failure of attachment	
		aRequests.push({
				method: "DELETE",
				path: RegExp(MockServer.prototype._escapeStringForRegExp(
					"AttachmentSet(refGuid=guid'dc7dd06b-7f09-4582-86b8-fb4ee0b2c5b9',loioId='loioId4',phioId='phioId4')") + "?(.*)"),
				response: function(oXhr, sUrlParams) {
					jQuery.sap.log.debug("Incoming request for withdraw");
					oXhr.respondJSON(400, {}, JSON.stringify({
						"error": {
							"code": "CRM_DOCUMENTS/110",
							"message": {
								"lang": "en",
								"value": "Document(s) cannot be deleted"
							},
							"innererror": {
								"application": {
									"component_id": "SV-SMG-SUP",
									"service_namespace": "/SAP/",
									"service_id": "AI_CRM_GW_MYMESSAGE_SRV",
									"service_version": "0001"
								},
								"transactionid": "80B157A6EB784F83A1F0196AC8840859",
								"timestamp": "20170421073243.8683680",
								"Error_Resolution": {
									"SAP_Transaction": "Run transaction /IWFND/ERROR_LOG on SAP Gateway hub system and search for entries with the timestamp above for more details",
									"SAP_Note": "See SAP Note 1797736 ",
									"Batch_SAP_Note": "See SAP Note 1869434 for details about working with $batch"
								},
								"errordetails": [{
									"code": "CRM_DOCUMENTS/110",
									"message": "Document(s) cannot be deleted",
									"propertyref": "",
									"severity": "error",
									"target": ""
								}]
							}
						}
					}));

				}
			});

			oMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.POST, this.afterPost);
			oMockServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.POST, this.beforePost);
			oMockServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.DELETE, this.beforeDeleteAttachment, "AttachmentSet");
			oMockServer.attachAfter(sap.ui.core.util.MockServer.HTTPMETHOD.GET, this.afterGet, "MessageResultSet");
			oMockServer.attachBefore(sap.ui.core.util.MockServer.HTTPMETHOD.GET, this.beforeGet, "MessageResultSet");
			oMockServer.setRequests(aRequests);

			// handling the metadata error test
			if (oUriParameters.get("metadataError")) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf("$metadata") > -1) {
						fnResponse(500, "metadata Error", aEntry);
					}
				});
			}

			// Handling request errors
			if (sErrorParam) {
				aRequests.forEach(function(aEntry) {
					if (aEntry.path.toString().indexOf(sEntity) > -1) {
						fnResponse(iErrorCode, sErrorParam, aEntry);
					}
				});
			}
			oMockServer.start();

			jQuery.sap.log.info("Running the app with mock data");
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer: function() {
			return oMockServer;
		},

		regExpEscape: function(literalString) {
			return literalString.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
		},

		afterPost: function(oEvent) {

			if (oEvent.getParameter("oEntity").__metadata.type === "AI_CRM_GW_MYMESSAGE_SRV.Text") {

				oEvent.getParameter("oEntity").DateTimeText = Formatter.dateTime(new Date());
				oEvent.getParameter("oEntity").TdfuserText = "Max Mock";
				oEvent.getParameter("oEntity").Tdid = "SU01";
				oEvent.getParameter("oEntity").TdidTxt = "Reply";
				oEvent.getParameter("oEntity").Tdobject = "CRM_ORDERH";
				oEvent.getParameter("oEntity").Email = "max.mock@sap.com";
				oEvent.getParameter("oEntity").Emailsubject = "Emailsubject 2";
				oEvent.getParameter("oEntity").Department = "Abteilung Mock Data";
				oEvent.getParameter("oEntity").Company = "SAP SE";
				oEvent.getParameter("oEntity").CompanyAdress = "SAP Allee 12";
				oEvent.getParameter("oEntity").Contactmobile = "+49 1234 12341";
				oEvent.getParameter("oEntity").Contactphone = "+49 7222 12312";

			} else if (oEvent.getParameter("oEntity").__metadata.type === "AI_CRM_GW_MYMESSAGE_SRV.Attachment") {

				// Nothing here so far ..

			}
		},

		beforePost: function(oEvent, skeys, navName) {
			if (oEvent.getParameter("sNavName") === "AttachmentSet") {

				if (oEvent.getParameter("oXhr").requestBody)

				{

					var fileObject = oEvent.getParameter("oXhr").requestBody;

					var key = oEvent.getParameter("sKeys").split("'");
					var refGuid = key[1];

					var newObject = {
						"refGuid": refGuid,
						// "lastModified": fileObject.lastModified,
						// "lastModifiedDate": fileObject.lastModifiedDate,
						"language": "E",
						// "uploadDateFormatted": "uploadDateFormatted 1",
						"uploadDate": "/Date(" + new Date().getTime() + ")/",
						"userName": "JACK",
						"contributor": "Max Mock",
						"document": "01110011010100111111111010011111",
						"thumbnailUrl": "thumbnailUrl 1",
						"fileName": fileObject.name,
						"fileSize": fileObject.size,
						"mimeType": fileObject.type,
						"enableEdit": false,
						"enableDelete": true,
						"visibleDelete": true,
						"visibleEdit": false
					};

					// then use JSON.stringify on new object
					var newReqBody = JSON.stringify(newObject);

				}

				oEvent.getParameter("oXhr").requestBody = newReqBody;
			}
		},
		
		beforeDeleteAttachment : function(oEvent) {
			if (oEvent.getParameter("oXhr").status === 400) {
				oEvent.getParameter("oXhr").readyState = 1;
			}
		},

		beforeGet: function(oEvent, data) {

		},

		afterGet: function(oEvent, oData) {

			var afilteredData = [];

			var fnCheck = function(status, entitySet) {
				var aData = oEvent.getSource().getEntitySetData(entitySet);
				aData.forEach(
					function findStatus(element, index, array) {
						if (element.Concatstatuser === status) {
							afilteredData.push(element);
						}
					}
				);
			};

			// 			var fnGetOnlyOpen = function(entitySet) {
			// 				// var aData = 	oEvent.getParameter("oFilteredData").results;
			// 				// var aIndex = [];

			// 				for(var i = oEvent.getParameter("oFilteredData").results.length - 1; i >= 0; i--) {
			//     if(oEvent.getParameter("oFilteredData").results[i].StillOpen === false) {
			//       oEvent.getParameter("oFilteredData").results.splice(i, 1);
			//     }
			// }

			// 	aData.forEach(
			// 	function findStatus(element, index, array) {
			// 		if (element.StillOpen === false) {
			// 		aIndex.push(index);
			// 		}
			// 	}

			// );

			// aIndex.forEach(	function findStatus(element, index, array) {
			// 	oEvent.getParameter("oFilteredData").results.splice(index,1);
			// 	}

			// );
			//	oEvent.getParameter("oFilteredData").results = aData;
			// };

			var filterExpr = new RegExp("filter=Concatstatuser");

			if (filterExpr.test(oEvent.getParameter("oXhr").url)) {
				var urlParts = (oEvent.getParameter("oXhr").url).split("filter=Concatstatuser");

				if (new RegExp("NEW").test(urlParts[1])) {
					fnCheck("New", "MessageResultSet");
				}

				if (new RegExp("IN_PROC").test(urlParts[1])) {
					fnCheck("In Process", "MessageResultSet");
				}

				if (new RegExp("CUSTACTION").test(urlParts[1])) {
					fnCheck("Customer Action", "MessageResultSet");
				}

				if (new RegExp("PROP_SOL").test(urlParts[1])) {
					fnCheck("Solution Provided", "MessageResultSet");
				}

				if (new RegExp("WITHDRAWN").test(urlParts[1])) {
					fnCheck("Withdrawn", "MessageResultSet");
				}

				if (new RegExp("CONFIRMED").test(urlParts[1])) {
					fnCheck("Closed", "MessageResultSet");
				}

			} else {
				//	fnGetOnlyOpen("MessageResultSet");

			}

			if (afilteredData.length >= 1) {
				oEvent.getParameter("oFilteredData").results = afilteredData;
			}

		}

	};

});