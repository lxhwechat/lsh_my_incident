sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"zwx/sm/itsm/myincidents/test/opa5/pages/Common",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/model/resource/ResourceModel"
], function(Opa5, Press, Common, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, ResourceModel) {
	"use strict";

	var sViewName = "S3";

	this.oResourceBundle = new ResourceModel({
		bundleUrl: jQuery.sap.getModulePath("zwx.sm.itsm.myincidents", "/i18n/i18n.properties")
	}).getResourceBundle();

	Opa5.createPageObjects({
		onTheDetailPage: {
			baseClass: Common,

			actions: {

				iPressTheBackButton: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the nav button on detail page"
					});
				},

				iPressOnTheShareButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://action"
						}),
						actions: new Press(),
						errorMessage: "Did not find the share button on detail page"
					});
				},

				iPressTheConfirmButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: "confirmButton",
						viewName: sViewName,

						actions: new Press(),
						errorMessage: "Did not find the confirm button on detail page"
					});
				},

				iPressTheWithdrawButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						id: "withdrawButton",
						viewName: sViewName,

						actions: new Press(),
						errorMessage: "Did not find the withdraw button on detail page"
					});
				},

				iPressTheButtonWithTheText: function(text) {
					return this.waitFor({
						controlType: "sap.m.Button",

						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: text
						}),
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "The button '" + text + "' has been pressed");

						},
						errorMessage: "Did not find the button with text '" + text + "'"
					});
				},

				iPressTheDialogButtonWithTheText: function(text) {
					return this.waitFor({
						searchOpenDialogs: true,
						controlType: "sap.m.Button",

						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: text
						}),
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "The button '" + text + "' has been pressed");

						},
						errorMessage: "Did not find the button with text '" + text + "'"
					});
				},

				iPressTheAttachmentTabFilter: function() {
					return this.waitFor({
						controlType: "sap.m.IconTabFilter",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://attachment"
						}),
						actions: new Press(),
						errorMessage: "Did not find Attchments IconTabFilter on detail page"
					});
				},

				iPressTheAttachmentDeleteButtonAtItemNo: function(iPosition) {
					return this.waitFor({
						id: "fileupload",
						viewName: sViewName,
						matchers: function(oList) {
							return oList.getItems()[iPosition];
						},
						actions: function(oCustomItem) {
							sap.ui.test.Opa5.getJQuery()(".sapMUCDeleteBtn").trigger("tap");
						},
						errorMessage: "Did not find the Attachment Item at Positon " + iPosition
					});

				},

				iPressTheConversationTabFilter: function() {
					return this.waitFor({
						controlType: "sap.m.IconTabFilter",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://discussion"
						}),
						actions: new Press(),
						errorMessage: "Did not find Conversation IconTabFilter on detail page"
					});
				},

				iPressTheDetailTabFilter: function() {
					return this.waitFor({
						controlType: "sap.m.IconTabFilter",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "icon",
							value: "sap-icon://hint"
						}),
						actions: new Press(),
						errorMessage: "Did not find Detail IconTabFilter on detail page"
					});
				},

				iEnterSomeTextInTheFeedInput: function(sText) {
					return this.waitFor({
						id: "feedInput",
						viewName: sViewName,
						actions: function(oFeedInput) {
							oFeedInput.setValue(sText);
						},
						success: function() {
							Opa5.assert.ok(true, "The text '" + sText + "' has been entered in FeedInput Control");
						},
						errorMessage: "Could not enter" + sText + " in FeedInput"

					});
				},
				
				iEnterSomeTextInTheRichTextEditor: function(sText) {
					return this.waitFor({
						id: "richTextEditor",
						viewName: sViewName,
						actions: function(oRichTextEditor) {
							oRichTextEditor.setValue(sText);
						},
						success: function() {
							Opa5.assert.ok(true, "The text '" + sText + "' has been entered in RichTextEditor Control");
						},
						errorMessage: "Could not enter" + sText + " in RichTextEditor"

					});
				},

				iPressTheSubmitTextButtonInFeedInput: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewName,
						id: "feedInput-button",
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "The Submit button of the FeedInput has been pressed");
						},
						errorMessage: "Did not find the Submit button on detail page"
					});
				},
				
				iPressTheSubmitTextButton: function() {

					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewName,
						id: "submitTextBtn",
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "The Submit button has been pressed");
						},
						errorMessage: "Did not find the Submit button on detail page"
					});
				},

				iPressTheSenderInFeedListAtPositon: function(oPosition) {

					return this.waitFor({
						controlType: "sap.m.List",
						viewName: sViewName,
						id: "notesList",

						success: function(oList) {
							var item = oList.getItems()[oPosition];
							item.fireSenderPress();
						},
						errorMessage: "Did not find the Submit button on detail page"
					});

					// return this.waitFor({
					// 		id: "feedInput",
					// 		viewName: sViewName,
					// 		actions: function (oFeedInput) {
					//       				   oFeedInput.firePost();
					// 		},
					// 			errorMessage: "Could not fire post Event"
					// });		
				}

			},

			assertions: {

				iShouldSeeTheBusyIndicator: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						success: function(oPage) {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(oPage.getBusy(), "The detail view is busy");
						},
						errorMessage: "The detail view is not busy."
					});
				},

				iShouldSeeNoBusyIndicator: function() {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: function(oPage) {
							return !oPage.getBusy();
						},
						success: function(oPage) {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(!oPage.getBusy(), "The detail view is not busy");
						},
						errorMessage: "The detail view is busy."
					});
				},

				theObjectPageShowsTheFirstObject: function() {
					return this.iShouldBeOnTheObjectNPage(0);
				},

				iShouldBeOnTheObjectNPage: function(iObjIndex) {
					return this.waitFor(this.createAWaitForAnEntitySet({
						entitySet: "MessageResultSet",
						success: function(aEntitySet) {
							var sItemName = aEntitySet[iObjIndex].Description;

							this.waitFor({
								controlType: "sap.m.ObjectHeader",
								viewName: sViewName,
								matchers: new PropertyStrictEquals({
									name: "title",
									value: aEntitySet[iObjIndex].Description
								}),
								success: function() {
									Opa5.assert.ok(true, "was on the first object page with the name " + sItemName);
								},
								errorMessage: "First object is not shown"
							});
						}
					}));
				},

				iShouldSeeTheRememberedObject: function() {
					return this.waitFor({
						success: function() {
							var sBindingPath = this.getContext().currentItem.bindingPath;
							this._waitForPageBindingPath(sBindingPath);
						}
					});
				},

				theConfirmDialogShouldBeClosed: function() {
					return this.waitFor({
						controlType: "sap.ui.core.mvc.View",
						matchers: new PropertyStrictEquals({
							name: "controllerName",
							value: "zwx.sm.itsm.myincidents.view.S3"
						}),
						success: function(oPage) {
							var oController = oPage[0].getController();
							return this.waitFor({
								id: "page",
								viewName: sViewName,
								matchers: function() {
									return (oController.Confirm.isOpen() === false);
								},
								success: function() {
									Opa5.assert.ok(true, "Confirm dialog has been closed");
								},
								errorMessage: "The Confirm Dialog is still visible."
							});
						}
					});

				},

				theWithdrawDialogShouldBeClosed: function() {
					return this.waitFor({
						controlType: "sap.ui.core.mvc.View",
						matchers: new PropertyStrictEquals({
							name: "controllerName",
							value: "zwx.sm.itsm.myincidents.view.S3"
						}),
						success: function(oPage) {
							var oController = oPage[0].getController();
							return this.waitFor({
								id: "page",
								viewName: sViewName,
								matchers: function() {
									return (oController.Withdraw.isOpen() === false);
								},
								success: function() {
									Opa5.assert.ok(true, "Withdraw dialog has been closed");
								},
								errorMessage: "The Withdraw Dialog is still visible."
							});
						}
					});

				},

				_waitForPageBindingPath: function(sBindingPath) {
					return this.waitFor({
						id: "page",
						viewName: sViewName,
						matchers: function(oPage) {
							return oPage.getBindingContext() && oPage.getBindingContext().getPath() === sBindingPath;
						},
						success: function(oPage) {
							Opa5.assert.strictEqual(oPage.getBindingContext().getPath(), sBindingPath, "was on the remembered detail page");
						},
						errorMessage: "Remembered object " + sBindingPath + " is not shown"
					});
				},

				iShouldSeeTheObjectLineItemsList: function() {
					return this.waitFor({
						id: "lineItemsList",
						viewName: sViewName,
						success: function(oList) {
							Opa5.assert.ok(oList, "Found the line items list.");
						}
					});
				},

				theLineItemsListShouldHaveTheCorrectNumberOfItems: function() {
					return this.waitFor(this.createAWaitForAnEntitySet({
						entitySet: "",
						success: function(aEntitySet) {

							return this.waitFor({
								id: "lineItemsList",
								viewName: sViewName,
								matchers: new AggregationFilled({
									name: "items"
								}),
								check: function(oList) {

									var sObjectID = oList.getBindingContext().getProperty("Guid");

									var iLength = aEntitySet.filter(function(oLineItem) {
										return oLineItem.Guid === sObjectID;
									}).length;

									return oList.getItems().length === iLength;
								},
								success: function() {
									Opa5.assert.ok(true, "The list has the correct number of items");
								},
								errorMessage: "The list does not have the correct number of items."
							});
						}
					}));
				},

				theLineItemsHeaderShouldDisplayTheAmountOfEntries: function() {
					return this.waitFor({
						id: "lineItemsList",
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oList) {
							var iNumberOfItems = oList.getItems().length;
							return this.waitFor({
								id: "lineItemsHeader",
								viewName: sViewName,
								matchers: new PropertyStrictEquals({
									name: "text",
									value: "<LineItemNamePlural> (" + iNumberOfItems + ")"
								}),
								success: function() {
									Opa5.assert.ok(true, "The line item list displays " + iNumberOfItems + " items");
								},
								errorMessage: "The line item list does not display " + iNumberOfItems + " items."
							});
						}
					});
				},

				iShouldSeeTheShareEmailButton: function() {
					return this.waitFor({
						id: "shareEmail",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The E-Mail button is visible");
						},
						errorMessage: "The E-Mail button was not found"
					});
				},

				iShouldSeeTheShareTileButton: function() {
					return this.waitFor({
						id: "shareTile",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The Save as Tile button is visible");
						},
						errorMessage: "The Save as Tile  button was not found"
					});
				},

				iShouldSeeTheWithdrawButton: function() {
					return this.waitFor({
						id: "withdrawButton",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The withdraw button is visible");
						},
						errorMessage: "The withdraw button was not found"
					});
				},

				iShouldSeeTheConfirmButton: function() {
					return this.waitFor({
						id: "confirmButton",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The confirm button is visible");
						},
						errorMessage: "The confirm button was not found"
					});
				},

				iShouldSeeTheAttachmentControl: function() {

					return this.waitFor({
						id: "fileupload",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The UploadCollection is visible");
						},
						errorMessage: "The UploadCollection was not found"
					});
				},

				iShouldSeeTheFeedList: function() {

					return this.waitFor({
						id: "notesList",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The FeedList is visible");
						},
						errorMessage: "The FeedList was not found"
					});
				},

				iShouldSeeTheRichTextEditor: function() {

					return this.waitFor({
						id: "richTextEditor",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The RichTextEditor is visible");
						},
						errorMessage: "The RichTextEditor was not found"
					});
				},
				
				iShouldSeeTheFeedInput: function() {

					return this.waitFor({
						id: "feedInput",
						viewName: sViewName,
						success: function() {
							Opa5.assert.ok(true, "The FeedInput is visible");
						},
						errorMessage: "The FeedInput was not found"
					});
				},

				iShouldSeeTheDialogWithTitle: function(sText) {

					return this.waitFor({
						controlType: "sap.m.Dialog",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "title",
							value: sText
						}),
						success: function() {
							Opa5.assert.ok(true, "Dialog '" + sText + "' is visible");
						},
						errorMessage: "Dialog '" + sText + "' was not found"

					});

				},

				iShouldSeeTheMessageBoxWithTitle: function(sText) {

					return this.waitFor({
						searchOpenDialogs: true,
						viewName: sViewName,
						controlType: "sap.m.Dialog",
						matchers: function(oBox) {
							return (oBox.getTitle() === sText);
						},

						success: function() {
							Opa5.assert.ok(true, "MessageBox '" + sText + "' is visible");
						},
						errorMessage: "MessageBox '" + sText + "' was not found"

					});

				},

				iShouldSeeTheLabelwithTheText: function(labelText) {

					return this.waitFor({
						controlType: "sap.m.Label",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: labelText
						}),
						success: function() {
							Opa5.assert.ok(true, "Label " + labelText + " is visible");
						},
						errorMessage: "The Label with text " + labelText + " was not found"

					});

				},

				iShouldSeeTheObjectStatusWithTheText: function(text) {

					return this.waitFor({
						controlType: "sap.m.ObjectStatus",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: text
						}),
						success: function() {
							Opa5.assert.ok(true, "Object Status with text " + text + " is visible");
						},
						errorMessage: "The Object Status  with text " + text + " was not found"

					});

				},

				iShouldSeeTheObjectStatusWithTheState: function(state) {

					return this.waitFor({
						controlType: "sap.m.ObjectStatus",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "state",
							value: state
						}),
						success: function() {
							Opa5.assert.ok(true, "Object Status with state " + state + " is visible");
						},
						errorMessage: "The Object Status  with state " + state + " was not found"

					});

				},

				iShouldSeeTheTextFieldWithTheText: function(text) {
					var i18nText = text;
					return this.waitFor({
						controlType: "sap.m.Text",
						viewName: sViewName,
						matchers: function(oText) {

							var resModel = oText.getModel("i18n").getResourceBundle();
							i18nText = resModel.getText(text);
							if (resModel.getText(text) === oText.getText()) {
								return true;
							} else {
								return false;
							}

						},

						success: function() {
							Opa5.assert.ok(true, "Text Field '" + i18nText + "' is visible");
						},
						errorMessage: "Text Field with text '" + i18nText + "' was not found"

					});
				},

				iShouldSeeTheTextAreaWithPlaceholderText: function(text) {
					var i18nText = text;
					return this.waitFor({
						controlType: "sap.m.TextArea",
						viewName: sViewName,
						matchers: function(oText) {

							var resModel = oText.getModel("i18n").getResourceBundle();
							i18nText = resModel.getText(text);
							if (resModel.getText(text) === oText.getPlaceholder()) {
								return true;
							} else {
								return false;
							}

						},

						success: function() {
							Opa5.assert.ok(true, "TextArea with Placeholder Text '" + i18nText + "' is visible");
						},
						errorMessage: "TextArea with Placeholder Text '" + i18nText + "' was not found"

					});
				},

				iShouldSeeTheButtonWithTheText: function(text) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: text
						}),
						success: function() {
							Opa5.assert.ok(true, "Button '" + text + "' is visible");
						},
						errorMessage: "Button '" + text + "' was not found"

					});
				},

				iShouldSeeAsFirstItemInTheFeedListTheText: function(sText) {
					return this.waitFor({
						id: "notesList",
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "items"
						}),

						success: function(oNotesList) {

							var aNotes = oNotesList;

							return this.waitFor(this.createAWaitForAnEntitySet({
								entitySet: "TextSet",
								success: function(aEntitySet) {

									return this.waitFor({

										check: function() {
											if (aNotes.getItems()[0].getText() === sText) {
												return true;
											} else {
												return false;
											}
										},

										success: function(oAttachmentTab) {

											Opa5.assert.ok(true, "The text " + sText + " has been found in the feedList at 1st position");
										},

										errorMessage: "The Text " + sText + " was not found in the feedList at 1st position."
									});
								}
							}));
						}

					});

				},

				theButtonShouldBeEnabledandEmphasized: function(text) {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: sViewName,
						matchers: new sap.ui.test.matchers.PropertyStrictEquals({
							name: "text",
							value: text
						}),
						check: function(oButton) {
							if (oButton[0].getType() === "Emphasized" && oButton[0].getEnabled() === true) {
								return true;
							} else {
								return false;
							}
						},
						success: function(oButton) {

							Opa5.assert.ok(true, text + " Button is enabled and emphasized");

						},
						errorMessage: text + " button is not enabled or emphasized"
					});
				},

				theAttachmentTabShouldDisplayTheAmountOfAttachments: function() {
					return this.waitFor({
						id: "fileupload",
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oUploadItems) {
							var iNumberOfItems = oUploadItems.getItems().length;
							return this.waitFor({
								id: "attachmentFilter",
								controlType: "sap.m.IconTabFilter",
								viewName: sViewName,
								matchers: function(oAttachmentTab) {
									if (parseInt(oAttachmentTab.getCount(), 10) === iNumberOfItems) {
										return true;
									} else {
										return false;
									}
								},
								success: function(oAttachmentTab) {

									Opa5.assert.ok(true, "The attachemnt Tab count shows " + iNumberOfItems + " items");
								},
								errorMessage: "The attachemnt Tab count does not show  " + iNumberOfItems + " items."
							});
						}
					});
				},

				theAttachmentTabCountShouldBeZero: function() {
					return this.waitFor({
						id: "fileupload",
						viewName: sViewName,
						matchers: function(oUploadCollection) {
							if (oUploadCollection.getItems().length === 0) {
								return true;
							} else {
								return false;
							}

						},
						success: function(oUploadItems) {
							var iNumberOfItems = oUploadItems.getItems().length;
							return this.waitFor({
								id: "attachmentFilter",
								controlType: "sap.m.IconTabFilter",
								viewName: sViewName,
								matchers: function(oAttachmentTab) {
									if (parseInt(oAttachmentTab.getCount(), 10) === iNumberOfItems) {
										return true;
									} else {
										return false;
									}
								},
								success: function(oAttachmentTab) {

									Opa5.assert.ok(true, "The attachemnt Tab count shows " + iNumberOfItems + " items");
								},
								errorMessage: "The attachemnt Tab count does not show  " + iNumberOfItems + " items."
							});
						}
					});
				},

				theConversationTabShouldDisplayTheAmountOfTexts: function() {
					return this.waitFor({
						id: "notesList",
						viewName: sViewName,
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function(oItems) {
							var iNumberOfItems = oItems.getItems().length;
							return this.waitFor({
								id: "notesFilter",
								controlType: "sap.m.IconTabFilter",
								viewName: sViewName,
								matchers: function(oNotesTab) {
									if (parseInt(oNotesTab.getCount(), 10) === iNumberOfItems) {
										return true;
									} else {
										return false;
									}
								},
								success: function(oAttachmentTab) {

									Opa5.assert.ok(true, "The 'Conversation' Tab count shows " + iNumberOfItems + " items");
								},
								errorMessage: "The 'Conversation' Tab count does not show  " + iNumberOfItems + " items."
							});
						}
					});
				},

				theShareTileButtonShouldContainTheRememberedObjectName: function() {
					return this.waitFor({
						id: "shareTile",
						viewName: sViewName,
						matchers: function(oButton) {
							var sObjectName = this.getContext().currentItem.title;
							var sTitle = oButton.getTitle();
							return sTitle && sTitle.indexOf(sObjectName) > -1;
						}.bind(this),
						success: function() {
							Opa5.assert.ok(true, "The Save as Tile button contains the oject name");
						},
						errorMessage: "The Save as Tile did not contain the object name"
					});
				},

				iShouldSeeTheQuickContactCard: function() {

					return this.waitFor({

						controlType: "sap.m.QuickView",
						id: "quickView",
						success: function(oList) {
							Opa5.assert.ok(true, "The 'Contact Info Popover' is visible");
						},
						errorMessage: "The  'Contact Info Popover' was not found"
					});
				}

			}

		}

	});

});