import { agentSkills } from '$lib/server/agent-discovery.js';

export function GET() {
	return new Response(
		JSON.stringify(
			{
				$schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
				skills: agentSkills
			},
			null,
			2
		),
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			}
		}
	);
}
