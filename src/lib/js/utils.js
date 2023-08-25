import Clipbard from '$lib/images/clipboard.svg';
export function formatDate(date, dateStyle = 'medium', locales = 'en') {
	const formatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return formatter.format(new Date(date));
}

export function insertCopyButton(icon) {
	let pre = document.querySelectorAll('pre');
	pre.forEach((element) => {
		let copyButton = document.createElement('button');
		copyButton.innerText = 'copy';
		copyButton.classList =
			' opacity-80 p-1 rounded-lg w-fit dark:bg-dark absolute top-0 right-0 mx-2 bg-orang z-9999';
		copyButton.onclick = () => {
			copyUrlToClipboard(element.lastElementChild.innerText);
			copyButton.innerText = 'copied';
			setTimeout(() => {
				copyButton.innerText = 'copy';
			}, 3000);
		};
		element.classList.add('relative');
		element.insertBefore(copyButton, element.firstElementChild);
		console.log();
	});
}

export function copyUrlToClipboard(url) {
	navigator.clipboard
		.writeText(url)
		.then(() => {
			console.log('URL copied to clipboard:', url);
		})
		.catch((error) => {
			console.error('Failed to copy URL to clipboard:', error);
		});
}
