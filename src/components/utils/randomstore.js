import { readable } from "svelte/store";

export const mylinks = readable( {
    hashnode:'https://abdulmumin.com',
    linkedin:'https://linkedin.com/in/abdulmuminyqn',
    medium:'',
    twitter:'https://twitter.com/@abdulmuminyqn',
    github:'https://github.com/Abdulmumin1',
    youtube:'https://youtube.com/@abdulmuminyqn',

})

export const wallpapers = readable(['src/lib/images/walls/setup+1+circles.png', 'src/lib/images/walls/setup+eveee+2.png','src/lib/images/walls/setup+top+evee.png', 'src/lib/images/walls/wall.png'])