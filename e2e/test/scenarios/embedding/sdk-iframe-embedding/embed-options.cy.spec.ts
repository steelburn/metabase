import {
  FIRST_COLLECTION_ID,
  ORDERS_DASHBOARD_ID,
  ORDERS_QUESTION_ID,
} from "e2e/support/cypress_sample_instance_data";

const { H } = cy;

describe("scenarios > embedding > sdk iframe embed options passthrough", () => {
  beforeEach(() => {
    H.prepareSdkIframeEmbedTest();
    cy.signOut();
  });

  it("shows a static question using {questionId, drillThroughEnabled: false}", () => {
    const frame = H.loadSdkIframeEmbedTestPage({
      questionId: ORDERS_QUESTION_ID,
      drillThroughEnabled: false,
    });

    cy.wait("@getCardQuery");

    frame.within(() => {
      // StaticQuestion should render, so drill features should not be present
      cy.findByText("Orders, Count").should("be.visible");
      cy.findByRole("button", { name: /Download/i }).should("not.exist");
      // No drill-through popover
      cy.findByText(/See these Orders/).should("not.exist");
    });
  });

  it("shows a static dashboard using {dashboardId, drillThroughEnabled: false}", () => {
    const frame = H.loadSdkIframeEmbedTestPage({
      dashboardId: ORDERS_DASHBOARD_ID,
      drillThroughEnabled: false,
    });

    cy.wait("@getDashCardQuery");

    frame.within(() => {
      // StaticDashboard should render, so drill features should not be present
      cy.findByText("Orders in a dashboard").should("be.visible");
      cy.findByText("Orders").should("be.visible");
      cy.findByRole("button", { name: /Download/i }).should("not.exist");
      // No drill-through popover
      cy.findByText(/See these Orders/).should("not.exist");
    });
  });

  it("renders an interactive question with {questionId, drillThroughEnabled: true, withDownloads: true, withTitle: false}", () => {
    const frame = H.loadSdkIframeEmbedTestPage({
      questionId: ORDERS_QUESTION_ID,
      drillThroughEnabled: true,
      withDownloads: true,
      withTitle: false,
    });

    cy.wait("@getCardQuery");

    frame.within(() => {
      cy.findByText("Orders, Count").should("be.visible");
      cy.findByRole("button", { name: /Download/i }).should("exist");
      // Title should not be visible
      cy.findByText("Orders").should("not.exist");
    });
  });

  it("renders an interactive dashboard with {dashboardId, drillThroughEnabled: true, withDownloads: true, withTitle: false}", () => {
    const frame = H.loadSdkIframeEmbedTestPage({
      dashboardId: ORDERS_DASHBOARD_ID,
      drillThroughEnabled: true,
      withDownloads: true,
      withTitle: false,
    });

    cy.wait("@getDashCardQuery");

    frame.within(() => {
      cy.findByText("Orders in a dashboard").should("be.visible");
      cy.findByText("Orders").should("be.visible");
      cy.findByRole("button", { name: /Download/i }).should("exist");
      // Title should not be visible
      cy.findByText("Orders in a dashboard").should("not.exist");
    });
  });

  it("renders the exploration template with {template: 'exploration', isSaveEnabled: true, targetCollection, entityTypes}", () => {
    const frame = H.loadSdkIframeEmbedTestPage({
      template: "exploration",
      isSaveEnabled: true,
      targetCollection: FIRST_COLLECTION_ID,
      entityTypes: ["table", "question"],
    });

    frame.within(() => {
      // Should show the data picker and allow saving
      cy.findByText(/Pick your starting data/i).should("be.visible");
      cy.findByRole("button", { name: /Save/i }).should("exist");
    });
  });
});
