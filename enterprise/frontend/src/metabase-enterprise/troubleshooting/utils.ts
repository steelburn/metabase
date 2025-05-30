import { t } from "ttag";
import _ from "underscore";

import type { CardError } from "metabase-types/api";

const ERROR_DICTIONARY = {
  "inactive-field": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    entity: t`Field`,
    messageProp: "field" as const,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    problem: t`is inactive`,
  },
  "unknown-field": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    entity: t`Field`,
    messageProp: "field" as const,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    problem: t`is unknown`,
  },
  "inactive-table": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    entity: t`Table`,
    messageProp: "table" as const,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    problem: t`is inactive`,
  },
  "unknown-table": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    entity: t`Table`,
    messageProp: "table" as const,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    problem: t`is unknown`,
  },
};

const errorTypes = Object.keys(
  ERROR_DICTIONARY,
) as (keyof typeof ERROR_DICTIONARY)[];

export const formatErrorString = (errors: CardError[]) => {
  const messages: string[] = [];

  const errorsByType = _.groupBy(errors, "type");

  errorTypes.forEach((errorType) => {
    if (errorsByType[errorType]) {
      const errorDef = ERROR_DICTIONARY[errorType];

      messages.push(
        `${errorDef.entity} ${errorsByType[errorType]
          .map((error) => error[errorDef.messageProp])
          .join(", ")} ${errorDef.problem}`,
      );
    }
  });

  if (messages.length > 0) {
    return messages.join(", ");
  } else {
    return t`Unknown data reference`;
  }
};
