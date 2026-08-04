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
	const DAY_IN_MILLISECONDS = 86_400_000;
	const SYNODIC_MONTH_IN_DAYS = 29.530588853;
	const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

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
	const moonPhase = getMoonPhase(d);

	function getMoonPhase(date) {
		// Noon UTC keeps the server and browser on the same daily phase during hydration.
		const phaseDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
		const elapsedDays = (phaseDate - KNOWN_NEW_MOON) / DAY_IN_MILLISECONDS;
		const ageInDays =
			((elapsedDays % SYNODIC_MONTH_IN_DAYS) + SYNODIC_MONTH_IN_DAYS) % SYNODIC_MONTH_IN_DAYS;
		const progress = ageInDays / SYNODIC_MONTH_IN_DAYS;
		const illumination = Math.round(((1 - Math.cos(progress * Math.PI * 2)) / 2) * 100);

		return {
			name: getMoonPhaseName(progress, illumination),
			illumination,
			path: buildMoonPhasePath(progress)
		};
	}

	function getMoonPhaseName(progress, illumination) {
		if (illumination === 0) return 'New moon';
		if (illumination === 100) return 'Full moon';
		if (illumination === 50) return progress < 0.5 ? 'First quarter' : 'Last quarter';
		if (progress < 0.5) return illumination < 50 ? 'Waxing crescent' : 'Waxing gibbous';
		return illumination > 50 ? 'Waning gibbous' : 'Waning crescent';
	}

	function buildMoonPhasePath(progress) {
		const center = 20;
		const radius = 19.4;
		const segments = 36;
		const waxing = progress < 0.5;
		const terminatorDirection = Math.cos(progress * Math.PI * 2) * (waxing ? 1 : -1);
		const limb = [];
		const terminator = [];

		for (let index = 0; index <= segments; index += 1) {
			const y = -radius + (index / segments) * radius * 2;
			const halfWidth = Math.sqrt(Math.max(0, radius * radius - y * y));
			const limbX = center + halfWidth * (waxing ? 1 : -1);
			const terminatorX = center + halfWidth * terminatorDirection;
			limb.push(`${limbX.toFixed(2)} ${(center + y).toFixed(2)}`);
			terminator.unshift(`${terminatorX.toFixed(2)} ${(center + y).toFixed(2)}`);
		}

		return `M ${limb.join(' L ')} L ${terminator.join(' L ')} Z`;
	}

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
		const wrapper = document.getElementById('layout-wrapper');
		if (wrapper) {
			wrapper.classList.remove('moon-impact');
			void wrapper.offsetWidth;
			wrapper.classList.add('moon-impact');
		}
		requestAnimationFrame(() => {
			document.documentElement.classList.add('moon-impact');
		});
		clearTimeout(impactTimer);
		impactTimer = setTimeout(() => {
			document.documentElement.classList.remove('moon-impact');
			if (wrapper) wrapper.classList.remove('moon-impact');
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
			const wrapper = document.getElementById('layout-wrapper');
			if (wrapper) wrapper.classList.remove('moon-impact');
		}
	});
</script>

