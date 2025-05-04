<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [message]
	 */

	/** @type {Props} */
	let { message = 'Blog - Abdulmumin yaqeen' } = $props();
  </script>


<div ><p>{message}</p></div>

<style>
	div {
		font-family: 'visby';
		display: flex;
		flex-direction: column;
		font-size: 50px;
		background-color: rgb(255 237 213);
		height: 100%;
		width: 100%;
        color:#f97316;
		align-items: center;
		justify-content: center;
	}

    p{
        border:10px dashed #f97316;
        height:90%;
        width:90%;
        border-radius:30px;
		display: flex;
        align-items: center;
		justify-content: center;
        text-align:center;
    }
</style>
