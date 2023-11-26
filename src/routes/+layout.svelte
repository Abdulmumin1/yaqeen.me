<script>
	import '../tailwind.css';
	import '../app.css';
	import Nav from '../components/nav/nav.svelte';
	import Footer from '../components/home/footer.svelte';
	import { page } from '$app/stores';

	$: isBlog = false;
	$: {
		isBlog = $page.url.pathname.startsWith('/blog');
		console.log(isBlog);
	}
	let r = ['rounded-t-xl'];
</script>

<div
	class="w-screen bg-orange-50 dark:text-orange-200 font-visby dark:bg-stone-950 relative transition-colors duration-500"
>
	<!-- dark:bg-[#040200] -->

	<Nav {isBlog} />
	<slot />
	<Footer />
	<!-- bg-[#08090a] -->
</div>

<style>
	
</style>
