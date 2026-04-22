export function GET() {
	return new Response(
		JSON.stringify({
			status: 'ok',
			service: 'yaqeen.me'
		}),
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}
	);
}
