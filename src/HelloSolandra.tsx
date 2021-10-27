import SolandraRemotion from './SolandraRemotion';

export default function HelloSolandra() {
	return (
		<SolandraRemotion
			draw={(s, frame) => {
				s.background(frame + 150, 80, 50);
			}}
		/>
	);
}
