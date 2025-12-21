<script>
	import {
		faAdd,
		faBroom,
		faBroomBall,
		faDeleteLeft,
		faPlus,
		faTrash
	} from '@fortawesome/free-solid-svg-icons';
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

	const rivetClient = createClient("https://yaqeen-garden-rivet-actor.avdorr12345.workers.dev/rivet");

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

	let currentColor = $state('#000000');
	let currentSize = $state(4);

	// New state for placed drawings
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

	let count = $state(0);
	let rivetConnection = $state(null);

	const colors = [
		'#1c1917', // Warm Ink Black (Stone-900) - Softer than pure black
		'#ef4444', // Vermilion Red - Energetic but not eye-bleeding
		'#10b981', // Emerald Green - Natural and lush
		'#3b82f6', // Royal Blue - clear and crisp
		'#f59e0b', // Deep Amber - Standard yellow is invisible on orange-50; this is readable
		'#d946ef', // Fuchsia Orchid - Playful purple/pink
		'#06b6d4', // Cyan Teal - A nice tropical water color
		'#f97316' // Burnt Orange - distinct enough from the background
	];
	const sizes = [4, 8, 16, 32, 64];

	function getPoint(e, canvasElement) {
		const rect = canvasElement.getBoundingClientRect();
		const touch = e.touches?.[0];
		const clientX = touch ? touch.clientX : e.clientX;
		const clientY = touch ? touch.clientY : e.clientY;
		const screenX = clientX - rect.left;
		const screenY = clientY - rect.top;

		if (canvasElement === canvas) {
			// For big canvas, apply transformations
			const worldX = (screenX - offsetX) / scale;
			const worldY = (screenY - offsetY) / scale;
			return { x: worldX, y: worldY };
		} else {
			// For small canvas, use screen coordinates directly
			return { x: screenX, y: screenY };
		}
	}

	function handleDrawingStart(e) {
		const targetCanvas = e.currentTarget;
		selectedDrawing = null;
		if (targetCanvas === canvas) {
			// Big canvas - selection is handled in handleCanvasMouseDown
			return;
		}

		// Small canvas - start drawing
		drawing = true;
		const { x, y } = getPoint(e, targetCanvas);
		currentPoints = [[x, y]];
		strokes.push(currentPoints);
		drawSmallCanvas();
	}

	function handleDrawingMove(e) {
		e.preventDefault();
		const targetCanvas = e.currentTarget;

		if (targetCanvas === canvas) {
			// Big canvas interactions (dragging, etc.)
			return;
		}

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
			start: {
				taper: 0,
				cap: true
			},
			end: {
				taper: 0,
				cap: true
			}
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

		// Add some padding
		const padding = 10;
		const centerX = (minX + maxX) / 2;
		const centerY = (minY + maxY) / 2;
		return {
			width: maxX - minX + padding * 2,
			height: maxY - minY + padding * 2,
			offsetX: -centerX, // Offset to center the drawing
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

		// Transform point to local space
		const dx = worldX - drawing.x;
		const dy = worldY - drawing.y;
		const cosR = Math.cos(-drawing.rotation);
		const sinR = Math.sin(-drawing.rotation);
		const rotatedX = dx * cosR - dy * sinR;
		const rotatedY = dx * sinR + dy * cosR;
		const unscaledX = rotatedX / drawing.scale;
		const unscaledY = rotatedY / drawing.scale;

		// Check rotation handles first
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

		// Check resize handles
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

		// Check if inside drawing bounds
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
			x: Math.random() * 400 + 100, // Random position on big canvas
			y: Math.random() * 300 + 100,
			scale: 1,
			rotation: 0,
			color: currentColor,
			size: currentSize,
			sessionId: sessionId
		};

		placedDrawings.push(newDrawing);
		selectedDrawing = newDrawing.id; // Auto-select the newly added drawing
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
			// 1. Move to the drawing's position, scale, and rotate
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

			// --- START FIX ---
			// We wrap the stroke drawing in its own save/restore block.
			// This applies the centering offset ONLY to the strokes, not the selection box.
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
			// Context is now back to (0,0) being the center of the object
			// --- END FIX ---

			// Draw selection outline and handles if selected
			if (selectedDrawing === drawing.id) {
				// The bounds width/height calculation is correct
				const halfWidth = bounds.width / 2;
				const halfHeight = bounds.height / 2;

				ctx.strokeStyle = '#007bff';
				ctx.lineWidth = 2 / drawing.scale; // Optional: Keep line width consistent regardless of scale

				// This draws centered at (0,0), which now correctly aligns with the visual center
				ctx.strokeRect(-halfWidth, -halfHeight, bounds.width, bounds.height);

				// Draw resize handles (squares)
				ctx.fillStyle = '#007bff';
				const handleSize = 6 / drawing.scale; // Optional: Keep handles consistent size

				// Corner handles for resize
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

				// Draw rotation handles (circles)
				ctx.fillStyle = '#ff6b6b';
				const rotationOffset = 10 / drawing.scale;
				const radius = 4 / drawing.scale;

				const drawCircle = (x, y) => {
					ctx.beginPath();
					ctx.arc(x, y, radius, 0, 2 * Math.PI);
					ctx.fill();
				};

				drawCircle(-halfWidth - rotationOffset, -halfHeight - rotationOffset);
				drawCircle(halfWidth + rotationOffset, -halfHeight - rotationOffset);
				drawCircle(-halfWidth - rotationOffset, halfHeight + rotationOffset);
				drawCircle(halfWidth + rotationOffset, halfHeight + rotationOffset);
			}

			ctx.restore();
		});
	}

	function hitTestPoint(px, py, drawing) {
		// Transform point from world space to drawing's local space
		// Reverse: translate by drawing position, rotate back, unscale
		const dx = px - drawing.x;
		const dy = py - drawing.y;

		// Rotate back by -rotation
		const cosR = Math.cos(-drawing.rotation);
		const sinR = Math.sin(-drawing.rotation);
		const rotatedX = dx * cosR - dy * sinR;
		const rotatedY = dx * sinR + dy * cosR;

		// Unscale
		const unscaledX = rotatedX / drawing.scale;
		const unscaledY = rotatedY / drawing.scale;

		// Get bounds (which are centered at origin)
		const bounds = getDrawingBounds(drawing);
		const halfWidth = bounds.width / 2;
		const halfHeight = bounds.height / 2;

		// Now check if point is within the centered bounds
		return Math.abs(unscaledX) < halfWidth && Math.abs(unscaledY) < halfHeight;
	}

	function handleCanvasMouseDown(e) {
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Convert to world coordinates for hit detection
		const worldX = (x - offsetX) / scale;
		const worldY = (y - offsetY) / scale;

		// Check if clicking on rotation handles first (outer circles)
		for (let i = placedDrawings.length - 1; i >= 0; i--) {
			const drawing = placedDrawings[i];
			if (selectedDrawing === drawing.id && drawing.sessionId === sessionId) {
				const bounds = getDrawingBounds(drawing);
				const halfWidth = bounds.width / 2;
				const halfHeight = bounds.height / 2;
				const rotationOffset = 10;

				// Transform handle positions to world space accounting for rotation and scale
				const cosR = Math.cos(drawing.rotation);
				const sinR = Math.sin(drawing.rotation);

				// Rotation handle positions in local space
				const rotationLocalHandles = [
					{ x: -halfWidth - rotationOffset, y: -halfHeight - rotationOffset },
					{ x: halfWidth + rotationOffset, y: -halfHeight - rotationOffset },
					{ x: -halfWidth - rotationOffset, y: halfHeight + rotationOffset },
					{ x: halfWidth + rotationOffset, y: halfHeight + rotationOffset }
				];

				for (const handle of rotationLocalHandles) {
					// Transform to world space
					const scaledX = handle.x * drawing.scale;
					const scaledY = handle.y * drawing.scale;
					const worldHandleX = scaledX * cosR - scaledY * sinR + drawing.x;
					const worldHandleY = scaledX * sinR + scaledY * cosR + drawing.y;

					const dx = worldX - worldHandleX;
					const dy = worldY - worldHandleY;
					if (Math.sqrt(dx * dx + dy * dy) < 8) {
						rotating = true;
						initialRotation = drawing.rotation;
						initialAngle = Math.atan2(worldY - drawing.y, worldX - drawing.x);
						lastPanX = e.clientX;
						lastPanY = e.clientY;
						return;
					}
				}

				// Resize handle positions in local space
				const resizeLocalHandles = [
					{ x: -halfWidth, y: -halfHeight },
					{ x: halfWidth, y: -halfHeight },
					{ x: -halfWidth, y: halfHeight },
					{ x: halfWidth, y: halfHeight }
				];

				for (const handle of resizeLocalHandles) {
					// Transform to world space
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

		// Check if clicking on a drawing
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

		// Set cursor based on position
		if (dragging) {
			currentCursor = 'grabbing';
		} else if (resizing) {
			// Keep the resize cursor
			currentCursor = getCursorAtPosition(worldX, worldY);
		} else if (rotating) {
			currentCursor = 'grabbing';
		} else {
			currentCursor = getCursorAtPosition(worldX, worldY);
		}
		canvas.style.cursor = currentCursor;

		if (rotating && selectedDrawing) {
			const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
			if (drawing && drawing.sessionId === sessionId) {
				const rect = canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const worldX = (x - offsetX) / scale;
				const worldY = (y - offsetY) / scale;
				const currentAngle = Math.atan2(worldY - drawing.y, worldX - drawing.x);
				const angleDelta = currentAngle - initialAngle;
				updateDrawing(selectedDrawing, { rotation: initialRotation + angleDelta });
			}
			return;
		}

		if (resizing && selectedDrawing) {
			const drawing = placedDrawings.find((d) => d.id === selectedDrawing);
			if (drawing && drawing.sessionId === sessionId) {
				const rect = canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const worldX = (x - offsetX) / scale;
				const worldY = (y - offsetY) / scale;
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
		// canvas.style.cursor = 'crosshair';
	}

	function handleCanvasMouseLeave() {
		// canvas.style.cursor = 'crosshair';
	}

	$effect(() => {
		if (canvas) {
			// Account for sidebar width (320px) and padding (40px total)
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight - 40;
			// canvas.style.cursor = 'crosshair';
			drawPlacedDrawings();
		}
		if (smallCanvas) {
			smallCanvas.width = 450;
			smallCanvas.height = 200;
			drawSmallCanvas();
		}
	});

	onMount(async () => {
		const myGarden = rivetClient.drawing.getOrCreate(['my-drawings']);

		const connection = myGarden.connect();
		connection.on('newDrawing', (newDrawing) => {
			if (selectedDrawing != newDrawing.id) {
				placedDrawings.push(newDrawing);
			}
		});

		connection.on('updatedDrawing', (updatedDrawing) => {
			if (selectedDrawing != updatedDrawing.id) {
				// placedDrawings.push(newDrawing);
				const drawing = placedDrawings.find((d) => d.id === updatedDrawing.id);
				Object.assign(drawing, updatedDrawing);
			}
		});

		connection.on('drawingDeleted', (drawing_id) => {
			const drawing = placedDrawings.find((d) => d.id === drawing_id);
			if (drawing) {
				const index = placedDrawings.findIndex((d) => d.id === selectedDrawing);
				placedDrawings.splice(index, 1);
			}
		});
		rivetConnection = connection;
		let fetchedDrawings = await connection.getDrawings();
		placedDrawings = fetchedDrawings.filter(Boolean);

		sessionId = sessionStorage.getItem('garden-session-id') || generateRandomKey();
		sessionStorage.setItem('garden-session-id', sessionId);
		//    console.log(placedDrawings)
	});
</script>

<main class="h-screen w-screen">
	<!-- Sidebar -->
	<div class="fixed bottom-10  left-1/2 -translate-x-1/2">
		<div class="w-full max-w-4xl relative p-5 flex flex-col">
			<!-- Small drawing canvas -->
			<div class="mx-auto">
				<h3 class="text-lg text-stone-900 dark:text-orange-200/80 mb-3 font-semibold">
					Sketch here
				</h3>
				<canvas
					bind:this={smallCanvas}
					class=" cursor-crosshair touch-none border-t border-x bg-white dark:bg-stone-900 rounded-t-lg"
					onmousedown={handleDrawingStart}
					onmousemove={handleDrawingMove}
					onmouseup={handleDrawingEnd}
					onmouseleave={handleDrawingEnd}
					oncontextmenu={(e) => e.preventDefault()}
					ontouchstart={handleDrawingStart}
					ontouchmove={handleDrawingMove}
					ontouchend={handleDrawingEnd}
				></canvas>
			</div>

			<!-- Controls -->
			<div class="flex gap-2 bg-orange-100 rounded-full p-3 items-center justify-center">
				<!-- Color picker -->
				<div>
					<div class="flex flex-wrap gap-3" role="group" aria-label="Color selection">
						{#each colors as color}
							<button
								class="w-10 h-10 rounded-full transition-all duration-200 {currentColor === color
									? 'border-black border-4 scale-110'
									: 'border-orang dark:border-dark hover:scale-105'}"
								style="background-color: {color}"
								aria-label="Select {color} color"
								onclick={() => (currentColor = color)}
							></button>
						{/each}
					</div>
				</div>

				<!-- Size picker -->
				<div>
					<select
						bind:value={currentSize}
						class="w-full px-4 py-2 rounded-lg bg-orange-50 dark:bg-stone-900 text-stone-900 dark:text-orange-200/80 transition-all duration-200"
					>
						{#each sizes as size}
							<option value={size}>{size}</option>
						{/each}
					</select>
				</div>

				<!-- Action buttons -->
				<div class="flex gap-1">
					<button
						title="Add to Canvas"
						class="w-full p-4 bg-orange-50 rounded-full"
						onclick={addDrawingToCanvas}
					>
						<Fa icon={faAdd} />
					</button>
					<button
						class="w-full p-4 bg-orange-50 rounded-full"
						onclick={selectedDrawing ? deleteSelectedDrawing : clearSmallCanvas}
					>
						<Fa icon={selectedDrawing ? faTrash : faBroom} />
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Main canvas area -->
	<div class="">
		<canvas
			bind:this={canvas}
			id="pad"
			class="touch-none bg-orange-50 dark:bg-stone-900"
			onmousedown={handleCanvasMouseDown}
			onmousemove={handleCanvasMouseMove}
			onmouseup={handleCanvasMouseUp}
			onmouseleave={handleCanvasMouseLeave}
			oncontextmenu={(e) => e.preventDefault()}
		></canvas>
	</div>
</main>

<style>
	/* Smooth transitions for interactive elements */
	button {
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
