import { Icon, type IconProps } from "metabase/ui";

import S from "./ModalHeader.module.css";

export const ModalContentActionIcon = (props: IconProps) => {
  return <Icon className={S.ModalContentActionIcon} {...props} />;
};
