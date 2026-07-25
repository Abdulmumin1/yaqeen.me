import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	{
		name: 'project/ignores',
		ignores: [
			'**/.DS_Store',
			'**/node_modules/**',
			'build/**',
			'.svelte-kit/**',
			'package/**',
			'.env',
			'.env.*',
			'!.env.example',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock'
		]
	},
	js.configs.recommended,
	...svelte.configs['flat/base'],
	{
		name: 'project/svelte-recommended-compatibility',
		rules: {
			'svelte/comment-directive': 'error',
			'svelte/no-at-debug-tags': 'warn',
			'svelte/no-at-html-tags': 'error',
			'svelte/no-dupe-else-if-blocks': 'error',
			'svelte/no-dupe-style-properties': 'error',
			'svelte/no-dynamic-slot-name': 'error',
			'svelte/no-inner-declarations': 'error',
			'svelte/no-not-function-handler': 'error',
			'svelte/no-object-in-text-mustaches': 'error',
			'svelte/no-shorthand-style-property-overrides': 'error',
			'svelte/no-unknown-style-directive-property': 'error',
			'svelte/no-unused-svelte-ignore': 'error',
			'svelte/system': 'error',
			'svelte/valid-compile': 'error'
		}
	},
	{
		name: 'project/language-options',
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'no-unassigned-vars': 'off',
			'no-unused-vars': ['error', { caughtErrors: 'none' }],
			'no-useless-assignment': 'off',
			'preserve-caught-error': 'off'
		}
	},
	prettier
];
