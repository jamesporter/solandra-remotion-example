import {useEffect, useRef} from 'react';
import {
	continueRender,
	delayRender,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {SCanvas} from 'solandra';

export default function SolandraRemotion({
	draw,
}: {
	draw: (canvas: SCanvas, frame: number, t: number) => void;
}) {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();
	const delayHandle = delayRender();

	const ref = useRef<any>();
	useEffect(() => {
		const ctx = ref.current.getContext('2d');
		const s = new SCanvas(ctx, videoConfig);
		draw(s, frame, frame / videoConfig.durationInFrames);
		continueRender(delayHandle);
	});

	return (
		<canvas height={videoConfig.height} width={videoConfig.width} ref={ref} />
	);
}
