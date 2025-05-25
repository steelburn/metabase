export const BUNDLED_PACKAGES = [
  // These packages may add wrong react types to the host app from what I understand. We didn't add them to the package.json of SDK to avoid types issue.
  "@visx/axis",
  "@visx/clip-path",
  "@visx/grid",
  "@visx/group",
  "@visx/shape",
  "@visx/text",
  "classnames",
  "react-beautiful-dnd",
  "formik",

  // We have to bundle to force the proper logic based on the `NODE_ENV: "production"`
  "icepick",

  // Have patches on our side
  "@mantine/core",
  "echarts",

  // Because we bundle @mantine/core we have to be sure that the same version of dates/hooks libraries is installed
  "@mantine/dates",
  "@mantine/hooks",

  // Has errors during rollup treeshaking
  "iframe-resizer",

  // these I want recheck
  "crc-32",
  "ttag",
];
