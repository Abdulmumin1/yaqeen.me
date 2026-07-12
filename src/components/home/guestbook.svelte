<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getStroke } from 'perfect-freehand';
	import { onDestroy, tick } from 'svelte';

	const PAD_WIDTH = 520;
	const PAD_HEIGHT = 132;
	const MOON_IMPACT_DURATION = 300;
	const MOON_MESSAGE_VISIBLE_DURATION = 2000;
	const MOON_MESSAGE_FADE_DURATION = 220;
	const SHEET_NOISE = `url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='.12'%3E%3Crect x='1' y='2' width='1.2' height='1.2' rx='.2'/%3E%3Crect x='8' y='5' width='1.1' height='1.1' rx='.2'/%3E%3Crect x='14' y='1' width='1' height='1' rx='.2'/%3E%3Crect x='4' y='11' width='1.1' height='1.1' rx='.2'/%3E%3Crect x='11' y='13' width='1.2' height='1.2' rx='.2'/%3E%3Crect x='15' y='8' width='1' height='1' rx='.2'/%3E%3C/g%3E%3C/svg%3E")`;
	const CARD_BACKGROUND =
		'linear-gradient(180deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 0%) 32%), linear-gradient(135deg, rgb(255 255 255 / 14%), rgb(255 255 255 / 0%)), linear-gradient(180deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 94%, #ffffff) 100%)';
	const SIGNATURE_BACKGROUND =
		'linear-gradient(180deg, rgb(255 255 255 / 0.16), transparent), rgba(255, 255, 255, 0.08)';

	let moonStep = $state(0);
	let guestbookOpen = $state(false);
	let name = $state('');
	let message = $state('');
	let status = $state('');
	let saving = $state(false);
	let slotPresent = $state(false);
	let slotVisible = $state(false);
	let cardPresent = $state(false);
	let cardVisible = $state(false);
	let dismissing = $state(false);
	let drawing = $state(false);
	let completedStrokes = $state([]);
	let currentStroke = $state([]);
	let activePointerId = $state(null);
	let signaturePad = $state(null);
	let impactTimer;
	let cardTimer;
	let slotTimer;
	let messageTimer;
	let messageFadeTimer;
	let moonMessageVisible = $state(false);
	let moonMessageLeaving = $state(false);

	const d = new Date();
	const day = d.getDate();
	const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
	const year = d.getFullYear().toString().slice(-2);
	const formattedDate = `${day} ${month} '${year}`;

	const signaturePaths = $derived.by(() => {
		const paths = completedStrokes.map((stroke) => buildSignaturePath(stroke)).filter(Boolean);
		const activePath = buildSignaturePath(currentStroke);
		if (activePath) paths.push(activePath);
		return paths;
	});

	const hasSignature = $derived(signaturePaths.length > 0);
	const moonMessageText = $derived(moonStep >= 2 ? 'you did it!' : "you're onto something.");

	function orbitMoon() {
		if (!browser) return;
		if (dismissing) return;
		const nextStep = Math.min(moonStep + 1, 2);
		moonStep = nextStep;
		clearTimeout(messageFadeTimer);
		clearTimeout(messageTimer);
		messageTimer = setTimeout(() => {
			moonMessageVisible = true;
			moonMessageLeaving = false;

			messageFadeTimer = setTimeout(() => {
				moonMessageLeaving = true;
			}, MOON_MESSAGE_VISIBLE_DURATION - MOON_MESSAGE_FADE_DURATION);

			messageTimer = setTimeout(() => {
				moonMessageVisible = false;
				moonMessageLeaving = false;
				if (moonStep < 2) moonStep = 0;
			}, MOON_MESSAGE_VISIBLE_DURATION);
		}, MOON_IMPACT_DURATION);
		document.documentElement.classList.remove('moon-impact');
		requestAnimationFrame(() => document.documentElement.classList.add('moon-impact'));
		clearTimeout(impactTimer);
		impactTimer = setTimeout(() => {
			document.documentElement.classList.remove('moon-impact');
			if (nextStep === 2 && !slotPresent && !cardPresent) revealGuestbook();
		}, MOON_IMPACT_DURATION);
		navigator.vibrate?.(12);
	}

	function afterPaint(callback) {
		if (!browser) return;
		requestAnimationFrame(() => requestAnimationFrame(callback));
	}

	async function revealGuestbook() {
		dismissing = false;
		slotPresent = true;
		await tick();
		if (!browser) return;
		afterPaint(() => (slotVisible = true));
		slotTimer = setTimeout(() => {
			cardPresent = true;
			tick().then(() => afterPaint(() => (cardVisible = true)));
		}, 230);
	}

	function expandGuestbook() {
		if (!cardVisible || dismissing) return;
		guestbookOpen = true;
		status = '';
		navigator.vibrate?.(8);
	}

	function dismissGuestbook() {
		if (dismissing || (!slotPresent && !cardPresent)) return;
		dismissing = true;
		drawing = false;
		status = '';
		clearTimeout(slotTimer);
		cardVisible = false;
		cardTimer = setTimeout(() => {
			cardPresent = false;
			guestbookOpen = false;
			slotVisible = false;
			slotTimer = setTimeout(() => {
				slotPresent = false;
				moonStep = 0;
				dismissing = false;
			}, 210);
		}, 460);
	}

	function clearSignature() {
		completedStrokes = [];
		currentStroke = [];
		drawing = false;
		navigator.vibrate?.(5);
	}

	function getPadPoint(event) {
		const rect = signaturePad?.getBoundingClientRect();
		if (!rect) return null;
		const x = ((event.clientX - rect.left) / rect.width) * PAD_WIDTH;
		const y = ((event.clientY - rect.top) / rect.height) * PAD_HEIGHT;
		return [
			Math.max(10, Math.min(PAD_WIDTH - 10, x)),
			Math.max(10, Math.min(PAD_HEIGHT - 10, y)),
			event.pressure && Number.isFinite(event.pressure) ? event.pressure : 0.5
		];
	}

	function beginSignature(event) {
		if (!guestbookOpen || !signaturePad) return;
		const point = getPadPoint(event);
		if (!point) return;
		activePointerId = event.pointerId;
		drawing = true;
		currentStroke = [point];
		signaturePad.setPointerCapture(event.pointerId);
		status = '';
	}

	function moveSignature(event) {
		if (!drawing || event.pointerId !== activePointerId) return;
		const point = getPadPoint(event);
		if (!point) return;
		const previous = currentStroke[currentStroke.length - 1];
		if (previous && Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 0.8) return;
		currentStroke = [...currentStroke, point];
	}

	function endSignature(event) {
		if (event.pointerId !== activePointerId) return;
		if (currentStroke.length > 0) {
			completedStrokes = [...completedStrokes, currentStroke];
		}
		drawing = false;
		currentStroke = [];
		activePointerId = null;
		signaturePad?.releasePointerCapture(event.pointerId);
	}

	function cancelSignature(event) {
		if (event.pointerId !== activePointerId) return;
		drawing = false;
		currentStroke = [];
		activePointerId = null;
		signaturePad?.releasePointerCapture(event.pointerId);
	}

	function buildSignaturePath(points) {
		if (!points?.length) return '';
		const normalized =
			points.length === 1
				? [points[0], [points[0][0] + 0.01, points[0][1] + 0.01, points[0][2]]]
				: points;
		const stroke = getStroke(normalized, {
			size: 7,
			thinning: 0.62,
			smoothing: 0.7,
			streamline: 0.42,
			simulatePressure: true,
			last: true
		});
		return stroke.length ? getSvgPathFromStroke(stroke) : '';
	}

	function getSvgPathFromStroke(stroke) {
		if (!stroke.length) return '';
		const [firstX, firstY] = stroke[0];
		let path = `M ${firstX.toFixed(2)} ${firstY.toFixed(2)} Q`;

		for (let index = 0; index < stroke.length; index += 1) {
			const [x0, y0] = stroke[index];
			const [x1, y1] = stroke[(index + 1) % stroke.length];
			path += ` ${x0.toFixed(2)} ${y0.toFixed(2)} ${((x0 + x1) / 2).toFixed(2)} ${((y0 + y1) / 2).toFixed(2)}`;
		}

		return `${path} Z`;
	}

	async function signGuestbook() {
		if (!name.trim() || !message.trim() || !hasSignature || saving) return;
		saving = true;
		status = '';

		try {
			const response = await fetch('/api/guestbook', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name,
					message,
					cardColor: '#D4A5A5',
					signaturePaths: [...signaturePaths]
				})
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error);
			status = 'Placed in the garden.';
			message = '';
			clearSignature();
		} catch (error) {
			status = error.message || 'That note did not make it through. Try again?';
		} finally {
			saving = false;
		}
	}

	onDestroy(() => {
		clearTimeout(impactTimer);
		clearTimeout(cardTimer);
		clearTimeout(slotTimer);
		clearTimeout(messageTimer);
		clearTimeout(messageFadeTimer);
		if (browser) {
			document.documentElement.classList.remove('moon-impact');
		}
	});
