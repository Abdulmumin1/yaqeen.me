export function formatDate(date, dateStyle = 'medium', locales = 'en') {
	const formatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return formatter.format(new Date(date));
}

export function insertCopyButton(icon) {
	let pre = document.querySelectorAll('pre');
	pre.forEach((element) => {
		let div = document.createElement('div');
		div.classList =
			'w-full flex items-center justify-end bg-orange-200 dark:bg-stone-800 rounded-t-2xl';
		div.style.marginBottom = '-23px';
		let copyButton = document.createElement('button');
		copyButton.innerText = 'copy';
		copyButton.classList = ' px-4 rounded-t-lg  w-fit z-9999';
		copyButton.onclick = () => {
			copyUrlToClipboard(element.lastElementChild.innerText);
			copyButton.innerText = 'copied';
			setTimeout(() => {
				copyButton.innerText = 'copy';
			}, 2000);
		};
		div.appendChild(copyButton);
		element.classList.add('relative');
		element.insertAdjacentElement('beforebegin', div);
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
