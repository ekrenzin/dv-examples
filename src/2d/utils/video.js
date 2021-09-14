import { getDomElements } from "../../three/utils/domElements";
export { playVideo }
function playVideo(stream) {
	const { video } = getDomElements()
	video.setAttribute('webkit-playsinline', 'webkit-playsinline');
	video.setAttribute('playsinline', 'playsinline');
	video.srcObject = stream;
	video.muted = false
	video.play();
}