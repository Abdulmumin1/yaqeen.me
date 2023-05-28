<script>
    import '../tailwind.css'
    import '../app.css'
    import Nav from '../components/nav/nav.svelte';
</script>

<div class="w-screen h-screen bg-orange-50">
    <Nav/>
    <slot/>
</div>