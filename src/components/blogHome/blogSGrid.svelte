<script>
        import latestPostImage from "$lib/images/latest-blog.png"
	import { faAngleRight, faClock } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import BlogSPost from "./blogSPost.svelte";

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
        <BlogSPost title={" Getting started with CI/CD with Github Actions"}/>
        <BlogSPost title={" Git For Beginners: A Complete Guide."}/>
    </div>

</div>
