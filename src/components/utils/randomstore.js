import { readable } from "svelte/store";

export const mylinks = readable( {
    hashnode:'https://abdulmumin.com',
    linkedin:'https://linkedin.com/in/abdulmuminyqn',
    medium:'',
    twitter:'https://twitter.com/@abdulmuminyqn',
    github:'https://github.com/Abdulmumin1',
    youtube:'https://youtube.com/@abdulmuminyqn',

})

export const wallpapers = readable(['https://i.ibb.co/Hdx12sS/wall.png', 'https://i.ibb.co/FVzZYgS/setup-top-evee.png','https://i.ibb.co/LZGNPYm/setup-1-circles.png', 'https://i.ibb.co/VT0cvn3/setup-eveee-2.png'])