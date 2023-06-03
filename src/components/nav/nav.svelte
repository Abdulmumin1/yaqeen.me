<script>
	import Fa from 'svelte-fa';
	import NavItem from '../navItem.svelte';
	import {
		faLightbulb,
		faMoon,
		faStar,
		faStarAndCrescent,
		faStarOfLife,
		faSun
	} from '@fortawesome/free-solid-svg-icons';
</script>

<nav class="w-full border-b-2 border-black flex justify-center items-center">
	<ul class="flex space-x-2">
		<NavItem name="Home" />
		<NavItem name="About" />
		<div class=" cursor-pointer p-3 self-center">
			<Fa icon={faMoon} class="self-center" />
		</div>
		<NavItem name="Blog" />
		<NavItem name="Project" />
	</ul>
</nav>
