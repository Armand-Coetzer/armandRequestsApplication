// CreateRequest.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel"
], function (Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("requestslist.controller.CreateRequest", {
        onInit: function () {
            // Initialize the view and create an OData model for data binding.
            var oView = this.getView();
            var oODataModel = new ODataModel({
                serviceUrl: "/odata/v4/my/",
                synchronizationMode: "None"
            });

            // Set the OData model on the view for data binding.
            oView.setModel(oODataModel, "oDataModel");
        },

        onCreatePress: function () {
            // Handle the creation of a new request.
            var oODataModel = this.getView().getModel("oDataModel");
            var oNewRequest = {
                shortDescription: this.byId("newShortDescription").getValue(),
                description: this.byId("newDescription").getValue(),
                priority: this.byId("newRequestPriority").getSelectedItem().getKey()
            };

            // Send a POST request to create a new request.
            oODataModel.create("/Requests", oNewRequest, {
                success: function (oData) {
                    MessageToast.show("Request created successfully.");
                }.bind(this),
                error: function () {
                    MessageToast.show("Failed to create request.");
                }
            });
        },

        onBackPress: function () {
            // Navigate back to the RequestsList view and initialize data.
            this.getOwnerComponent().getRouter().navTo("RequestsList");
            this._initData();
        },

        _initData: function () {
            // Initialize data for the view.
            var oView = this.getView();
            var oComboBox = oView.byId("newRequestPriority");
            oComboBox.setSelectedKey("");

            // Set the OData model on the view for data binding.
            var oODataModel = oView.getModel("oDataModel");
            oView.setModel(oODataModel, "oDataModel");
        }
    });
});
