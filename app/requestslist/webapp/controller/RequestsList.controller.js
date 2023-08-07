// RequestsList.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel"
], function (Controller, ODataModel) {
    "use strict";

    return Controller.extend("requestslist.controller.RequestsList", {
        _selectedData: null,

        onInit: function () {
            // Initialize the view and attach event handlers.
            var oView = this.getView();
            var oTable = oView.byId("RequestsTable");

            // Attach a selection change event handler to the table.
            oTable.attachSelectionChange(this.handleSelectionChange, this);

            // Initialize data for the view.
            this._initData();
        },

        onCreatePress: function () {
            // Navigate to the CreateRequest view.
            this.getOwnerComponent().getRouter().navTo("CreateRequest");
        },

        onUpdatePress: function () {
            // Handle navigation to the UpdateRequest view with selected data.
            if (this._selectedData) {
                this.getOwnerComponent().getRouter().navTo("UpdateRequest", {
                    selectedData: JSON.stringify(this._selectedData)
                });
            } else {
                // If no data is selected, navigate to the UpdateRequest view without data.
                //this is currently due to some bugs, and just wanted to show the screen at least
                this.getOwnerComponent().getRouter().navTo("UpdateRequest");
            }
        },

        onRowSelect: function (oEvent) {
            // Handle selection of a table row.
            var oCheckBox = oEvent.getSource();
            var oContext = oCheckBox.getBindingContext();
            var oModel = this.getView().getModel("viewModel");
            var oData = oContext.getObject();

            // Set the selected row in the view model.
            oModel.setProperty("/selectedRow", oData.ID);
            this._selectedData = oData;
        },

        handleSelectionChange: function (oEvent) {
            // Handle the change of selected item in the table.
            var oSelectedItem = oEvent.getParameter("listItem");
            var oSelectedContext = oSelectedItem.getBindingContext();
            this._selectedData = oSelectedContext.getObject();
        },

        onBeforeRendering: function () {
            // Initialize data before rendering the view.
            this._initData();
        },

        _initData: function () {
            // Initialize data for the view and bind it to the table.
            var oView = this.getView();
            var oTable = oView.byId("RequestsTable");
            oTable.removeSelections();

            // Create an OData model and bind it to the table.
            var oODataModel = new ODataModel({
                serviceUrl: "/odata/v4/my/",
                synchronizationMode: "None"
            });

            oTable.bindItems({
                path: "/Requests",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{ID}" }),
                        new sap.m.Text({ text: "{createdAt}" }),
                        new sap.m.Text({ text: "{createdBy}" }),
                        new sap.m.Text({ text: "{modifiedAt}" }),
                        new sap.m.Text({ text: "{modifiedBy}" }),
                        new sap.m.Text({ text: "{shortDescription}" }),
                        new sap.m.Text({ text: "{description}" }),
                        new sap.m.Text({ text: "{priority}" })
                    ]
                })
            });

            // Set the OData model on the view for data binding.
            oView.setModel(oODataModel);
        }
    });
});
