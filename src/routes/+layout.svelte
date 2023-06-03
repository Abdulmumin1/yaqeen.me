<script>
	import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
</script>

<div class="w-screen text-orange-50">
	<Nav />
	<slot />
	<!-- bg-[#08090a] -->
</div>
