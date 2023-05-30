<script>
	import ProjectGrid from "./projectGrid.svelte";
    import Fa from 'svelte-fa'
    import { faAngleRight, faFlag } from '@fortawesome/free-solid-svg-icons'
    import { faGithub } from '@fortawesome/free-brands-svg-icons';
</script>
<div class="h-screen flex flex-col p-4 m-1 border-t-2 rounded-sm">
    
    <h2 class="lg:text-4xl text-2xl text-center">Projects</h2>
    <ProjectGrid/>
    <div class="text-center flex items-center justify-center space-x-1 "><a href='#project' class="text-center">Visit Github </a><Fa icon={faGithub}/> <Fa icon={faAngleRight}/></div>
</div>