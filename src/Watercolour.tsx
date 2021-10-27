import {useEffect, useRef} from 'react';
import {
	continueRender,
	delayRender,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Point2D, RadialGradient, SCanvas, SimplePath} from 'solandra';

export default function Watercolour() {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();
	const delayHandle = delayRender();

	const ref = useRef<any>();
	useEffect(() => {
		const ctx = ref.current.getContext('2d');
		const s = new SCanvas(ctx, videoConfig, 1);

		const baseM = 0.5;

		const startShape = (
			r: number = 0.2,
			magnitude: number = 0.2
		): Point2D[] => {
			const at = s.meta.center;
			// A regular polygon is close to what we want but that would be closed (start = end) which we don't want here
			return s.build(s.aroundCircle, {at, r, n: 12}, (pt) =>
				s.perturb({at: pt, magnitude})
			);
		};

		const newPoint = (a: Point2D, b: Point2D): Point2D => {
			// Perpendicular outwards
			const beta = -Math.PI / 2;
			const u = b[0] - a[0];
			const v = b[1] - a[1];
			const m = baseM * s.random();
			const d = s.random();
			const cb = m * Math.cos(beta);
			const sb = m * Math.sin(beta);

			return [
				a[0] + u * d + (cb * u - sb * v),
				a[1] + v * d + (sb * u + cb * v),
			];
		};

		const spread = (points: Point2D[]): Point2D[] => {
			var spreaded: Point2D[] = [];
			const l = points.length;
			for (let i = 0; i < l; i++) {
				const p1 = points[i];
				const p2 = points[i > l - 2 ? 0 : i + 1];
				spreaded.push(p1);
				spreaded.push(newPoint(p1, p2));
			}
			return spreaded;
		};

		s.background(40, 70, 90);

		// s.setFillColor(5, 95, 60, 0.25);

		// let sh = startShape(0.3, 0.25);
		// sh = spread(spread(sh));

		// s.times(5, () => {
		// 	sh = spread(sh);
		// 	s.fill(SimplePath.withPoints(sh));
		// });

		const t = frame / videoConfig.durationInFrames;

		s.setFillGradient(
			new RadialGradient({
				start: s.meta.center,
				end: s.meta.center,
				rStart: 0,
				rEnd: 0.4,
				colors: [
					[0, {h: 10 - t * 10, s: 80, l: 60, a: 0.5 * t}],
					[1, {h: 45 - t * 5, s: 90, l: 50, a: 0.05 * t * t}],
				],
			})
		);

		let shapes = [startShape(0.2), startShape(0.3), startShape(0.34)];
		shapes = shapes.map((sh) => spread(spread(sh)));

		s.times(5, () => {
			shapes = shapes.map((sh) => spread(sh));
			shapes.forEach((sh) => s.fill(SimplePath.withPoints(sh)));
		});

		continueRender(delayHandle);
	});

	return (
		<canvas height={videoConfig.height} width={videoConfig.width} ref={ref} />
	);
}
