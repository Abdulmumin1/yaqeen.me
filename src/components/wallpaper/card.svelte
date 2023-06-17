<script>
	import { faCloudDownload, faCloudDownloadAlt, faDownload, faFileDownload, faShareAlt } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	export let wall
</script>
<div class="border space-y-3 border-b-4 border-black dark:border-[#444] p-2  dark:shadow-sm dark:shadow-gray-500 dark:bg-[#111] transition-transform duration-300 transform hover:scale-105 rounded-lg max-w-sm">
    <a href="{wall}">
    
        <img src="{wall}" alt="Beautifull wallpaper">
    </a>
    <div class="flex space-x-2 items-center justify-end text-xl">
        <button class="border hover:bg-green-500 px-5 py-2 rounded-lg border-black dark:border-[#444]  hover:shadow-lg">
            <a href="{wall}" download>
                <Fa icon={faDownload}/>
             </a>
        </button>
        <button class="border hover:bg-green-600  px-5 py-2 rounded-lg border-black dark:border-[#444]">
            <Fa icon={faShareAlt}/>
        </button>
    </div>
</div>