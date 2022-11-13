import { Component, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { Synth, Channel, now } from "tone";
import { Midi, MidiJSON } from "@tonejs/midi";
import midi from "./midi.json";
import { Instruments, getPiano } from "./utils/intstruments";

const channels = {
	[Instruments.EPiano]: new Channel(),
	[Instruments.Xylophone]: new Channel(),
};
Object.values(channels).forEach((channel) => channel.toDestination());

const [intstrumentsPlaying, setInstrumentsPlaying] = createStore({
	ePiano: false,
});

const App: Component = () => {
	onMount(() => {
		startTrack();
		window.addEventListener("keypress", (e) => {
			console.log(e);
			if (e.code === "Space") {
				setInstrumentsPlaying(({ ePiano }) => {
					channels[Instruments.EPiano].mute = ePiano;
					return { ePiano: !ePiano };
				});
			}
		});
	});

	const startTrack = () => {
		const nowStart = now();

		const midiFile = new Midi();
		midiFile.fromJSON(midi as MidiJSON);

		midiFile.tracks.forEach(async (track) => {
			console.log(track);
			if (track.name === Instruments.EPiano) {
				const piano = await getPiano();

				piano.connect(channels[Instruments.EPiano]);
				track.notes.forEach((note) => {
					piano.triggerAttackRelease(
						note.name,
						note.duration,
						note.time + nowStart,
						note.velocity
					);
				});
			}
			if (track.name === Instruments.Xylophone) {
				const synth = new Synth();

				synth.connect(channels[Instruments.EPiano]);
			}
		});
	};

	return (
		<main class='text-center mx-auto text-gray-700 p-4'>
			<h1 class='max-6-xs text-6xl text-sky-700 font-thin uppercase my-16'>
				press space
			</h1>
		</main>
	);
};

export default App;
