import cx from "classnames";
import { t } from "ttag";

import { Box, Icon, Tooltip } from "metabase/ui";

import DataReferenceButtonS from "./DataReferenceButton.module.css";

interface DataReferenceButtonProps {
  className?: string;
  isShowingDataReference: boolean;
  size: number;
  toggleDataReference: () => void;
}

export const DataReferenceButton = ({
  className,
  isShowingDataReference,
  size,
  toggleDataReference,
}: DataReferenceButtonProps) => (
  <Tooltip label={t`Learn about your data`}>
    <Box
      component="a"
      h={size}
      className={cx(className, DataReferenceButtonS.ButtonRoot, {
        [DataReferenceButtonS.isSelected]: isShowingDataReference,
      })}
    >
      <Icon name="reference" size={size} onClick={toggleDataReference} />
    </Box>
  </Tooltip>
);
