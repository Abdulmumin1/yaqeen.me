<script>
	import MiniProject from './miniProject.svelte';
</script>

<div class="flex flex-col w-full items-center gap-6 mt-2 p-4 py-6 lg:p-8 rounded-3xl">
	<h1 class="text-4xl font-bold text-orang dark:text-dark">MINI Projects</h1>
	<div class="flex flex-col items-center justify-center gap-1 w-full iss p-1 py-6">
		<MiniProject
			title={'kbar-svelte-mini'}
			description={'npm package for svelte to integrate cmd+k/ctrl+k in your website'}
			link={'Abdulmumin1/kbar-svelte-mini'}
		/>
		<MiniProject
			title={'Liseen'}
			description={'Listen to youtube videos as audio'}
			link={'Abdulmumin1/liseen'}
		/>
		<MiniProject
			title={'CSS-Faster'}
			description={'a vscode extenstion that allows you to write vanilla css faster, using tailwind classes as snippets'}
			link={'Abdulmumin1/css-faster'}
		/>
		<MiniProject
			title={'TailwindPie'}
			description={'A python package that makes it easier to setup and use tailwind in any python project'}
			link={'Abdulmumin1/tailwindpie'}
		/><MiniProject
			title={'SleekScroll'}
			description={'A chromium browser extenstion that makes ugly scrollbar customizable'}
			link={'Abdulmumin1/sleekscroll'}
		/><MiniProject
			title={'Filesafe'}
			description={'a secure file storage commandline tool to hide/encrypt files. (In a weird way 😀) '}
			link={'Abdulmumin1/filesafe'}
		/><MiniProject
			title={'Xologic'}
			description={'A python package for tictactoe board logic, which can be used to evaluate board and activities'}
			link={'Abdulmumin1/xologic'}
		/><MiniProject
			title={'TCP-chat'}
			description={'A command line tool to chat with others on the same network '}
			link={'Abdulmumin1/tcp-chat'}
		/>
	</div>
</div>
