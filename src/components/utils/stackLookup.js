import { readable } from 'svelte/store';

export const stackLinks = readable({
	html: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
	tailwindcss: 'https://tailwindcss.com/',
	python: 'https://www.python.org/',
	pyqt5: 'https://www.riverbankcomputing.com/software/pyqt/',
	flask: 'https://flask.palletsprojects.com/',
	sqlite: 'https://www.sqlite.org/index.html',
	bootstrap: 'https://getbootstrap.com/',
	javascript: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
	sveltekit: 'https://kit.svelte.dev/'
});
