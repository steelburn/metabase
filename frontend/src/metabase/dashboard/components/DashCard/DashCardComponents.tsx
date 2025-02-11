import cx from "classnames";
import { type CSSProperties, type Ref, forwardRef } from "react";

import { isEmbeddingSdk } from "metabase/env";
import { Box, type BoxProps, useMantineTheme } from "metabase/ui";

import S from "./DashCard.module.css";

interface DashCardRootProps {
  isNightMode: boolean;
  isUsuallySlow: boolean;
  hasHiddenBackground: boolean;
  shouldForceHiddenBackground: boolean;
}

export const DashCardRoot = forwardRef(function DashCardRoot(
  props: BoxProps & DashCardRootProps,
  ref: Ref<HTMLDivElement>,
) {
  const theme = useMantineTheme();

  const {
    isNightMode,
    hasHiddenBackground,
    shouldForceHiddenBackground,
    isUsuallySlow,
    className,
    ...rest
  } = props;

  return (
    <Box
      ref={ref}
      className={cx(
        S.DashCardRoot,
        {
          [S.isNightMode]: isNightMode,
          [S.hasHiddenBackground]: hasHiddenBackground,
          [S.shouldForceHiddenBackground]: shouldForceHiddenBackground,
          [S.isEmbeddingSdk]: isEmbeddingSdk,
          [S.isUsuallySlow]: isUsuallySlow,
        },
        className,
      )}
      style={
        {
          "--dashcard-slow-border-color": theme.fn.themeColor("accent4"),
        } as CSSProperties
      }
      {...rest}
    />
  );
});
