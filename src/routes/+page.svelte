<script>
	import Hero from "../components/home/hero.svelte";
	import Nav from "../components/nav/nav.svelte";
	import ProSection from "../components/projects/proSection.svelte";



</script>

<div class="snap-mandatory snap-y flex flex-col">

    <div class="lg:h-screen h-[400px] flex flex-col justify-center items-center snap-center">
        <div class=" w-[90%] h-[90%] flex-col relative rounded-2xl lg:border lg:border-orange-700  flex items-center justify-center">
            <!-- <Nav/> -->
            
            <Hero/>
        </div>
    </div>
    
    <ProSection/>
</div>