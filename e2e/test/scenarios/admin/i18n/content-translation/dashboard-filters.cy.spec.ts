import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";
import type {
  DashboardDetails,
  StructuredQuestionDetails,
} from "e2e/support/helpers";

import { germanFieldNames, germanFieldValues } from "./constants";
import {
  interceptContentTranslationRoutes,
  uploadTranslationDictionary,
} from "./helpers/e2e-content-translation-helpers";

const { PRODUCTS, PRODUCTS_ID } = SAMPLE_DATABASE;

const { H } = cy;

const productCategoryFilter = {
  name: "Category",
  slug: "product_category",
  id: "11d79abe",
  type: "string/=",
  sectionId: "string",
  isMultiSelect: false,
};

const questionDetails: StructuredQuestionDetails = {
  name: "Products question",
  query: {
    "source-table": PRODUCTS_ID,
  },
};

const dashboardDetails: DashboardDetails = {
  parameters: [productCategoryFilter],
  enable_embedding: true,
  embedding_params: {
    [productCategoryFilter.slug]: "enabled",
  },
};

describe("scenarios > content translation > dashboard filters and field values", () => {
  describe("ee", () => {
    before(() => {
      interceptContentTranslationRoutes();
      cy.intercept("GET", "/api/embed/dashboard/*").as("dashboard");
      cy.intercept("GET", "/api/embed/dashboard/**/card/*").as("cardQuery");

      H.restore();
      cy.signInAsAdmin();
      H.setTokenFeatures("all");

      uploadTranslationDictionary([...germanFieldNames, ...germanFieldValues]);
      H.snapshot("dashboard-and-translations");
    });

    beforeEach(() => {
      H.restore("dashboard-and-translations" as any);
    });

    it("can filter products table via localized list widget and see localized values", () => {
      H.createQuestionAndDashboard({
        questionDetails,
        dashboardDetails,
      }).then(({ body: { id, card_id, dashboard_id } }) => {
        cy.request("PUT", `/api/dashboard/${dashboard_id}`, {
          dashcards: [
            {
              id,
              card_id,
              row: 0,
              col: 0,
              size_x: 24,
              size_y: 20,
              parameter_mappings: [
                {
                  parameter_id: productCategoryFilter.id,
                  card_id,
                  target: ["dimension", ["field", PRODUCTS.CATEGORY, null]],
                },
              ],
            },
          ],
        });
        H.visitEmbeddedPage(
          {
            resource: { dashboard: dashboard_id as number },
            params: {},
          },
          {
            additionalHashOptions: {
              locale: "de",
            },
          },
        );
        cy.wait("@dashboard");
        cy.wait("@cardQuery");

        cy.log("Before filtering, multiple categories are shown");
        cy.findByTestId("table-body").within(() => {
          ["Dingsbums", "Gerät", "Apparat", "Steuerelement"].forEach((cat) =>
            cy
              .findAllByText(new RegExp(cat))
              .should("have.length.greaterThan", 2),
          );
        });

        cy.log("Non-categorical field values are not translated");
        cy.findByText("Rustic Paper Wallet").should("be.visible");
        cy.findByText("Rustikale Papierbörse").should("not.exist");

        cy.log("After filtering, only one category is shown");
        H.filterWidget().findByText("Kategorie").click();
        H.popover().within(() => {
          cy.findByText(/Dingsbums/).click();
          cy.findByText(/Füge einen Filter hinzu/).click();
        });
        cy.findByTestId("table-body").within(() => {
          cy.findAllByText(/Dingsbums/).should("have.length.greaterThan", 5);
          ["Gerät", "Apparat", "Steuerelement"].forEach((cat) =>
            cy.findAllByText(new RegExp(cat)).should("not.exist"),
          );
        });
      });
    });
  });
});
