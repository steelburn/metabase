import { css } from "@emotion/react";
import styled from "@emotion/styled";
import cx from "classnames";

import LastEditInfoLabel from "metabase/components/LastEditInfoLabel";
import { FullWidthContainer } from "metabase/styled-components/layout/FullWidthContainer";
import type { BoxProps } from "metabase/ui";

import { FixedWidthContainer } from "./Dashboard/DashboardComponents";
import S from "./DashboardHeaderView.module.css";

export const HeaderFixedWidthContainer = (
  props: BoxProps & { isNavBarOpen?: boolean },
) => {
  const { isNavBarOpen, className, ...rest } = props;

  return (
    <FixedWidthContainer
      className={cx(
        S.HeaderFixedWidthContainer,
        {
          [S.isNavBarOpen]: isNavBarOpen,
        },
        className,
      )}
      {...rest}
    />
  );
};

export const HeaderRow = (props: BoxProps) => {
  return <FullWidthContainer className={S.HeaderRow} {...props} />;
};

export const HeaderCaptionContainer = styled.div`
  position: relative;
  transition: top 400ms ease;
  padding-right: 2rem;
  right: 0.25rem;
  display: flex;
  align-items: center;
`;

export const HeaderLastEditInfoLabel = styled(LastEditInfoLabel)`
  transition: opacity 400ms ease;

  @media screen and (max-width: 40em) {
    margin-top: 4px;
  }
`;

interface HeaderContentProps {
  showSubHeader: boolean;
  hasSubHeader: boolean;
}

export const HeaderContent = styled.div<HeaderContentProps>`
  padding-top: 1rem;
  padding-bottom: 0.75rem;

  ${HeaderLastEditInfoLabel} {
    opacity: ${props => (props.showSubHeader ? "1x" : "0")};
  }

  ${({ hasSubHeader }) =>
    hasSubHeader &&
    css`
      &:hover,
      &:focus-within {
        ${HeaderCaptionContainer} {
          top: 0;
        }
        ${HeaderLastEditInfoLabel} {
          opacity: 1;
        }
      }
    `}

  @media screen and (max-width: 40em) {
    padding-top: 0;
    padding-left: 1rem;
    padding-right: 1rem;

    ${HeaderCaptionContainer} {
      top: 0;
    }
    ${HeaderLastEditInfoLabel} {
      opacity: 1;
    }
  }
`;
