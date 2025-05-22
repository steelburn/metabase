import { useState } from "react";

import { ParameterFieldWidget } from "metabase/parameters/components/widgets/ParameterFieldWidget/ParameterFieldWidget";
import Field_ from "metabase-lib/v1/metadata/Field";
import type { Field } from "metabase-types/api";

export function FilterPreview({ field }: { field: Field }) {
  const [fld] = useState(new Field_(field));
  const [value, setValue] = useState([]);
  return (
    <ParameterFieldWidget
      value={value}
      setValue={setValue}
      fields={[fld]}
      parameter={{
        id: "__example_parameter__",
        name: "Example parameter",
        slug: "example",
        type: field.base_type,
        fields: [fld],
        isMultiSelect: true,
      }}
    />
  );
}
