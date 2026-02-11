/** @type {import('./$types').PageLoad} */
async function load() {
    throw redirect(302, '/projects');
}
