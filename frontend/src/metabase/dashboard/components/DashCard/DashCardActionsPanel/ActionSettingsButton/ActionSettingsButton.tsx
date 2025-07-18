import { useEffect } from "react";
import { t } from "ttag";

import { setEditingDashcardId } from "metabase/dashboard/actions";
import { connect } from "metabase/lib/redux";
import type { ActionDashboardCard } from "metabase-types/api";

import { DashCardActionButton } from "../DashCardActionButton/DashCardActionButton";

const mapDispatchToProps = {
  setEditingDashcardId,
};

interface Props {
  dashcard: ActionDashboardCard;
  setEditingDashcardId: (dashcardId: number) => void;
}

function ActionSettingsButton({ dashcard, setEditingDashcardId }: Props) {
  useEffect(() => {
    if (dashcard.justAdded) {
      setEditingDashcardId(dashcard.id);
    }
  }, [dashcard.id, dashcard.justAdded, setEditingDashcardId]);

  return (
    <DashCardActionButton
      tooltip={t`Action Settings`}
      onClick={() => setEditingDashcardId(dashcard.id)}
    >
      <DashCardActionButton.Icon name="gear" />
    </DashCardActionButton>
  );
}

export const ActionSettingsButtonConnected = connect(
  null,
  mapDispatchToProps,
)(ActionSettingsButton);