</script>

<div class="relative mb-8 w-fit">
	<button
		type="button"
		class="moon-trigger grid size-10 cursor-pointer place-items-center rounded-full"
		onclick={orbitMoon}
		aria-label="Open the moon's guestbook invitation"
	>
		<img src="/favicon.png" alt="" class="size-10 opacity-80 grayscale dark:invert" />
	</button>

	{#if moonMessageVisible && moonStep >= 1}
		<div class="absolute top-0 left-[3.25rem] flex h-10 items-center">
			<p
				aria-live="polite"
				class:leaving={moonMessageLeaving}
				class="moon-message m-0 max-w-[min(15rem,calc(100vw-6rem))] w-max font-[var(--font-meri)] text-[0.75rem] leading-none italic text-text-muted"
			>
				{moonMessageText}
			</p>
		</div>
	{/if}

	{#if slotPresent || cardPresent}
		<button
			type="button"
			class="fixed inset-0 z-[99] cursor-default bg-transparent"
			aria-label="Close guest card"
			onclick={dismissGuestbook}
		></button>

		<div
			class:expanded={guestbookOpen}
			class:card-visible={cardVisible}
			class="guest-card-stage fixed top-0 left-1/2 z-[100] w-[min(33rem,calc(100vw-1rem))] -translate-x-1/2 pt-[7px] sm:w-[min(100vw-0.65rem,33rem)]"
		>
			{#if slotPresent}
				<div
					aria-hidden="true"
					class:visible={slotVisible}
					class="card-slot pointer-events-none absolute top-0 left-1/2 z-[2] h-2 w-[calc(100%+0.7rem)] rounded-b-[999px] border border-white/14 shadow-[0_1px_0_rgb(255_255_255_/_10%),0_4px_10px_rgb(0_0_0_/_34%)]"
				></div>
			{/if}

			{#if cardPresent}
				<section
					class:expanded={guestbookOpen}
					class:visible={cardVisible}
					class="top-sheet relative min-h-[5.25rem] w-full origin-top border border-t-0 border-[rgb(255_255_255_/_14%)] text-[#ffffff]"
					class:overflow-y-auto={guestbookOpen}
					style:background={CARD_BACKGROUND}
				>
					<div
						aria-hidden="true"
						class="pointer-events-none absolute inset-0 opacity-[0.72] mix-blend-multiply"
						style:background-image={`${SHEET_NOISE}, linear-gradient(180deg, rgb(255 255 255 / 0.14), transparent 38%)`}
						style:background-size="18px 18px, 100% 100%"
					></div>

					{#if !guestbookOpen}
						<button
							class="card-preview relative flex h-21 w-full cursor-pointer flex-col items-start justify-center px-1 py-1 text-left sm:px-[1rem]"
							type="button"
							onclick={expandGuestbook}
						>
							<span class=" text-[0.62rem] tracking-[0.2em] text-[#7b5257]"> GUEST CARD </span>
							<strong
								class="mt-[0.16rem] font-meri text-[clamp(1.18rem,3.8vw,1.1rem)] font-normal italic leading-[1.03] tracking-[-0.02em] text-[#ffffff] [text-wrap:balance]"
							>
								Thank you for visiting!
							</strong>
						</button>
					{:else}
						<form
							class="guestbook-form relative px-[1.15rem] pt-4 pb-[1.05rem] sm:px-[0.95rem]"
							onsubmit={(event) => {
								event.preventDefault();
								signGuestbook();
							}}
						>
							<div class="flex items-start justify-between gap-4">
								<div>
									<span class="font-visby text-[0.62rem] font-bold tracking-[0.2em] text-[#7b5257]">
										GUEST CARD
									</span>
									<h3
										class="mt-[0.16rem] mb-0 font-meri text-[clamp(1.18rem,3.8vw,1.6rem)] font-normal italic leading-[1.03] tracking-[-0.02em] text-[#ffffff] [text-wrap:balance]"
									>
										Thank you for visiting!
									</h3>
								</div>
								<button
									type="button"
									class="card-close -mt-[0.72rem] -mr-[0.72rem] grid min-h-11 min-w-11 place-items-center rounded-full text-[1.25rem] text-[#7b5257] opacity-[0.72]"
									aria-label="Close guest card"
									onclick={dismissGuestbook}
								>
									×
								</button>
							</div>

							<div
								class="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-[0.9rem] max-sm:grid-cols-1 max-sm:gap-3"
							>
								<div class="min-w-0">
									<label
										for="guest-name"
										class="font-[var(--font-visby)] text-[0.62rem] font-bold tracking-[0.2em] text-[#7b5257]"
									>
										NAME
									</label>
									<div class="relative mt-[0.2rem] flex items-center">
										<input
											id="guest-name"
											bind:value={name}
											maxlength="40"
											autocomplete="name"
											placeholder="Your name"
											required
											class="w-full border-0 border-b border-[rgb(255_255_255_/_24%)] bg-transparent px-0 pt-0 pr-6 pb-[0.38rem] font-[var(--font-meri)] text-[0.98rem] italic leading-[1.4] text-[#ffffff] outline-none transition-colors duration-200 placeholder:text-[rgb(255_255_255_/_44%)] focus:border-b-[rgb(255_255_255_/_54%)]"
										/>
										{#if name.trim().length > 0}
											<span
												class="absolute right-[0.18rem] bottom-[0.55rem] flex size-4 items-center justify-center rounded-full bg-[rgb(255_255_255_/_8%)] text-[0.58rem] font-bold text-[#ffffff]"
											>
												✓
											</span>
										{/if}
									</div>
								</div>

								<div class="w-[6.9rem] min-w-0 max-sm:w-full">
									<span
										class="font-[var(--font-visby)] text-[0.62rem] font-bold tracking-[0.2em] text-[#7b5257]"
									>
										VISITED
									</span>
									<div
										class="w-full border-0 border-b border-[rgb(255_255_255_/_24%)] bg-transparent px-0 pt-0 pr-0 pb-[0.38rem] font-[var(--font-meri)] text-[0.98rem] italic leading-[1.4] text-[#ffffff] outline-none"
									>
										{formattedDate}
									</div>
								</div>
							</div>

							<div class="mt-[0.82rem] min-w-0">
								<div class="flex items-baseline justify-between gap-3">
									<label
										for="guest-message"
										class="font-[var(--font-visby)] text-[0.62rem] font-bold tracking-[0.2em] text-[#7b5257]"
									>
										MESSAGE
									</label>
									<span class="font-[var(--font-visby)] text-[0.62rem] text-[#7b5257] tabular-nums">
										{message.length}/280
									</span>
								</div>
								<div class="relative mt-[0.2rem] flex items-center">
									<textarea
										id="guest-message"
										bind:value={message}
										maxlength="280"
										rows="2"
										placeholder="Leave a short note"
										required
										class="min-h-12 w-full resize-none border-0 border-b border-[rgb(255_255_255_/_24%)] bg-transparent px-0 pt-0 pr-6 pb-[0.38rem] font-[var(--font-meri)] text-[0.98rem] italic leading-[1.4] text-[#ffffff] outline-none transition-colors duration-200 placeholder:text-[rgb(255_255_255_/_44%)] focus:border-b-[rgb(255_255_255_/_54%)]"
									></textarea>
									{#if message.trim().length > 0}
										<span
											class="absolute right-[0.18rem] bottom-[0.55rem] flex size-4 items-center justify-center rounded-full bg-[rgb(255_255_255_/_8%)] text-[0.58rem] font-bold text-[#ffffff]"
										>
											✓
										</span>
									{/if}
								</div>
							</div>

							<div class="mt-[0.9rem] min-w-0">
								<div class="flex items-baseline justify-between gap-3">
									<label
										for="guest-signature"
										class="font-[var(--font-visby)] text-[0.62rem] font-bold tracking-[0.2em] text-[#7b5257]"
									>
										SIGNATURE
									</label>
									<button
										type="button"
										class="ghost-button min-h-8 cursor-pointer p-0 font-[var(--font-visby)] text-[0.68rem] uppercase tracking-[0.08em] text-[#7b5257] disabled:cursor-not-allowed disabled:opacity-[0.35]"
										onclick={clearSignature}
										disabled={!hasSignature && !drawing}
									>
										clear
									</button>
								</div>

								<div
									id="guest-signature"
									bind:this={signaturePad}
									role="img"
									aria-label="Draw your signature"
									onpointerdown={beginSignature}
									onpointermove={moveSignature}
									onpointerup={endSignature}
									onpointerleave={endSignature}
									onpointercancel={cancelSignature}
									class="after:content-[''] relative mt-[0.28rem] min-h-28 w-full overflow-hidden rounded-t-[0.95rem] rounded-b-[0.4rem] border-b border-[rgb(255_255_255_/_24%)] touch-none shadow-[inset_0_0_0_1px_rgb(255_255_255_/_12%),inset_0_-1px_0_rgb(255_255_255_/_7%)] after:absolute after:right-4 after:bottom-[1.15rem] after:left-4 after:h-px after:bg-[linear-gradient(90deg,transparent,rgb(255_255_255_/_25%),transparent)]"
									class:after:opacity-75={hasSignature}
									style:background={SIGNATURE_BACKGROUND}
								>
									<svg
										viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}
										aria-hidden="true"
										class="relative block h-28 w-full"
									>
										{#each signaturePaths as path, index (`${index}-${path.length}`)}
											<path d={path} fill="#ffffff"></path>
										{/each}
									</svg>

									{#if !hasSignature}
										<div class="pointer-events-none absolute inset-0 grid place-items-center">
											<span
												class="translate-y-4 -rotate-3 font-[var(--font-meri)] text-[1rem] italic text-[rgb(255_255_255_/_36%)]"
											>
												sign here
											</span>
										</div>
									{/if}
								</div>
							</div>

							<div class="mt-[0.95rem] flex items-center justify-between gap-4">
								<button
									class="submit-button min-h-10 cursor-pointer rounded-full bg-[#ffffff] px-4 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-[0.62]"
									type="submit"
									disabled={saving || !hasSignature}
								>
									{saving ? 'placing...' : 'sign card'}
								</button>

								<button
									class="min-h-10 cursor-pointer font-[var(--font-visby)] text-[0.74rem] tracking-[0.05em] text-[#7b5257] underline underline-offset-[0.28rem]"
									type="button"
									onclick={() => goto(resolve('/garden'))}
								>
									view garden
								</button>
							</div>

							{#if status}
								<p
									aria-live="polite"
									class="mt-[0.7rem] mb-0 font-[var(--font-visby)] text-[0.76rem] text-[#7b5257]"
								>
									{status}
								</p>
							{/if}
						</form>
					{/if}
				</section>
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(html.moon-impact) {
		animation: moon-impact 280ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
	}

	.moon-trigger {
		transition: transform 150ms ease-out;
	}

	.moon-trigger:active {
		transform: scale(0.96);
	}

	.moon-message {
		animation: note-in 340ms cubic-bezier(0.2, 0, 0, 1) both;
		will-change: transform, opacity, filter;
	}

	.moon-message.leaving {
		animation: note-out 220ms cubic-bezier(0.4, 0, 1, 1) both;
	}

	.guest-card-stage::before {
		content: '';
		position: absolute;
		z-index: -1;
		top: 0;
		left: 10%;
		width: 80%;
		height: 12rem;
		background: radial-gradient(ellipse at 50% 0%, rgb(233 145 145 / 40%), transparent 72%);
		opacity: 0;
		pointer-events: none;
		transition: opacity 320ms ease;
	}

	.guest-card-stage.card-visible::before {
		opacity: 0.82;
	}

	.guest-card-stage.expanded.card-visible::before {
		opacity: 0.56;
	}

	.card-slot {
		opacity: 0;
		transform: translate(-50%, -100%);
		background: linear-gradient(180deg, #090909 0%, #1a1515 50%, #050505 100%);
		transition:
			transform 210ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 150ms ease-out;
		will-change: transform, opacity;
	}

	.card-slot.visible {
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.top-sheet {
		max-height: 5.25rem;
		overflow: hidden;
		border-radius: 0 0 1.2rem 1.2rem;
		box-shadow:
			0 16px 34px rgb(69 33 41 / 18%),
			0 0 54px rgb(219 145 145 / 24%);
		opacity: 0;
		transform: translate3d(0, -110%, 0) scaleY(0.985);
		transition:
			transform 460ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 240ms ease-out,
			max-height 480ms cubic-bezier(0.16, 1, 0.3, 1),
			border-radius 320ms cubic-bezier(0.2, 0, 0, 1),
			box-shadow 320ms cubic-bezier(0.2, 0, 0, 1);
		will-change: transform, opacity;
	}

	.top-sheet.visible {
		opacity: 1;
		transform: translate3d(0, 0, 0) scaleY(1);
	}

	.top-sheet.expanded {
		max-height: min(34rem, calc(100dvh - 0.85rem));
		border-radius: 0 0 1.65rem 1.65rem;
		box-shadow:
			0 26px 50px rgb(69 33 41 / 20%),
			0 0 76px rgb(219 145 145 / 22%);
	}

	.card-preview {
		transition: transform 180ms cubic-bezier(0.2, 0, 0, 1);
	}

	.card-preview:active {
		transform: scale(0.96);
	}

	.guestbook-form {
		animation: form-in 360ms 90ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	.card-close {
		transition:
			opacity 160ms ease,
			transform 160ms cubic-bezier(0.2, 0, 0, 1);
	}

	.card-close:hover {
		opacity: 1;
	}

	.card-close:active {
		transform: scale(0.96);
	}

	.ghost-button {
		transition:
			transform 160ms cubic-bezier(0.2, 0, 0, 1),
			opacity 160ms ease;
	}

	.ghost-button:active {
		transform: scale(0.96);
	}

	.submit-button {
		transition:
			transform 150ms ease-out,
			background-color 180ms ease,
			opacity 180ms ease;
	}

	.submit-button:active {
		transform: scale(0.96);
	}

	@keyframes moon-impact {
		0%,
		100% {
			transform: translateX(0);
		}
		18% {
			transform: translateX(-3px) rotate(-0.08deg);
		}
		36% {
			transform: translateX(3px) rotate(0.08deg);
		}
		54% {
			transform: translateX(-2px);
		}
		72% {
			transform: translateX(1px);
		}
	}

	@keyframes note-in {
		from {
			opacity: 0;
			filter: blur(4px);
			transform: translateX(-0.35rem);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateX(0);
		}
	}

	@keyframes note-out {
		from {
			opacity: 1;
			filter: blur(0);
			transform: translateX(0);
		}
		to {
			opacity: 0;
			filter: blur(4px);
			transform: translateX(-0.15rem);
		}
	}

	@keyframes form-in {
		from {
			opacity: 0;
			filter: blur(4px);
			transform: translateY(-0.6rem) scale(0.985);
		}
		to {
			opacity: 1;
			filter: blur(0);
			transform: translateY(0) scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.moon-trigger,
		.moon-message,
		.card-preview,
		.guestbook-form,
		.card-close,
		.ghost-button,
		.submit-button,
		.guest-card-stage::before,
		.card-slot,
		.top-sheet {
			animation: none;
			transition: none;
		}
	}
</style>
