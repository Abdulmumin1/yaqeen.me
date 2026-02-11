<script>
	import me from '$lib/images/abdul.jpg';
	import { faGithub, faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
	import { mylinks } from '$lib/utils/randomstore.js';
</script>

<svelte:head>
	<title>Abdulmumin Yaqeen</title>
	<meta name="description" content="A creative, curiosity-driven developer & writer" />

	<meta property="og:url" content="https://www.yaqeen.me" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Abdulmumin Yaqeen" />
	<meta property="og:description" content="A creative, curiosity-driven developer & writer" />
	<meta property="og:image" content="https://i.ibb.co/nPW10cf/abdul.png" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="yaqeen.me" />
	<meta property="twitter:url" content="https://www.yaqeen.me" />
	<meta name="twitter:title" content="Abdulmumin Yaqeen" />
	<meta name="twitter:description" content="A creative, curiosity-driven developer & writer" />
	<meta name="twitter:image" content="https://i.ibb.co/nPW10cf/abdul.png" />
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">
	<div class="flex flex-col gap-6">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">/about</p>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4">
				<img src={me} alt="Abdulmumin Yaqeen" class="w-16 h-16 rounded-lg object-cover" />
				<div>
					<h1 class="text-sm font-bold text-primary">Abdulmumin Yaqeen</h1>
					<p class="text-xs opacity-60">Fullstack Developer & Security Student</p>
				</div>
			</div>

			<div class="flex gap-3 text-xs opacity-60">
				<a href={$mylinks.github} class="hover:opacity-100 transition-opacity">
					<Fa icon={faGithub} />
				</a>
				<a href={$mylinks.linkedin} class="hover:opacity-100 transition-opacity">
					<Fa icon={faLinkedin} />
				</a>
				<a href={$mylinks.twitter} class="hover:opacity-100 transition-opacity">
					<Fa icon={faTwitter} />
				</a>
				<a href={$mylinks.youtube} class="hover:opacity-100 transition-opacity">
					<Fa icon={faYoutube} />
				</a>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 text-xs opacity-80 leading-relaxed">
		<p>
			I'm Abdulmumin Yaqeen Abdulkarim, Currently a part time <span
				class="text-primary">Fullstack Developer</span
			>
			and pursuing my <span class="text-primary">Cyber Security</span> degree.
		</p>
		<p>
			I write lots of Python and Javascript code, and have worked in various field spanning web,
			mobile and cloud.
		</p>
		<p>I love to seek knowledge... maybe a bit too much sometimes.</p>
	</div>

	<div class="flex flex-col gap-4">
		<p class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-30">/interests</p>
		<ul class="flex flex-col divide-y divide-primary/10">
			<li class="py-3 text-xs opacity-80">
				<span class="text-primary font-bold">Writing</span> — Sharing thoughts on dev, security,
				and tech.
			</li>
			<li class="py-3 text-xs opacity-80">
				<span class="text-primary font-bold">Drawing</span> — Not a pro, mostly just doodling
				away.
			</li>
			<li class="py-3 text-xs opacity-80">
				<span class="text-primary font-bold">Photography</span> — My plan B.
			</li>
			<li class="py-3 text-xs opacity-80">
				<span class="text-primary font-bold">Coffee</span> — Lots of it.
			</li>
		</ul>
	</div>
</div>
