<script>
	import Fa from 'svelte-fa';
	import { faCircle } from '@fortawesome/free-solid-svg-icons';
	import { tick } from 'svelte';

	import { onMount } from 'svelte';

	var dataValues = [5, 7, 29, 18, 10, 23];
	var speed = 200;

	function convertToArray() {
		const inputText = dataValues.value;

		const numbersArray = inputText.split(',').map((number) => parseInt(number.trim(), 10));
		return numbersArray;
	}

	var data = $state(dataValues.slice());
	// var dataCopy = data.slice();
	let chartContainer = $state();
	let maxValue = Math.max(...data);

	function renderChart(arr) {
		data = arr;
		// chartContainer.innerHTML = "";
		// data.forEach((value) => {
		//   const bar = document.createElement("div");
		//   bar.classList.add("bar");
		//   bar.style.setProperty("--tag", `bar-${value}`);
		//   const percentageHeight = (value / maxValue) * 100;
		//   bar.style.height = `${percentageHeight}%`;
		//   bar.textContent = value;
		//   chartContainer.appendChild(bar);
		// });
	}

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	function startAnim() {
		restart();
		bubbleSortWithDelay(data).then((sortedArray) => {
			console.log('Sorted array:', sortedArray);
		});
	}

	// bubble sort
	async function bubbleSortWithDelay(arr) {
		const len = arr.length;
		let swapped;
		async function sort() {
			do {
				swapped = false;
				for (let i = 0; i < len - 1; i++) {
					if (arr[i] > arr[i + 1]) {
						const temp = arr[i];
						arr[i] = arr[i + 1];
						arr[i + 1] = temp;
						swapped = true;
						// console.log(arr); // Log array after each swap
						if (!document.startViewTransition) {
							renderChart(arr);
							await delay(speed); // Delay in milliseconds (adjust as needed)
							continue;
						}
						const transition = document.startViewTransition(async () => {
							renderChart(arr);
							await tick();
						});

						await delay(speed); // Delay in milliseconds (adjust as needed)
					}
				}
			} while (swapped);
		}

		return sort().then(() => arr);
	}

	function restart() {
		// data = dataValues.slice();
		if (!document.startViewTransition) {
			renderChart(dataValues.slice());
			return;
		}
		const transition = document.startViewTransition(async () => {
			renderChart(dataValues.slice());
			await tick();
		});
	}

	// onMount(() => {
	// 	chartContainer = document.querySelector('#visual-container');
	// 	// renderChart();
	// });
</script>

<div class="container bg-orange-100 dark:bg-stone-900 rounded-lg">
	<div bind:this={chartContainer} id="visual-container">
		{#each data as d}
			<div
				class="bar bg-orang dark:bg-dark"
				style:--tag={`bar-${d}`}
				style={`height: ${(d / maxValue) * 200}px;`}
			>
				{d}
			</div>
		{/each}
	</div>

	<div class="btn-container">
		<button id="start-button" class="bg-orang dark:bg-dark" onclick={startAnim}>start </button>
		<button id="restartBtn" class="bg-orang dark:bg-dark" onclick={restart}
			><Fa icon={faCircle} /></button
		>
	</div>
</div>

<style>
	/* */
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		/* background-color: orange; */
	}
	#visual-container {
		display: flex;
		/* flex-direction: column; */
		gap: 5px;
		margin-right: 100px;
		height: 300px;
	}

	.bar {
		/* background-color: greenyellow; */
		margin-right: 10px;
		display: flex;
		align-items: flex-end;
		justify-content: start;
		color: black;
		font-size: 14px;
		/* height: 20; */
		width: 30px;
		border-radius: 6px;
		padding: 10px;
		/* view-transition-name: var(--tag); */
	}

	.btn-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100px;
		gap: 10px;
	}

	#start-button {
		width: fit-content;
		/* background-color: greenyellow; */
		border: 0px;
		border-radius: 30px;
		padding: 12px 60px;
		cursor: pointer;
		color: black !important;
	}

	#restartBtn {
		/* background-color: greenyellow; */
		color: black !important;
		border: 0;
		padding: 10px;
		border-radius: 100%;
		cursor: pointer;
		margin-left: 10;
	}
</style>
