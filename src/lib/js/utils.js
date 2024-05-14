export function formatDate(date, dateStyle = 'medium', locales = 'en') {
	const formatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return formatter.format(new Date(date));
}

export function insertCopyButton(icon) {
	let pre = document.querySelectorAll('pre');

	pre.forEach((element) => {
		let copyButton = document.createElement('button');
		copyButton.innerText = 'copy';
		copyButton.classList.add('px-4', 'rounded-t-lg', 'text-sm', 'w-fit', 'z-9999');
		element.style.position = 'relative';
		copyButton.style.position = 'absolute';
		copyButton.style.color = 'white';
		copyButton.style.top = '2px';
		copyButton.style.right = '0';

		copyButton.onclick = () => {
			copyUrlToClipboard(element.lastElementChild.innerText);
			copyButton.innerText = 'copied';
			setTimeout(() => {
				copyButton.innerText = 'copy';
			}, 2000);
		};

		element.appendChild(copyButton);
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
