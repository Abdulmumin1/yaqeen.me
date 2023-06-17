<script>
	import Card from "../../components/wallpaper/card.svelte";
    import { wallpapers } from '../../components/utils/randomstore.js'

</script>
<div class="flex flex-wrap gap-5 justify-center mt-3 mb-2 px-2">
    {#each $wallpapers as wall (wall) }
        <Card wall={wall}/>
    {/each}
</div>