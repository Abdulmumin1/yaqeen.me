<script>
	import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    
</script>
<div  class="lg:border rounded-md  m-2 p-3 flex flex-col space-y-3">
    <h2 class="text-2xl">Project name</h2>
    <p class='text-gray-500'>a short sentence that gives a overall picture of the project</p>
    <ul class="flex space-x-2">
        <li class="bg-orange-300 border border-orange-400 p-1 rounded-md">Stack1</li>
        <li class="border border-yellow-700 p-1 rounded-md">Stack2</li>
        <li class="border border-blue-700 p-1 rounded-md">Stack3</li>
    </ul>
    <div class="w-full lg:border-t"></div>
    <a href="#" class="flex  items-center">Visit <div class="px-1"></div><Fa icon={faAngleRight}/></a>
</div>