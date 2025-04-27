module.exports = {
  rules: {
    "max-nesting-depth": 4,
    "order/properties-alphabetical-order": null,
    // See: https://github.com/postcss/postcss-bem-linter/issues/82#issuecomment-292464488
    "selector-class-pattern":
      "^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$",
  },
};
