<script>
	import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
</script>

<div class="w-screen bg-orange-50 dark:text-orange-50 font-visby dark:bg-[#08090a] relative">
	<Nav />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>
