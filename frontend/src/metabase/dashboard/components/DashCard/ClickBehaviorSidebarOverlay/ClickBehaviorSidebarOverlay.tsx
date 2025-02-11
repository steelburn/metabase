import cx from "classnames";
import { useCallback } from "react";
import { t } from "ttag";

import { getClickBehaviorDescription } from "metabase/lib/click-behavior";
import { Box, Flex, Icon } from "metabase/ui";
import type { DashboardCard, QuestionDashboardCard } from "metabase-types/api";

import S from "./ClickBehaviorSidebarOverlay.module.css";

interface Props {
  dashcard: DashboardCard;
  dashcardWidth: number;
  showClickBehaviorSidebar: (
    dashCardId: QuestionDashboardCard["id"] | null,
  ) => void;
  isShowingThisClickBehaviorSidebar: boolean;
}

const MIN_WIDTH_FOR_ON_CLICK_LABEL = 330;

export function ClickBehaviorSidebarOverlay({
  dashcard,
  dashcardWidth,
  showClickBehaviorSidebar,
  isShowingThisClickBehaviorSidebar,
}: Props) {
  const onClick = useCallback(() => {
    showClickBehaviorSidebar(
      isShowingThisClickBehaviorSidebar ? null : dashcard.id,
    );
  }, [
    dashcard.id,
    showClickBehaviorSidebar,
    isShowingThisClickBehaviorSidebar,
  ]);

  return (
    <Flex align="center" justify="center" h="100%">
      <button
        className={cx(S.Button, {
          [S.isActive]: isShowingThisClickBehaviorSidebar,
        })}
        onClick={onClick}
      >
        <Icon
          className={cx(S.ClickIcon, {
            [S.isActive]: isShowingThisClickBehaviorSidebar,
          })}
          name="click"
        />
        {dashcardWidth > MIN_WIDTH_FOR_ON_CLICK_LABEL && (
          <Box
            component="span"
            mr="md"
            className={S.HelperText}
          >{t`On click`}</Box>
        )}
        <Box
          component="span"
          className={cx(S.ClickBehaviorDescription, {
            [S.isActive]: isShowingThisClickBehaviorSidebar,
          })}
        >
          {getClickBehaviorDescription(dashcard)}
        </Box>
      </button>
    </Flex>
  );
}
