import { SAMPLE_DATABASE } from "e2e/support/cypress_sample_database";

import { germanFieldNames } from "./constants";
import {
  interceptContentTranslationRoutes,
  uploadTranslationDictionary,
} from "./helpers/e2e-content-translation-helpers";

const { PRODUCTS_ID } = SAMPLE_DATABASE;

const { H } = cy;

describe("scenarios > content translation > dashboard filters and field values", () => {
  describe("ee", () => {
    before(() => {
      interceptContentTranslationRoutes();

      H.restore();
      cy.signInAsAdmin();
      H.setTokenFeatures("all");

      H.createDashboardWithQuestions({
        questions: [
          {
            name: "Products question",
            query: {
              "source-table": PRODUCTS_ID,
            },
          },
        ],
        cards: [{ col: 0, row: 0, size_x: 24, size_y: 6 }],
      }).then(({ dashboard }) => {
        cy.request("PUT", `/api/dashboard/${dashboard.id}`, {
          // TODO: Remove this if not needed
          // embedding_params: {
          //   [dashboardFilter.slug]: "enabled",
          // },
          enable_embedding: true,
        });
        cy.wrap(dashboard.id).as("dashboardId");
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
          params: {},
        });
      });
    });
  });
});
