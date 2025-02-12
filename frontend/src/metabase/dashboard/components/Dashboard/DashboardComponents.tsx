import cx from "classnames";

import {
  LoadingAndErrorWrapper,
  type LoadingAndErrorWrapperProps,
} from "metabase/components/LoadingAndErrorWrapper";
import ColorS from "metabase/css/core/colors.module.css";
import DashboardS from "metabase/css/dashboard.module.css";
import { isEmbeddingSdk } from "metabase/env";
import ParametersS from "metabase/parameters/components/ParameterValueWidget.module.css";
import { FullWidthContainer } from "metabase/styled-components/layout/FullWidthContainer";
import { Box, type BoxProps } from "metabase/ui";

import S from "./Dashboard.module.css";

interface DashboardLoadingAndErrorWrapperProps
  extends LoadingAndErrorWrapperProps {
  isFullscreen: boolean;
  isNightMode: boolean;
  isFullHeight: boolean;
}

export const DashboardLoadingAndErrorWrapper = ({
  isFullscreen,
  isNightMode,
  isFullHeight,
  className,
  ...props
}: DashboardLoadingAndErrorWrapperProps) => {
  return (
    <LoadingAndErrorWrapper
      className={cx(
        className,
        S.DashboardLoadingAndErrorWrapper,
        DashboardS.Dashboard,
        {
          [DashboardS.DashboardFullscreen]: isFullscreen,
          [DashboardS.DashboardNight]: isNightMode,
          [ParametersS.DashboardNight]: isNightMode,
          [ColorS.DashboardNight]: isNightMode,
          [S.isFullHeight]: isFullHeight,
        },
      )}
      {...props}
    />
  );
};

export const ParametersWidgetContainer = (
  props: BoxProps & {
    allowSticky?: boolean;
    isNightMode?: boolean;
    isSticky?: boolean;
  },
) => {
  const { className, allowSticky, isNightMode, isSticky, ...rest } = props;

  return (
    <FullWidthContainer
      className={cx(className, S.ParametersWidgetContainer, {
        [S.allowSticky]: allowSticky,
        [S.isNightMode]: isNightMode,
        [S.isSticky]: isSticky,
        [S.isEmbeddingSdk]: isEmbeddingSdk,
      })}
      {...rest}
    />
  );
};

export const FIXED_WIDTH = "1048px";
export const FixedWidthContainer = (props: BoxProps) => {
  const { className, ...rest } = props;
  return <Box className={cx(S.FixedWidthContainer, className)} {...rest} />;
};

export const ParametersFixedWidthContainer = (
  props: BoxProps & { id?: string },
) => {
  return (
    <FixedWidthContainer
      className={S.ParametersFixedWidthContainer}
      {...props}
    />
  );
};
