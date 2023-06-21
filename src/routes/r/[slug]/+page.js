import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'how') {
		return {
			title: 'How to learn to code faster',
			content: `
            
  <div class="space-y-4"><p>For some what motivated them into getting into the fields is how fast they can learn and start earning and for others, passion.</p>
<p>You might find yourself having spent more than a year and a half without a decent understanding of how it works.</p>
<p>The truth is, there is no shortcut to learning to code. However, there is a guide in which if you follow, you find yourself soaring higher than anyone else not doing the same in the long run.</p>
<h2 class='text-3xl py-2 font-bold font-visby_mid' id="follow-a-detailed-roadmap">Follow a detailed roadmap;</h2>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>you need the map of a jungle</p>
</blockquote>
<p>One of the main keys to learning is to follow a road map, doing it randomly will only bring confusion, demotivated or take more than the average amount of time required to understand a concept, For programming, this is not an exception and there are tons of detailed road maps and guides to help you through your journey. Taking a course gives you this by default, and there are lots of free courses to help you get started depending on the field you want to pursue.</p>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>Checkout <a href="https://roadmap.sh">roadmap.sh</a></p>
</blockquote>
<h2 class='text-3xl py-2 font-bold font-visby_mid' id="take-your-time-to-learn-the-basics">Take your time to learn the basics;</h2>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>You need a solid foundation.</p>
</blockquote>
<p>One can always get too excited to jump straight to building projects, but when they do, they find It hard to understand the pieces they need to put together to bring their idea to life. It would help if you build a solid foundation.</p>
<h2 class='text-3xl py-2 font-bold font-visby_mid' id="see-beyond-the-tutorial">See beyond the tutorial;</h2>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>Build projects</p>
</blockquote>
<p>Tutorial Hell is a thing in which most learners can be trapped and the only way to escape is to try something by yourselves. Start building the idea that you have or try to modify the project’s built in tutorials.</p>
<h2 class='text-3xl py-2 font-bold font-visby_mid' id="join-a-community">Join a community</h2>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>You shouldn’t go alone</p>
</blockquote>
<p>Being part of a community gives us a sense of belonging and the opportunity to connect with different learners with different levels of experience. One way to get started is to contribute to Open Source projects!</p>
<blockquote class='border-l-2 my-3 px-2 italic dark:border-[#333]'>
<p>Checkout <a href="https://eddiehub.org">eddiehub</a></p>
</blockquote>
<h3 class='text-2xl py-2 font-bold font-visby_mid' id="conclusion">Conclusion</h3>
<p>While all of this might help with learning to code faster, it makes no sense without focus, discipline, consistency, and iteration.</p>
<p>Iteration in the sense of looking back and seeing what works and what doesn’t in other to improve.</p>
<p><strong>Wish you luck</strong></p>
</div>


            `
		};
	}

	throw error(404, 'Not found');
}
