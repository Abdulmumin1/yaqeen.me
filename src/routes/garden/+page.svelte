<script>
	import { faAdd, faBroom, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Seo from '$components/general/seo.svelte';
	import { siteOrigin } from '$lib/js/config.js';
	import getStroke from 'perfect-freehand';
	import Fa from 'svelte-fa';

	import { createClient } from 'rivetkit/client';
	import { onMount } from 'svelte';

	export function generateRandomKey(length = 32) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
		const bytes = crypto.getRandomValues(new Uint8Array(length));
		let result = '';

		for (let i = 0; i < length; i++) {
			result += chars[bytes[i] % chars.length];
		}

		return result;
	}

	const rivetClient = createClient(
		'https://yaqeen-garden-rivet-actor.avdorr12345.workers.dev/rivet'
	);

	let { drawings = [], onDrawingsChange = () => {} } = $props();

	let sessionId = $state(null);
	let drawing = $state(false);
	let currentPoints = $state([]);
	let strokes = $state([]);

	let canvas;
	let smallCanvas;

	let offsetX = $state(0);
	let offsetY = $state(0);
	let scale = $state(1);

	let lastPanX = $state(0);
	let lastPanY = $state(0);

	let currentColor = $state('#1c1917');
	let currentSize = $state(4);

	let placedDrawings = $state(drawings);
	let selectedDrawing = $state(null);
	let dragging = $state(false);
	let resizing = $state(false);
	let rotating = $state(false);
	let initialScale = $state(1);
	let initialDistance = $state(0);
	let initialRotation = $state(0);
	let initialAngle = $state(0);
	let currentCursor = $state('default');

	let rivetConnection = $state(null);

	const colors = [
		'#1c1917', // Warm Ink Black
		'#ef4444', // Vermilion Red
		'#10b981', // Emerald Green
		'#3b82f6', // Royal Blue
		'#f59e0b', // Deep Amber
		'#d946ef', // Fuchsia Orchid
		'#06b6d4', // Cyan Teal
		'#f97316' // Burnt Orange
	];
	const sizes = [2, 4, 8, 16, 32];

	function getPoint(e, canvasElement) {
		const rect = canvasElement.getBoundingClientRect();
		const touch = e.touches?.[0];
		const clientX = touch ? touch.clientX : e.clientX;
		const clientY = touch ? touch.clientY : e.clientY;
		const screenX = clientX - rect.left;
		const screenY = clientY - rect.top;

		if (canvasElement === canvas) {
			const worldX = (screenX - offsetX) / scale;
			const worldY = (screenY - offsetY) / scale;
			return { x: worldX, y: worldY };
		} else {
			return { x: screenX, y: screenY };
		}
	}

	function handleDrawingStart(e) {
		const targetCanvas = e.currentTarget;
		selectedDrawing = null;
		if (targetCanvas === canvas) return;

		drawing = true;
		const { x, y } = getPoint(e, targetCanvas);
		currentPoints = [[x, y]];
		strokes.push(currentPoints);
		drawSmallCanvas();
	}

	function handleDrawingMove(e) {
		e.preventDefault();
		const targetCanvas = e.currentTarget;
		if (targetCanvas === canvas) return;

		if (!drawing) return;
		const { x, y } = getPoint(e, targetCanvas);
		currentPoints.push([x, y]);
		drawSmallCanvas();
	}

	function handleDrawingEnd() {
		drawing = false;
	}

	function drawSmallCanvas() {
		if (!smallCanvas) return;
		const ctx = smallCanvas.getContext('2d');
		ctx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
		const options = {
			size: currentSize,
			smoothing: 0.5,
			thinning: 0.5,
			streamline: 0.5,
			easing: (t) => t,
			start: { taper: 0, cap: true },
			end: { taper: 0, cap: true }
		};
		strokes.forEach((points) => {
			const stroke = getStroke(points, options);
			if (stroke.length) {
				const path = new Path2D();
				path.moveTo(stroke[0][0], stroke[0][1]);
				stroke.forEach((p) => path.lineTo(p[0], p[1]));
				ctx.fillStyle = currentColor;
				ctx.fill(path);
			}
		});
	}

	function clearSmallCanvas() {
		if (smallCanvas) {
			const ctx = smallCanvas.getContext('2d');
			ctx.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
			strokes = [];
			currentPoints = [];
		}
	}

	async function deleteSelectedDrawing() {
		if (selectedDrawing) {
			const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
			if (drawing && drawing.sessionId === sessionId) {
				let deletedId = selectedDrawing;
				const index = placedDrawings.findIndex((d) => d.id === selectedDrawing);
				placedDrawings.splice(index, 1);
				selectedDrawing = null;
				drawPlacedDrawings();
				onDrawingsChange([...placedDrawings]);
				if (rivetConnection) {
					await rivetConnection.deleteDrawing(deletedId, sessionId);
				}
			}
		}
	}

	async function updateDrawing(id, updates) {
		const drawing = placedDrawings.find((d) => d.id === id);
		if (drawing && drawing.sessionId === sessionId) {
			Object.assign(drawing, updates);
			drawPlacedDrawings();
			onDrawingsChange([...placedDrawings]);
			if (rivetConnection) {
				rivetConnection.updateDrawing(id, updates);
			}
		}
	}

	function getDrawingBounds(drawing) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		drawing.strokes.forEach((stroke) => {
			stroke.forEach((point) => {
				minX = Math.min(minX, point[0]);
				minY = Math.min(minY, point[1]);
				maxX = Math.max(maxX, point[0]);
				maxY = Math.max(maxY, point[1]);
			});
		});

		const padding = 10;
		const centerX = (minX + maxX) / 2;
		const centerY = (minY + maxY) / 2;
		return {
			width: maxX - minX + padding * 2,
			height: maxY - minY + padding * 2,
			offsetX: -centerX,
			offsetY: -centerY
		};
	}

	function getCursorAtPosition(worldX, worldY) {
		if (!selectedDrawing) return 'default';

		const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
		if (!drawing || drawing.sessionId !== sessionId) return 'default';

		const bounds = getDrawingBounds(drawing);
		const halfWidth = bounds.width / 2;
		const halfHeight = bounds.height / 2;
		const rotationOffset = 10;

		const dx = worldX - drawing.x;
		const dy = worldY - drawing.y;
		const cosR = Math.cos(-drawing.rotation);
		const sinR = Math.sin(-drawing.rotation);
		const rotatedX = dx * cosR - dy * sinR;
		const rotatedY = dx * sinR + dy * cosR;
		const unscaledX = rotatedX / drawing.scale;
		const unscaledY = rotatedY / drawing.scale;

		const rotationHandles = [
			{ x: -halfWidth - rotationOffset, y: -halfHeight - rotationOffset },
			{ x: halfWidth + rotationOffset, y: -halfHeight - rotationOffset },
			{ x: -halfWidth - rotationOffset, y: halfHeight + rotationOffset },
			{ x: halfWidth + rotationOffset, y: halfHeight + rotationOffset }
		];

		for (const handle of rotationHandles) {
			const dist = Math.sqrt((unscaledX - handle.x) ** 2 + (unscaledY - handle.y) ** 2);
			if (dist < 8) return 'alias';
		}

		const resizeHandles = [
			{ x: -halfWidth, y: -halfHeight, cursor: 'nw-resize' },
			{ x: halfWidth, y: -halfHeight, cursor: 'ne-resize' },
			{ x: -halfWidth, y: halfHeight, cursor: 'sw-resize' },
			{ x: halfWidth, y: halfHeight, cursor: 'se-resize' }
		];

		for (const handle of resizeHandles) {
			if (Math.abs(unscaledX - handle.x) < 10 && Math.abs(unscaledY - handle.y) < 10) {
				return handle.cursor;
			}
		}

		if (Math.abs(unscaledX) < halfWidth && Math.abs(unscaledY) < halfHeight) {
			return 'move';
		}

		return 'crosshair';
	}

	async function addDrawingToCanvas() {
		if (strokes.length === 0) return;

		const newDrawing = {
			id: Date.now(),
			strokes: [...strokes],
			x: Math.random() * 400 + 100,
			y: Math.random() * 300 + 100,
			scale: 1,
			rotation: 0,
			color: currentColor,
			size: currentSize,
			sessionId: sessionId
		};

		placedDrawings.push(newDrawing);
		selectedDrawing = newDrawing.id;
		clearSmallCanvas();
		drawPlacedDrawings();
		onDrawingsChange([...placedDrawings]);
		if (rivetConnection) {
			await rivetConnection.addDrawing(newDrawing);
		}
	}

	function drawPlacedDrawings() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		placedDrawings.forEach((drawing) => {
			ctx.save();
			ctx.translate(drawing.x, drawing.y);
			ctx.scale(drawing.scale, drawing.scale);
			ctx.rotate(drawing.rotation);

			const options = {
				size: drawing.size,
				smoothing: 0.5,
				thinning: 0.5,
				streamline: 0.5,
				easing: (t) => t,
				start: { taper: 0, cap: true },
				end: { taper: 0, cap: true }
			};

			const bounds = getDrawingBounds(drawing);
			ctx.save();
			ctx.translate(bounds.offsetX, bounds.offsetY);

			drawing.strokes.forEach((points) => {
				const stroke = getStroke(points, options);
				if (stroke.length) {
					const path = new Path2D();
					path.moveTo(stroke[0][0], stroke[0][1]);
					stroke.forEach((p) => path.lineTo(p[0], p[1]));
					ctx.fillStyle = drawing.color;
					ctx.fill(path);
				}
			});
			ctx.restore();

			if (selectedDrawing === drawing.id) {
				const halfWidth = bounds.width / 2;
				const halfHeight = bounds.height / 2;
				ctx.strokeStyle = '#007bff';
				ctx.lineWidth = 1 / drawing.scale;
				ctx.strokeRect(-halfWidth, -halfHeight, bounds.width, bounds.height);

				ctx.fillStyle = '#007bff';
				const handleSize = 4 / drawing.scale;
				ctx.fillRect(
					-halfWidth - handleSize / 2,
					-halfHeight - handleSize / 2,
					handleSize,
					handleSize
				);
				ctx.fillRect(
					halfWidth - handleSize / 2,
					-halfHeight - handleSize / 2,
					handleSize,
					handleSize
				);
				ctx.fillRect(
					-halfWidth - handleSize / 2,
					halfHeight - handleSize / 2,
					handleSize,
					handleSize
				);
				ctx.fillRect(
					halfWidth - handleSize / 2,
					halfHeight - handleSize / 2,
					handleSize,
					handleSize
				);
			}
			ctx.restore();
		});
	}

	function hitTestPoint(px, py, drawing) {
		const dx = px - drawing.x;
		const dy = py - drawing.y;
		const cosR = Math.cos(-drawing.rotation);
		const sinR = Math.sin(-drawing.rotation);
		const rotatedX = dx * cosR - dy * sinR;
		const rotatedY = dx * sinR + dy * cosR;
		const unscaledX = rotatedX / drawing.scale;
		const unscaledY = rotatedY / drawing.scale;
		const bounds = getDrawingBounds(drawing);
		const halfWidth = bounds.width / 2;
		const halfHeight = bounds.height / 2;
		return Math.abs(unscaledX) < halfWidth && Math.abs(unscaledY) < halfHeight;
	}

	function handleCanvasMouseDown(e) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const worldX = (x - offsetX) / scale;
		const worldY = (y - offsetY) / scale;

		for (let i = placedDrawings.length - 1; i >= 0; i--) {
			const drawing = placedDrawings[i];
			if (selectedDrawing === drawing.id && drawing.sessionId === sessionId) {
				const bounds = getDrawingBounds(drawing);
				const halfWidth = bounds.width / 2;
				const halfHeight = bounds.height / 2;

				const cosR = Math.cos(drawing.rotation);
				const sinR = Math.sin(drawing.rotation);

				const resizeLocalHandles = [
					{ x: -halfWidth, y: -halfHeight },
					{ x: halfWidth, y: -halfHeight },
					{ x: -halfWidth, y: halfHeight },
					{ x: halfWidth, y: halfHeight }
				];

				for (const handle of resizeLocalHandles) {
					const scaledX = handle.x * drawing.scale;
					const scaledY = handle.y * drawing.scale;
					const worldHandleX = scaledX * cosR - scaledY * sinR + drawing.x;
					const worldHandleY = scaledX * sinR + scaledY * cosR + drawing.y;

					const dx = worldX - worldHandleX;
					const dy = worldY - worldHandleY;
					if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
						resizing = true;
						initialScale = drawing.scale;
						initialDistance = Math.sqrt((worldX - drawing.x) ** 2 + (worldY - drawing.y) ** 2);
						lastPanX = e.clientX;
						lastPanY = e.clientY;
						return;
					}
				}
			}
		}

		selectedDrawing = null;
		for (let i = placedDrawings.length - 1; i >= 0; i--) {
			const drawing = placedDrawings[i];
			if (hitTestPoint(worldX, worldY, drawing) && drawing.sessionId === sessionId) {
				selectedDrawing = drawing.id;
				dragging = true;
				lastPanX = e.clientX;
				lastPanY = e.clientY;
				break;
			}
		}
		drawPlacedDrawings();
	}

	function handleCanvasMouseMove(e) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const worldX = (x - offsetX) / scale;
		const worldY = (y - offsetY) / scale;

		if (dragging) {
			currentCursor = 'grabbing';
		} else if (resizing || rotating) {
			currentCursor = 'grabbing';
		} else {
			currentCursor = getCursorAtPosition(worldX, worldY);
		}
		canvas.style.cursor = currentCursor;

		if (resizing && selectedDrawing) {
			const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
			if (drawing && drawing.sessionId === sessionId) {
				const currentDistance = Math.sqrt((worldX - drawing.x) ** 2 + (worldY - drawing.y) ** 2);
				const scaleFactor = currentDistance / initialDistance;
				updateDrawing(selectedDrawing, {
					scale: Math.max(0.1, Math.min(1.2, initialScale * scaleFactor))
				});
			}
			return;
		}

		if (!dragging || !selectedDrawing) return;

		const deltaX = (e.clientX - lastPanX) / scale;
		const deltaY = (e.clientY - lastPanY) / scale;

		const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
		if (drawing && drawing.sessionId === sessionId) {
			updateDrawing(selectedDrawing, { x: drawing.x + deltaX, y: drawing.y + deltaY });
			lastPanX = e.clientX;
			lastPanY = e.clientY;
		}
	}

	function handleCanvasMouseUp() {
		dragging = false;
		resizing = false;
		rotating = false;
	}

	$effect(() => {
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			drawPlacedDrawings();
		}
		if (smallCanvas) {
			const containerWidth = Math.min(window.innerWidth - 32, 400);
			smallCanvas.width = containerWidth;
			smallCanvas.height = 120;
			drawSmallCanvas();
		}
	});

	onMount(async () => {
		const myGarden = rivetClient.drawing.getOrCreate(['my-drawings']);
		const connection = myGarden.connect();
		connection.on('newDrawing', (newDrawing) => {
			if (selectedDrawing != newDrawing.id) placedDrawings.push(newDrawing);
		});
		connection.on('updatedDrawing', (updatedDrawing) => {
			if (selectedDrawing != updatedDrawing.id) {
				const drawing = placedDrawings.find((d) => d.id === updatedDrawing.id);
				if (drawing) Object.assign(drawing, updatedDrawing);
			}
		});
		connection.on('drawingDeleted', (drawing_id) => {
			const index = placedDrawings.findIndex((d) => d.id === drawing_id);
			if (index !== -1) placedDrawings.splice(index, 1);
		});
		rivetConnection = connection;
		let fetchedDrawings = await connection.getDrawings();
		placedDrawings = fetchedDrawings.filter(Boolean);
		sessionId = sessionStorage.getItem('garden-session-id') || generateRandomKey();
		sessionStorage.setItem('garden-session-id', sessionId);
	});
