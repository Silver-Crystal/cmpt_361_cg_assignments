// // import { defineConfig } from "eslint/config";

// // export default defineConfig([
// // 	{
// // 		files: ["**/*.js"],
// // 		linterOptions: {
// // 			reportUnusedDisableDirectives: "error",
// //             reportUnusedInlineConfigs: "error",
// // 		},
// // 	},
// // ]);
// // eslint.config.js
// import js from "@eslint/js";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   {
//     files: ["**/*.js"],
//     plugins: {
//       js,
//     },
//     extends: ["js/recommended"],
//     rules: {
//       "no-unused-vars": "warn",
//     },
//   },
// ]);
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "warn",
    }
  },
]);
