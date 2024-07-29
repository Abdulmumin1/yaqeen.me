<script>
	import { Comment } from '@commentrig/svelte';
	import '@commentrig/core/styles/default.css';
	let entities = {
		title: 'CommentRig Demo Page',
		email: 'abdulmuminyqn@gmail.com',
		unique_id: 'commentrig-demo-page',
		rich: true,
		page: 100,
		domain: 'https://yaqeen.me'
	};
</script>

<div class="p-12">
	<Comment {entities} />
</div>

<style>
	:root {
		--rig-text-color: #404953;
		--rig-background-color: #0c0a09;
		--rig-color-primary: #c2410c;
		--rig-inactive-color: #78716c;
	}
</style>
