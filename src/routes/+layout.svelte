<script>
	import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
</script>

<div
	class="w-screen dark:text-orange-100 font-visby dark:bg-[#040200] relative transition-colors duration-500"
>
	<Nav />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>
