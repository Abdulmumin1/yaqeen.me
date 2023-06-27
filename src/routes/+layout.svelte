<script>
	import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
</script>

<div
	class="w-screen bg-orange-50 dark:text-orange-100 font-visby dark:bg-stone-900 relative transition-colors duration-500"
>
	<!-- dark:bg-[#040200] -->
	<Nav />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>
