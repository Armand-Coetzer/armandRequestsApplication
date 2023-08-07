// UpdateRequest.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel"
],
function (Controller, ODataModel) {
    "use strict";

    return Controller.extend("requestslist.controller.UpdateRequest", {
        onInit: function () {
            // Initialize the view and attach a route pattern matched event handler.
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("UpdateRequest").attachPatternMatched(this._onRouteMatched, this);
        
            var sViewId = this.getView().getId();
            
            // Only run this when the view is selected (UpdateView is true).
            if (sViewId === "UpdateRequest") { 
                // Create an OData model for Priorities entity.
                var oODataModel = new ODataModel({
                    serviceUrl: "/odata/v4/my/",
                    synchronizationMode: "None"
                });
        
                // Fetch Priorities data and set up the model for data binding.
                this.getView().setModel(oODataModel, "oDataModel");
                var oPrioritiesTable = this.byId("updateRequestPriority");
                oPrioritiesTable.bindItems({
                    path: "oDataModel>/Priorities",
                    template: new sap.ui.core.Item({
                        key: "{oDataModel>priority}",
                        text: "{oDataModel>description}"
                    })
                });
            }
        },

        onBackPress: function () {
            // Navigate back to the RequestsList view.
            this.getOwnerComponent().getRouter().navTo("RequestLists");
        },

        onUpdatePress: function () {
            // Handle the update logic and persist changes to the database.
            var oViewModel = this.getView().getModel("viewModel");
            var oSelectedData = oViewModel.getProperty("/selectedData");

            var oDataModel = this.getView().getModel("oDataModel");
            var sUpdatePath = oDataModel.createKey("/Requests", {
                ID: oSelectedData.ID
            });
            oDataModel.update(sUpdatePath, oSelectedData, {
                success: function () {
                    // Show a success message after updating data.
                    sap.m.MessageToast.show("Data updated successfully.");
                },
                error: function () {
                    // Show an error message if data update fails.
                    sap.m.MessageToast.show("Failed to update data.");
                }
            });
        },

        onPriorityChange: function (oEvent) {
            // Handle priority change and update the view model.
            var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            var oViewModel = this.getView().getModel("viewModel");
            var oSelectedData = oViewModel.getProperty("/selectedData");

            // Ensure the selected priority is valid.
            var aPriorities = this.getView().getModel().getProperty("/Priorities");
            var bIsValidPriority = aPriorities.some(function (oPriority) {
                return oPriority.priority === sSelectedKey;
            });

            if (bIsValidPriority) {
                oSelectedData.priority = sSelectedKey;
                oViewModel.setProperty("/selectedData", oSelectedData);
            } else {
                // Reset to the previous priority if the selected one is not valid.
                this.byId("updateRequestPriority").setSelectedKey(oSelectedData.priority);
            }
        },

        _onRouteMatched: function (oEvent) {
            // Handle route pattern matched event and initialize view model data.
            var oArgs = oEvent.getParameter("arguments");
            var sSelectedData = oArgs.selectedData;
            var oViewModel = new sap.ui.model.json.JSONModel({
                selectedData: JSON.parse(sSelectedData)
            });
            this.getView().setModel(oViewModel, "viewModel");
        }
    });
});
