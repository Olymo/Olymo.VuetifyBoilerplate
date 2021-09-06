<template>
  <v-container>
    <v-dialog></v-dialog>
    <v-breadcrumbs
      :items="itemsForNavigation"
      style="padding: 5px 0px"
    ></v-breadcrumbs>
    <v-color-picker v-if="false"></v-color-picker>
    <v-data-table v-if="false"></v-data-table>
    <RestTable
      v-if="pageMetadata && allowAnyAction"
      :resource="pageMetadata.resource"
      :filters="pageMetadata.filters"
      :processDataOn="pageMetadata.processDataOn"
      :dataExtraction="dataExtraction"
      :excludedHeaders="pageMetadata.excludedHeaders"
      :itemsPerPageText="pageMetadata.itemsPerPageText"
      :addBtn="pageMetadata.addBtn"
      :editFormElements="updateFields"
      :insertFormElements="insertFields"
      :updateOpts="editModalOpts"
      :insertOpts="insertModalOpts"
      :extractInsertErrors="extractErrors"
      :extractUpdateErrors="extractErrors"
      :messages="pageMetadata.messages"
      :useInsert="useInsert"
      :useEdit="useUpdate"
      :useDelete="useDelete"
      :headers="headers"
      :tableProps="tableProps"
      :specializedColumns="specializedColumns"
      searchTitle="$allowedFilters"
      :formatters="formatters"
      :showDeleteErrors="showDeleteErrors"
      :customDialog="customDialog"
      :filterPosition="filterPosition"
      :searchSubmit="searchSubmit"
      :columnWidth="columnWidth"
      @updateSuccess="snackbar = true"
      @insertSuccess="snackbar = true"
      :custom-sort="customSort"
      headerColor="#EF5350"
      modalHeaderColor="#EF5350"
    >
    </RestTable>

    <v-snackbar
      :timeout="1000"
      right
      bottom
      color="success"
      dark
      v-model="snackbar"
    >
      <v-card-text> {{ $t("apiSuccessMsg") }} </v-card-text>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbar = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      :timeout="5000"
      right
      top
      color="error"
      dark
      v-model="snackbarError"
    >
      <v-card-text> {{ errorMessage }} </v-card-text>
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="snackbarError = false">
          X
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import defaults from "./rest-defaults.json";
import formatDate from "../../util/formatDateHelper.js";
import dataTableSort from "../../util/dataTableSort.js";
import { getActorData } from "../../util/user";

export default {
  name: "RestCrudPage",
  props: {
    page: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pageMetadata: undefined,
      snackbar: false,
      snackbarError: false,
      errorMessage: "",
      itemsForNavigation: [],
    };
  },
  async mounted() {
    const pageData = await import(`./pages/${this.page}.json`);
    this.pageMetadata = { ...defaults, ...pageData };
    if (this.sorts) {
      dataTableSort.setSorts(this.sorts);
    }
    //this.itemsForNavigation = await this.setBreadcrumbs();
  },
  computed: {
    formatters() {
      var that = this;
      return {
        date: that.dateFormatter,
        lastLoginTime: function (value) {
          if (!value) {
            return;
          }
          return that.dateFormatter(value, "long");
        },
        icon: function (value) {
          return process.env.VUE_APP_S3_DOMAIN + "/icons/" + value;
        },
      };
    },
    importProps() {
      return this.pageMetadata.import;
    },
    useInsert() {
      return this.useCaseAllowed(this.pageMetadata.useCases.insert);
    },
    useUpdate() {
      return this.useCaseAllowed(this.pageMetadata.useCases.update);
    },
    useDelete() {
      return this.useCaseAllowed(this.pageMetadata.useCases.delete);
    },
    allowAnyAction() {
      return this.useCaseAllowed(this.pageMetadata.useCases.search);
    },
    insertFields() {
      return this.pageMetadata.insertFields;
    },
    updateFields() {
      return this.pageMetadata.updateFields
        ? this.pageMetadata.updateFields
        : this.pageMetadata.insertFields;
    },
    insertModalOpts() {
      return this.pageMetadata.insertModalOpts;
    },
    filterPosition() {
      return this.pageMetadata.filterPosition;
    },
    searchSubmit() {
      return this.pageMetadata.searchSubmit;
    },
    editModalOpts() {
      return this.pageMetadata.editModalOpts
        ? this.pageMetadata.editModalOpts
        : this.pageMetadata.insertModalOpts;
    },
    dataExtraction() {
      if (
        this.pageMetadata.processDataOn == "client" ||
        this.pageMetadata.processDataOn == "mixed"
      ) {
        return undefined;
      }
      return this.pageMetadata.dataExtraction;
    },
    headers() {
      return this.pageMetadata.headers;
    },
    specializedColumns() {
      return this.pageMetadata.specializedColumns;
    },
    tableProps() {
      this.pageMetadata.tableProps.noDataText = this.$t("noData");
      this.pageMetadata.tableProps.loadingText = this.$t("loadingData");
      if (this.sorts) {
        this.pageMetadata.tableProps.customSort = this.customSort;
      }
      return this.pageMetadata.tableProps;
    },
    customDialog() {
      return this.pageMetadata.customDialog;
    },
    columnWidth() {
      return this.pageMetadata.columnWidth
        ? this.pageMetadata.columnWidth
        : "auto";
    },
    customSort: () => dataTableSort.sort,
    sorts() {
      return this.pageMetadata.sorts;
    },
  },
  methods: {
    useCaseAllowed(useCaseName) {
      console.log(useCaseName);
      // return true;

      //TODO implement use-casing system
      // if (useCaseName == "None") {
      if (useCaseName == "NONE") {
        return true;
      }

      if (!useCaseName) {
        throw new Error(
          `Missing use-case. Please review your json config file.`
        );
      }
      // var useCaseId = useCaseMap[useCaseName];

      // if (!useCaseId) {
      //   throw new Error(
      //     `Provided UseCase (${useCaseName}) did not resolve to any use case ID. Plase review your json config file.`
      //   );
      // }

      // return JSON.parse(
      //   store.getters["user/jwtData"].UserData
      // ).AllowedUseCaseIds.includes(useCaseId);

      return getActorData().AllowedUseCaseIds.includes(useCaseName);
    },
    dateFormatter(value, length = "short") {
      if (!value) {
        return;
      }
      return formatDate(value, length);
    },
    extractErrors(response) {
      var errors = response.errors.map((x) => {
        return {
          propertyName: this.capitalizeFirstLetter(x.PropertyName),
          error: x.Error,
        };
      });

      return errors;
    },
    showDeleteErrors(error) {
      let errorString = "";
      for (let singleError of error.errors) {
        errorString += singleError.Error + "\n";
      }
      this.snackbarError = true;
      this.errorMessage = errorString;
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    },
  },
};
</script>

<style>
#headerSlot {
  margin-top: 17px;
}
#apiTableFilters {
  padding: 10px;
  margin-top: 17px !important;
}

.v-application .text-button,
.v-application .text-caption {
  line-height: normal;
  font-family: "Futura Md BT" !important;
}

.v-icon.v-icon {
  font-size: 18px;
}
</style>
