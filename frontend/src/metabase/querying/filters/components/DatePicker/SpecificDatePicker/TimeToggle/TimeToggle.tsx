import { t } from "ttag";

import type { ButtonProps } from "metabase/ui";
import { Button, Icon } from "metabase/ui";

interface TimeToggleProps extends ButtonProps {
  hasTime: boolean;
  onClick?: () => void;
}

export function TimeToggle({ hasTime, ...props }: TimeToggleProps) {
  const label = hasTime ? t`Remove time` : t`Add time`;

  return (
    <Button
      c="var(--mb-color-text-secondary)"
      variant="subtle"
      leftSection={<Icon name="clock" />}
      aria-label={label}
      {...props}
    >
      {label}
    </Button>
  );
}
