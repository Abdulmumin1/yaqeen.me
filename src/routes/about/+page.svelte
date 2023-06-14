<script>
    import me from '$lib/images/me.jpg';
    
    import { fly } from 'svelte/transition'

</script>
<div in:fly class="h-screen flex justify-center p-4" >
    <div class="  w-[500px] flex flex-col items-center ">
        <div class="rounded-full p-2">
            <img src="{me}" alt="Abdulmumin Yaqeen" width="150px" class="rounded-2xl">
        </div>
        <h1 class="text-3xl font-visby_mid font-bold w-fit ">About me</h1>
        <p class="text-lg">
            I'm Abdulmumin Yaqeen Abdulkarim, i have been hitting the keyboards for the past 3 years.
            <br/>
            I mostly write lots of python and javascript code, and worked in various field spanning web, mobile and cloud computing
        </p>
    </div>
</div>
