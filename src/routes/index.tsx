import * as Tone from "tone";
import { createSignal, onMount } from "solid-js";
import { Synth } from "tone";

export default function Home() {
	const [synthBase, setSynth] = createSignal<Synth>();
	const [sawSynth, setSawSynth] = createSignal<Synth>();

	const onPress = () => {
		const synth = synthBase().toDestination();
		const now = Tone.now();
		synth.triggerAttackRelease("C4", "8n", now);
		synth.triggerAttackRelease("E4", "8n", now + 0.01);
		synth.triggerAttackRelease("G4", "8n", now + 0.02);
	};

	const onMouseMove = (e: MouseEvent) => {
		const target = e.target;
		const rect = (target as HTMLDivElement).getBoundingClientRect();

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		synthBase()
			.toDestination()
			.triggerAttackRelease(x, "8n", undefined, 1 / y);

		sawSynth()
			.toDestination()
			.triggerAttackRelease(x, "8n", undefined, y / (rect.top - rect.bottom));
	};

	onMount(() => {
		setSynth(new Tone.Synth());
		setSawSynth(
			new Tone.Synth({
				oscillator: {
					type: "sawtooth1",
				},
			})
		);
	});

	return (
		<main class='text-center mx-auto text-gray-700 p-4'>
			<button onClick={onPress}>press me </button>
			<h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>
				Hello world!
			</h1>
			<div class='mx-auto max-w-lg h-96 bg-sky-100' onMouseMove={onMouseMove}>
				magic div
			</div>
		</main>
	);
}
