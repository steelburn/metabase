import cx from "classnames";
import type { ReactNode } from "react";

import { Flex, Icon, Title } from "metabase/ui";

import S from "./ModalHeader.module.css";
import { ModalContentActionIcon } from "./ModalHeaderComponents";
import type { CommonModalProps } from "./types";

export interface ModalHeaderProps extends CommonModalProps {
  children: ReactNode;
  className?: string;
}

export const ModalHeader = ({
  children,
  className,
  fullPageModal,
  centeredTitle,
  headerActions,
  onClose,
  onBack,
}: ModalHeaderProps) => {
  const hasActions = !!headerActions || !!onClose;
  const actionIconSize = fullPageModal ? 24 : 16;

  return (
    <Flex
      className={cx(S.HeaderContainer, className)}
      align="center"
      gap="sm"
      p="xl"
      w="100%"
      data-testid="modal-header"
    >
      <Flex
        align="center"
        className={cx(S.HeaderTextContainer, { [S.hasOnClick]: !!onBack })}
        onClick={onBack}
      >
        {onBack && (
          <Icon
            className={cx(S.ModalContentActionIcon, S.ModalHeaderBackIcon)}
            name="chevronleft"
          />
        )}

        <Title
          order={2}
          fw="700"
          display="flex"
          className={cx(S.HeaderText, {
            [S.textCentered]: fullPageModal || centeredTitle,
          })}
        >
          {children}
        </Title>
      </Flex>

      {hasActions && (
        <Flex gap="sm" m="-0.5rem -0.5rem -0.5rem 0">
          {headerActions}
          {onClose && (
            <ModalContentActionIcon
              name="close"
              size={actionIconSize}
              onClick={onClose}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
