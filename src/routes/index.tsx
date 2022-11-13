import * as Tone from "tone";
import { createSignal, JSX, onMount, Show } from "solid-js";
import { PolySynth, Synth } from "tone";
import midi from "../midi.json";
import { Midi, MidiJSON } from "@tonejs/midi";

export default function Home() {
	const [synthBase, setSynth] = createSignal<Synth>();
	const [sawSynth, setSawSynth] = createSignal<Synth>();
	const [showMagicDiv, setShowMagicDiv] = createSignal(false);

	const onPress = () => {
		setShowMagicDiv(true);
		const synth = synthBase().toDestination();

		const now = Tone.now();
		synth.triggerAttackRelease("C4", "8n", now);
		synth.triggerAttackRelease("E4", "8n", now + 0.01);
		synth.triggerAttackRelease("G4", "8n", now + 0.02);

		const midiFile = new Midi();
		midiFile.fromJSON(midi as MidiJSON);

		midiFile.tracks.forEach((track) => {
			const synth = new Tone.PolySynth(Tone.Synth, {
				envelope: {
					attack: 0.02,
					decay: 0.1,
					sustain: 0.3,
					release: 1,
				},
			}).toDestination();
			track.notes.forEach((note) => {
				synth.triggerAttackRelease(
					note.name,
					note.duration,
					note.time + now,
					note.velocity
				);
			});
		});
	};

	const onMouseMove: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
		e
	) => {
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
			<button onClick={onPress}>
				<h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>
					Hello world! (press me)
				</h1>
			</button>
			<Show when={showMagicDiv()}>
				<div class='mx-auto max-w-lg h-96 bg-sky-100' onMouseMove={onMouseMove}>
					magic div
				</div>
			</Show>
		</main>
	);
}
