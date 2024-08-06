module.exports = {
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
		'next/core-web-vitals',
	],
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	settings: { react: { version: '18.2' } },
	overrides: [
		{
			files: [ '*.js', '*.jsx' ],
			rules: {
				// Disable all rules for JS and JSX files
				'no-unused-vars': 'off',
				'no-undef': 'off',
				// Add other rules you want to disable here
			},
		},
	],
};