<div class="relative mb-8 w-fit">
	<button
		type="button"
		class="moon-trigger grid size-10 cursor-pointer place-items-center rounded-full"
		onclick={orbitMoon}
		aria-label="Open the moon's guestbook invitation"
		aria-describedby="moon-phase-tooltip"
	>
		<svg aria-hidden="true" class="moon size-10" viewBox="0 0 40 40">
			<defs>
				<mask
					id="moon-silhouette"
					maskUnits="userSpaceOnUse"
					x="0"
					y="0"
					width="40"
					height="40"
					style="mask-type: alpha"
				>
					<image href="/favicon.png" width="40" height="40" />
				</mask>
				<clipPath id="current-moon-phase" clipPathUnits="userSpaceOnUse">
					<path d={moonPhase.path} />
				</clipPath>
			</defs>
			<circle class="moon-shadow" cx="20" cy="20" r="20" mask="url(#moon-silhouette)" />
			<image href="/favicon.png" width="40" height="40" class="moon-texture moon-earthshine" />
			<image
				href="/favicon.png"
				width="40"
				height="40"
				clip-path="url(#current-moon-phase)"
				class="moon-texture moon-lit"
			/>
		</svg>
	</button>

	<div
		id="moon-phase-tooltip"
		role="tooltip"
		class:moon-message-active={moonMessageVisible}
		class="moon-phase-tooltip pointer-events-none absolute top-0 left-[3.25rem] flex h-10 items-center"
	>
		<p class="m-0 w-max font-visby text-[0.7rem] leading-none whitespace-nowrap text-text-muted">
			{moonPhase.name.toLowerCase()} · {moonPhase.illumination}% illuminated
		</p>
	</div>

	{#if moonMessageVisible && moonStep >= 1}
		<div class="absolute top-0 left-[3.25rem] flex h-10 items-center">
			<p
				aria-live="polite"
				class:leaving={moonMessageLeaving}
				class="moon-message m-0 max-w-[min(15rem,calc(100vw-6rem))] w-max font-visby text-[0.75rem] leading-none text-text-muted"
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
					class="card-slot pointer-events-none absolute top-0 left-1/2 z-[2] h-2 w-[calc(100%+0.7rem)] border border-accent/20"
				></div>
			{/if}

			{#if cardPresent}
				<section
					class:expanded={guestbookOpen}
					class:visible={cardVisible}
					class="top-sheet relative min-h-[5.25rem] w-full origin-top border border-t-0 border-accent/10 bg--muted text-text-main"
					class:overflow-y-auto={guestbookOpen}
				>
					<div
						aria-hidden="true"
						class="guestbook-dither pointer-events-none absolute inset-0"
					></div>
					<svg
						aria-hidden="true"
						class="guestbook-sketch-border pointer-events-none absolute inset-0"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<path
							d="M0.4 0.5 C18 0.1 34 0.8 50 0.35 C67 -0.15 84 0.55 99.5 0.25 M99.35 0.15 C100.2 22 99.1 47 99.65 70 C100.05 84 99.2 92 99.55 99.25 M99.4 99.1 C82 99.8 66 99.15 49 99.45 C32 99.9 17 99.05 0.55 99.55 M0.4 99.4 C-0.15 82 0.65 66 0.25 49 C-0.2 31 0.7 16 0.4 0.4"
						/>
					</svg>

					{#if !guestbookOpen}
						<button
							class="card-preview relative flex h-21 w-full cursor-pointer flex-col items-start justify-center px-1 py-1 text-left sm:px-[1rem]"
							type="button"
							onclick={expandGuestbook}
						>
							<strong
								class="mt-[0.16rem] font-pixel text-[clamp(1.5rem,7vw,2rem)] font-normal leading-[1.03] text-text-main whitespace-nowrap"
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
									<h3
										class="mt-[0.16rem] mb-0 font-pixel text-[clamp(1.5rem,7vw,2.8rem)] font-normal leading-[1.03] text-text-main whitespace-nowrap"
										style="font-family: var(--font-pixel)"
									>
										Thank you for visiting!
									</h3>
								</div>
								<button
									type="button"
									class="card-close -mt-[0.72rem] -mr-[0.72rem] grid min-h-11 min-w-11 place-items-center text-[1.25rem] text-text-muted hover:text-accent/65"
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
										class="font-visby text-[0.62rem] font-bold tracking-[0.2em] text-text-muted/60"
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
											class="w-full border-0 border-b border-text-muted/20 bg-transparent px-0 pt-0 pr-6 pb-[0.38rem] font-visby text-[0.98rem] leading-[1.4] text-text-main outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-accent/55"
										/>
										{#if name.trim().length > 0}
											<span
												class="absolute right-[0.18rem] bottom-[0.55rem] flex size-4 items-center justify-center bg-accent/75 text-[0.58rem] font-bold text-surface"
											>
												✓
											</span>
										{/if}
									</div>
								</div>

								<div class="w-[6.9rem] min-w-0 max-sm:w-full">
									<span
										class="font-visby text-[0.62rem] font-bold tracking-[0.2em] text-text-muted/60"
									>
										VISITED
									</span>
									<div class="relative mt-[0.2rem] flex items-center">
										<div
											class="w-full border-0 border-b border-text-muted/20 bg-transparent px-0 pt-0 pr-0 pb-[0.38rem] font-visby text-[0.98rem] leading-[1.4] text-text-main outline-none"
										>
											{formattedDate}
										</div>
									</div>
								</div>
							</div>

							<div class="mt-[0.82rem] min-w-0">
								<div class="flex items-baseline justify-between gap-3">
									<label
										for="guest-message"
										class="font-visby text-[0.62rem] font-bold tracking-[0.2em] text-text-muted/60"
									>
										MESSAGE
									</label>
									<span class="font-visby text-[0.62rem] text-text-muted/60 tabular-nums">
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
										class="min-h-12 w-full resize-none border-0 border-b border-text-muted/10 bg-transparent px-0 pt-0 pr-6 pb-[0.38rem] font-visby text-[0.98rem] leading-[1.4] text-text-main outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-accent/55"
									></textarea>
									{#if message.trim().length > 0}
										<span
											class="absolute right-[0.18rem] bottom-[0.55rem] flex size-4 items-center justify-center bg-accent/75 text-[0.58rem] font-bold text-surface"
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
										class="font-visby text-[0.62rem] font-bold tracking-[0.2em] text-text-muted/60"
									>
										SIGNATURE
									</label>
									<button
										type="button"
										class="ghost-button min-h-8 cursor-pointer p-0 font-visby text-[0.68rem] uppercase tracking-[0.08em] text-text-muted hover:text-accent/65 disabled:cursor-not-allowed disabled:opacity-[0.35]"
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
									class="signature-pad after:content-[''] relative mt-[0.28rem] min-h-28 w-full overflow-hidden bg-transparent touch-none text-text-main after:absolute after:right-4 after:bottom-[1.15rem] after:left-4 after:h-px after:bg-border"
									class:after:opacity-75={hasSignature}
								>
									<svg
										viewBox={`0 0 ${PAD_WIDTH} ${PAD_HEIGHT}`}
										aria-hidden="true"
										class="relative block h-28 w-full"
									>
										{#each signaturePaths as path, index (`${index}-${path.length}`)}
											<path d={path} fill="currentColor"></path>
										{/each}
									</svg>

									{#if !hasSignature}
										<div class="pointer-events-none absolute inset-0 grid place-items-center">
											<span class="translate-y-4 -rotate-3 font-visby text-[1rem] text-text-muted">
												sign here
											</span>
										</div>
									{/if}
								</div>
							</div>

							<div class="mt-[0.95rem] flex items-center justify-between gap-4">
								<button
									class="min-h-10 cursor-pointer font-visby text-[0.74rem] tracking-[0.05em] text-text-muted underline underline-offset-[0.28rem] hover:text-accent/65"
									type="button"
									onclick={() => goto(resolve('/garden'))}
								>
									view garden
								</button>

								<button
									class:saving
									class="submit-button inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-surface disabled:cursor-not-allowed disabled:opacity-[0.62]"
									type="submit"
									disabled={saving || !hasSignature}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="submit-signature-icon shrink-0"
										aria-hidden="true"
									>
										<path
											d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"
										/>
										<path d="M3 21h18" />
									</svg>
									<span>{saving ? 'signing...' : 'sign card'}</span>
								</button>
							</div>

							{#if status}
								<p
									aria-live="polite"
									class="mt-[0.7rem] mb-0 font-visby text-[0.76rem] text-text-muted"
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

	.moon-texture {
		filter: grayscale(1);
	}

	.moon-shadow {
		fill: #57534e;
	}

	.moon-earthshine {
		opacity: 0.18;
	}

	.moon-lit {
		opacity: 0.82;
	}

	:global(.dark) .moon-shadow {
		fill: #292524;
	}

	.moon-phase-tooltip {
		opacity: 0;
		filter: blur(3px);
		transform: translateX(-0.25rem);
		transition:
			opacity 160ms ease-out,
			filter 160ms ease-out,
			transform 160ms ease-out;
	}

	.moon-trigger:hover ~ .moon-phase-tooltip:not(.moon-message-active),
	.moon-trigger:focus-visible ~ .moon-phase-tooltip:not(.moon-message-active) {
		opacity: 1;
		filter: blur(0);
		transform: translateX(0);
	}

	.moon-message {
		animation: note-in 340ms cubic-bezier(0.2, 0, 0, 1) both;
		will-change: transform, opacity, filter;
	}

	.moon-message.leaving {
		animation: note-out 220ms cubic-bezier(0.4, 0, 1, 1) both;
	}

	.card-slot {
		opacity: 0;
		transform: translate(-50%, -100%);
		background: var(--color-text-main);
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
		border-radius: 0;
		border-color: transparent;
		background-color: color-mix(in srgb, var(--color-surface-muted) 86%, transparent);
		/*box-shadow:
			0 16px 34px color-mix(in srgb, var(--color-text-main) 12%, transparent),
			0 0 54px color-mix(in srgb, var(--color-accent) 16%, transparent);*/
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
		border-radius: 0;
		/*box-shadow:
			0 26px 50px color-mix(in srgb, var(--color-text-main) 14%, transparent),
			0 0 76px color-mix(in srgb, var(--color-accent) 14%, transparent);*/
	}

	.guestbook-sketch-border {
		z-index: 2;
		overflow: visible;
	}

	.guestbook-sketch-border path {
		fill: none;
		stroke: color-mix(in srgb, var(--color-accent) 22%, transparent);
		stroke-width: 0.15;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.guestbook-dither {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--color-surface-muted) 92%, var(--color-accent) 12%) 0%,
			color-mix(in srgb, var(--color-surface-muted) 82%, transparent) 44%,
			color-mix(in srgb, var(--color-surface-muted) 72%, transparent) 76%,
			color-mix(in srgb, var(--color-surface-muted) 58%, transparent) 100%
		);
		backdrop-filter: blur(28px) saturate(0.72);
		-webkit-backdrop-filter: blur(28px) saturate(0.72);
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
		background-color: color-mix(in srgb, var(--color-accent) 72%, var(--color-surface-muted));
		background-image:
			linear-gradient(180deg, rgb(255 255 255 / 0.24), rgb(255 255 255 / 0) 48%),
			radial-gradient(circle at 22% 18%, rgb(255 255 255 / 0.26), transparent 24%),
			radial-gradient(circle at 76% 82%, rgb(0 0 0 / 0.1), transparent 28%);

		transition:
			transform 150ms ease-out,
			background-color 180ms ease,
			box-shadow 180ms ease,
			opacity 180ms ease;
	}

	.submit-button:active {
		transform: scale(0.96);
	}

	.submit-signature-icon path {
		stroke-dasharray: 42;
		stroke-dashoffset: 0;
	}

	.submit-button.saving .submit-signature-icon path {
		animation: signature-stroke 950ms cubic-bezier(0.65, 0, 0.35, 1) infinite;
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

	@keyframes signature-stroke {
		0% {
			stroke-dashoffset: 42;
			opacity: 0.45;
		}
		45%,
		70% {
			stroke-dashoffset: 0;
			opacity: 1;
		}
		100% {
			stroke-dashoffset: -42;
			opacity: 0.45;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.moon-trigger,
		.moon-phase-tooltip,
		.moon-message,
		.card-preview,
		.guestbook-form,
		.card-close,
		.ghost-button,
		.submit-button,
		.card-slot,
		.top-sheet {
			animation: none;
			transition: none;
		}
	}
</style>
