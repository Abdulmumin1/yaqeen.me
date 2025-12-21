import { actor, setup } from 'rivetkit';

interface Drawing {
	id: number;
	strokes: [];
	x: number; // Random position on big canvas
	y: number;
	scale: number;
	rotation: number;
	color: number;
	size: number;
	sessionId: string;
}

export const drawing = actor({
	state: { drawings: [] } as { drawings: Drawing[] },
	actions: {
		updateDrawing: (c, drawing_id: number, updates: Drawing) => {
			let drawing = c.state.drawings.find((d: Drawing) => d.id === drawing_id);
			Object.assign(drawing, updates);
			c.broadcast('updatedDrawing', drawing);
			return c.state.drawings;
		},
		addDrawing: (c, drawing: Drawing) => {
			c.state.drawings.push(drawing);
			console.log(drawing);
			c.broadcast('newDrawing', drawing);
			return c.state.drawings;
		},
		getDrawings: (c: any) => {
			return c.state.drawings;
		},
		deleteDrawing: (c: any, drawing_id: number, sessionId: string) => {
			let drawing: Drawing = c.state.drawings.find(
				(d: Drawing) => d.id === drawing_id && d.sessionId == sessionId
			);
            console.log(drawing)
			if (drawing) {
				const index = c.state.drawings.findIndex((d:Drawing) => d.id === drawing_id);
				 c.state.drawings.splice(index, 1);
				c.broadcast('drawingDeleted', drawing_id);
				return drawing_id;
			}
		}
	}
});

export const counter = actor({
	state: { count: 0 } as { count: number },
	actions: {
		increment: (c: any, x: number) => {
			c.state.count += x;
			c.broadcast('newCount', c.state.count);
			return c.state.count;
		},
		getCount: (c: any) => {
			return c.state.count;
		}
	}
});

export const registry = setup({
	use: { counter, drawing }
});