</script>

<svelte:head>
	<Seo
		title="Garden | Abdulmumin Yaqeen"
		description="A collaborative drawing experiment."
		canonical={`${siteOrigin}/garden`}
		robots="noindex, nofollow"
	/>
</svelte:head>

<main class="h-screen w-screen overflow-hidden bg-surface">
	<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-[400px]">
		<div class="flex flex-col items-center gap-3 w-full">
			<div
				class="bg-surface-soft/40 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden animate-slide-up w-full relative"
			>
				{#if strokes.length === 0 && !drawing}
					<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
						<p class="text-[10px] font-mono uppercase tracking-[0.2em] opacity-20">sketch here</p>
					</div>
				{/if}
				<canvas
					bind:this={smallCanvas}
					class="cursor-crosshair touch-none block w-full"
					onmousedown={handleDrawingStart}
					onmousemove={handleDrawingMove}
					onmouseup={handleDrawingEnd}
					onmouseleave={handleDrawingEnd}
					ontouchstart={handleDrawingStart}
					ontouchmove={handleDrawingMove}
					ontouchend={handleDrawingEnd}
				></canvas>
			</div>

			<div
				class="flex bg-surface-soft/90 backdrop-blur-md border border-border/40 rounded-full p-1.5 items-center shadow-lg w-full justify-between sm:justify-center overflow-hidden"
			>
				<div
					class="flex gap-3 px-3 border-r border-border/50 items-center overflow-x-auto no-scrollbar mask-gradient py-2"
				>
					{#each colors as color}
						<button
							class="size-5 shrink-0 rounded-full transition-all duration-300 {currentColor ===
							color
								? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-surface-soft'
								: 'opacity-60 hover:opacity-100 hover:scale-105'}"
							style="background-color: {color}"
							onclick={() => (currentColor = color)}
						></button>
					{/each}
				</div>

				<div class="flex items-center gap-2 shrink-0 px-2 pl-3">
					<button
						title="Add to Canvas"
						class="size-9 flex items-center justify-center bg-primary text-white rounded-full hover:brightness-110 active:scale-90 transition-all shadow-md"
						onclick={addDrawingToCanvas}
					>
						<Fa icon={faAdd} size="sm" />
					</button>
					<button
						title={selectedDrawing ? 'Delete' : 'Clear'}
						class="size-9 flex items-center justify-center bg-surface-muted text-text-main rounded-full hover:bg-surface-soft active:scale-90 transition-all border border-border/20 shadow-sm"
						onclick={selectedDrawing ? deleteSelectedDrawing : clearSmallCanvas}
					>
						<Fa icon={selectedDrawing ? faTrash : faBroom} size="sm" />
					</button>
				</div>
			</div>
		</div>
	</div>

	<canvas
		bind:this={canvas}
		id="pad"
		class="touch-none block w-full h-full cursor-crosshair"
		onmousedown={handleCanvasMouseDown}
		onmousemove={handleCanvasMouseMove}
		onmouseup={handleCanvasMouseUp}
		oncontextmenu={(e) => e.preventDefault()}
	></canvas>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
