import react from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import next from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

const sourceFiles = ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'];

export default defineConfig([
  globalIgnores(['.next/**', 'node_modules/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    files: sourceFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  eslint.configs.recommended,
  ...typescript.configs.recommended,
  {
    ...react.configs['recommended-typescript'],
    files: sourceFiles,
    rules: {
      ...react.configs['recommended-typescript'].rules,
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
      '@eslint-react/no-array-index-key': 'off',
      '@eslint-react/no-nested-component-definitions': 'off',
      '@eslint-react/purity': 'off',
      '@eslint-react/set-state-in-effect': 'off',
      '@eslint-react/static-components': 'off',
    },
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: sourceFiles,
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  {
    files: sourceFiles,
    plugins: {
      'import-x': importX,
    },
    rules: {
      'import-x/no-anonymous-default-export': 'warn',
    },
  },
  {
    files: sourceFiles,
    plugins: {
      'jsx-a11y-x': jsxA11y,
    },
    rules: {
      'jsx-a11y-x/alt-text': [
        'warn',
        {
          elements: ['img'],
          img: ['Image'],
        },
      ],
      'jsx-a11y-x/aria-props': 'warn',
      'jsx-a11y-x/aria-proptypes': 'warn',
      'jsx-a11y-x/aria-unsupported-elements': 'warn',
      'jsx-a11y-x/role-has-required-aria-props': 'warn',
      'jsx-a11y-x/role-supports-aria-props': 'warn',
    },
  },
  {
    ...next.configs['core-web-vitals'],
    files: sourceFiles,
    rules: {
      ...next.configs['core-web-vitals'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-img-element': 'off',
      'preserve-caught-error': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
