<script>
        import latestPostImage from "$lib/images/latest-blog.png"
	import { faAngleRight, faClock } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

</script>
<div class="flex lg:space-x-4 h-full flex-col lg:flex-row">
    <div class="lg:w-3/5 mb-3">
        <img src="{latestPostImage}" alt="" class="border-[1.8px] border-black rounded-md ">
        <p class="text-2xl lg:text-4xl">
            Python tips and tricks
        </p>
        <p class="text-gray-700">When we talk python, we don't normally include building mobile apps, this is because these python frameworks are not fully optimized to build a production re</p>
        <div class="flex items-center w-fit space-x-2 p-2 rounded-xl border border-black hover:shadow-xl">

            <a href='#' class="">Read More 
            </a>
            <Fa icon={faAngleRight}/>
        </div>
    </div>
    <div class="flex flex-col">

        <div class="flex flex-col">
            
            <p class="text-lg lg:text-2xl">
                How Open Source can accelarate your career faster
            </p>
            <div class="text-gray-700 flex items-center space-x-2"> <Fa icon={faClock}/> <p>Jan, 2023</p></div>
               <div class="flex items-center w-fit space-x-2 p-1 rounded-xl">

            <a href='#' class="">Read More 
            </a>
            <Fa icon={faAngleRight}/>
        </div>
        </div>

        <div class="flex flex-col">
            
            <p class="text-lg lg:text-2xl">
                Getting started with CI/CD with Github Actions
            </p>
            <div class="text-gray-700 flex items-center space-x-2"> <Fa icon={faClock}/> <p>Jan, 2023</p></div>
               <div class="flex items-center w-fit space-x-2 p-1 rounded-xl">

            <a href='#' class="">Read More 
            </a>
            <Fa icon={faAngleRight}/>
        </div>
        </div>
    </div>

</div>
