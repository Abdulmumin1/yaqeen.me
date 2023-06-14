<script>
    import me from '$lib/images/abdul.jpg';
    
    import { fly } from 'svelte/transition'

</script>
<div in:fly class=" flex justify-center p-4" >
    <div class="  max-w-[500px] flex flex-col items-center ">
        <div class="rounded-full p-2">
            <img src="{me}" alt="Abdulmumin Yaqeen" width="150px" class="rounded-full">
        </div>
        <h1 class="text-3xl font-visby_mid font-bold w-fit pb-4 ">About me</h1>
        <div class="text-md lg:text-lg flex flex-col space-y-2">

            <p>
                I'm Abdulmumin Yaqeen Abdulkarim, i have been hitting the keyboards for the past 3 years.
                
            </p>
            <p>

                I mostly write lots of python and javascript code, and worked in various field spanning web, mobile and cloud computing.
            </p>
            <p> I have a deep fascination for computer science theory. Enjoys exploring new tools and technologies and I actively seek opportunities to expand my knowledge and skill set.</p>
                <p>
                    
                    I'm commited to both learning and writing and I actively share my learnings and knowledge through my blog with the rest of the world.
                </p>
                <h3 class="text-xl font-bold">Things I Enjoy</h3>
                <ul>
                    <li>......</li>
                </ul>
            </div>
    </div>
</div>
