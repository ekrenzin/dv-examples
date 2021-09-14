
	export async function enterVR(renderer) {
		try {
			const sessionOptions = { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking", "layers"] }
			const session = await navigator.xr.requestSession("immersive-vr", sessionOptions);
			renderer.xr.setReferenceSpaceType("local-floor");
			renderer.xr.setSession(session);
		} catch (e) {
			console.log(e)
		}
	}