import { t } from "ttag";

import CS from "metabase/css/core/index.css";
import { Box, Stack, Text } from "metabase/ui";

import { SettingHeader } from "../SettingHeader";
import {
  EmbeddingSdkOptionCard,
  InteractiveEmbeddingOptionCard,
  StaticEmbeddingOptionCard,
} from "../widgets/EmbeddingOption";

import type { AdminSettingComponentProps } from "./types";

export function EmbeddingSettings({
  updateSetting,
}: AdminSettingComponentProps) {
  function handleToggleStaticEmbedding(value: boolean) {
    updateSetting({ key: "enable-embedding-static" }, value);
  }

  function handleToggleInteractiveEmbedding(value: boolean) {
    updateSetting({ key: "enable-embedding-interactive" }, value);
  }

  return (
    <Box p="0.5rem 1rem 0">
      <Stack gap="2.5rem">
        <Box data-testid="enable-embedding-setting">
          <SettingHeader id="enable-embedding" title={t`Embedding`} />
          <Stack gap={"md"} className={CS.textMeasure}>
            <Text lh={1.5}>
              {t`Embed dashboards, questions, or the entire Metabase app into your application. Integrate with your server code to create a secure environment, limited to specific users or organizations.`}
            </Text>
          </Stack>
        </Box>
        <StaticEmbeddingOptionCard onToggle={handleToggleStaticEmbedding} />
        <InteractiveEmbeddingOptionCard
          onToggle={handleToggleInteractiveEmbedding}
        />
        <EmbeddingSdkOptionCard updateSetting={updateSetting} />
      </Stack>
    </Box>
  );
}
