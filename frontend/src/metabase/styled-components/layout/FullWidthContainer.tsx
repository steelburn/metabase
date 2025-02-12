import { Box, type BoxProps } from "metabase/ui";

import S from "./FullWidthContainer.module.css";

export const FullWidthContainer = (props: BoxProps) => {
  return (
    <Box
      w="100%"
      px="md"
      m="0 auto"
      className={S.FullWidthContainer}
      {...props}
    />
  );
};
