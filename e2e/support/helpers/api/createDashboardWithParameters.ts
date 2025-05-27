import type { LocalFieldReference } from "metabase-types/api";

import { visitDashboard } from "../e2e-misc-helpers";

import type { DashboardDetails } from "./createDashboard";
import type { StructuredQuestionDetails } from "./createQuestion";
import { createQuestionAndDashboard } from "./createQuestionAndDashboard";
import { updateDashboardCards } from "./updateDashboardCards";

// TODO: Delete this file and revert the other file that refers to createDashboardWithParameters

export function createDashboardWithParameters(
  questionDetails: StructuredQuestionDetails,
  targetField: LocalFieldReference,
  parameters: DashboardDetails["parameters"],
  { dashboardDetails = {} }: { dashboardDetails?: DashboardDetails } = {},
  options: { visitDashboard?: boolean } = {},
) {
  options.visitDashboard ??= true;

  return createQuestionAndDashboard({
    questionDetails,
    dashboardDetails: {
      ...dashboardDetails,
      parameters,
    },
  }).then(({ body: { dashboard_id }, questionId }) => {
    updateDashboardCards({
      dashboard_id,
      cards: [
        {
          card_id: questionId,
          parameter_mappings: parameters?.map((parameter) => ({
            parameter_id: parameter.id,
            card_id: questionId,
            target: ["dimension", targetField],
          })),
        },
      ],
    });

    if (options.visitDashboard) {
      visitDashboard(dashboard_id);
    }
    return cy.wrap(dashboard_id);
  });
}
