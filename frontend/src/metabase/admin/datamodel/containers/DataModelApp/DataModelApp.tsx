import type { ReactNode } from "react";
import { t } from "ttag";

import Link from "metabase/core/components/Link";
import { RouterTablePicker } from "metabase/metadata/pages/DataModel/components";
import type { RouteParams } from "metabase/metadata/pages/DataModel/types";
import { parseRouteParams } from "metabase/metadata/pages/DataModel/utils";
import { Box, Flex, Icon, Stack } from "metabase/ui";

import S from "./DataModelApp.module.css";

export function DataModelApp({
  params,
  children,
}: {
  params: RouteParams;
  children: ReactNode;
}) {
  const { databaseId, tableId, schemaId } = parseRouteParams(params);
  return (
    <Flex h="100%">
      <Stack
        className={S.sidebar}
        flex="0 0 25%"
        gap={0}
        h="100%"
        bg="bg-white"
      >
        <RouterTablePicker
          databaseId={databaseId}
          schemaId={schemaId}
          tableId={tableId}
        />
        <Box mx="xl" py="sm" className={S.footer}>
          <Link to="/admin/datamodel/segments" className={S.segmentsLink}>
            <Icon name="pie" className={S.segmentsIcon} />
            {t`Segments`}
          </Link>
        </Box>
      </Stack>

      {children}
    </Flex>
  );
}
