<script>
	import BlogSection from '../components/blogHome/blogSection.svelte';
	import Hero from '../components/home/hero.svelte';
	import ProSection from '../components/projects/proSection.svelte';

	import me from '$lib/images/me.jpg';
</script>

<div class="snap-proximity snap-y flex flex-col">

	<Hero/>
	<ProSection />
	<BlogSection />
</div>
