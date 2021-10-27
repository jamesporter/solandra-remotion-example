# Solandra and Remotion

Create videos from Solandra drawings:

```tsx
import SolandraRemotion from './SolandraRemotion';

export default function HelloSolandra() {
	return (
		<SolandraRemotion
			draw={(s, frame, t) => {
				s.background(frame + 150, 80, 50);
			}}
		/>
	);
}
```

[Example video](https://www.youtube.com/embed/HwoyAelWo-c)

[Code for this](./src/Watercolour.tsx)
