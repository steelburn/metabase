import type { ElementType, HTMLAttributes } from "react";
import { forwardRef } from "react";

import Tooltip from "metabase/core/components/Tooltip";
import { Icon, type IconProps } from "metabase/ui";

import { StyledAnchor } from "./DashCardActionButton.styled";

export const HEADER_ICON_SIZE = 16;

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  as?: ElementType;
  tooltip?: string;
}

const DashActionButton = forwardRef<HTMLAnchorElement, Props>(
  function DashActionButton({ as, tooltip, children, ...props }, ref) {
    return (
      <StyledAnchor {...props} as={as} ref={ref}>
        <Tooltip tooltip={tooltip}>{children}</Tooltip>
      </StyledAnchor>
    );
  },
);

const ActionIcon = (props: IconProps) => (
  <Icon size={HEADER_ICON_SIZE} {...props} />
);

export const DashCardActionButton = Object.assign(DashActionButton, {
  Icon: ActionIcon,
  ICON_SIZE: HEADER_ICON_SIZE,
});
