// How static/butterfly/monarch.png is cut up and packed into
// static/butterfly/monarch-atlas.webp. Shared by the script that makes the
// atlas (scripts/cut-butterfly.mjs) and the code that draws from it.

export const SOURCE = { width: 1536, height: 1024 };

/** The body's centre line in the photo. */
export const AXIS = 766;

export const ATLAS = {
	size: 512,
	// The whole photo with the head and antennae rubbed out, a third of the size.
	wings: { x: 0, y: 0, width: 512, height: 341 },
	// The body and antennae on their own, a quarter of the size.
	body: {
		x: 4,
		y: 344,
		width: 75,
		height: 166,
		from: { left: AXIS - 150, top: 140, width: 300, height: 664 }
	}
};
