import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";

import { germanFieldNames } from "./constants";
import {
  interceptContentTranslationRoutes,
  uploadTranslationDictionary,
} from "./helpers/e2e-content-translation-helpers";

const { PRODUCTS, PRODUCTS_ID } = SAMPLE_DATABASE;

const { H } = cy;

describe("scenarios > content translation > dashboard filters and field values", () => {
  describe("ee", () => {
    before(() => {
      interceptContentTranslationRoutes();

      H.restore();
      cy.signInAsAdmin();
      H.setTokenFeatures("all");

      H.createDashboardWithParameters(
        {
          name: "Products question",
          query: {
            "source-table": PRODUCTS_ID,
          },
        },
        ["field", PRODUCTS.CATEGORY, null],
        [
          {
            name: "Product category",
            slug: "product_category",
            id: "12345",
            type: "string/=",
            sectionId: "string",
            isMultiSelect: false,
          },
        ],
        { dashboardDetails: { enable_embedding: true } },
        { visitDashboard: false },
      ).then((dashboardId) => {
        cy.wrap(dashboardId).as("dashboardId");
      });

      uploadTranslationDictionary(germanFieldNames);
      H.snapshot("dashboard-and-translations");
    });

    beforeEach(() => {
      H.restore("dashboard-and-translations" as any);
    });

    describe("on an embedded dashboard", () => {
      let dashboardId = null as unknown as number;

      before(() => {
        cy.get<number>("@dashboardId").then((id) => {
          dashboardId = id;
        });
      });

      it("can filter products table via localized list widget and see localized values", () => {
        H.snapshot("translations-uploaded");
        cy.signInAsNormalUser();
        H.visitEmbeddedPage({
          resource: { dashboard: dashboardId },
          params: {
            // TODO NEXT: Not sure how to get the parameter to display in embedding
            product_category: "Doohickey",
          },
        });
      });
    });
  });
});
