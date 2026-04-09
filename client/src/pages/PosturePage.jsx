import { useEffect, useRef, useState } from "react";
import { POSE_CONNECTIONS, Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const angle = (a, b, c) => {
  const ab = [a.x - b.x, a.y - b.y];
  const cb = [c.x - b.x, c.y - b.y];
  const dot = ab[0] * cb[0] + ab[1] * cb[1];
  const m1 = Math.hypot(ab[0], ab[1]);
  const m2 = Math.hypot(cb[0], cb[1]);
  return (Math.acos(dot / (m1 * m2 + 1e-6)) * 180) / Math.PI;
};

export default function PosturePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Stand in frame to start posture analysis");

  useEffect(() => {
    let camera;
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#38d39f", lineWidth: 3 });
        drawLandmarks(ctx, results.poseLandmarks, { color: "#ff6b35", lineWidth: 1 });

        const hip = results.poseLandmarks[24];
        const knee = results.poseLandmarks[26];
        const ankle = results.poseLandmarks[28];
        const shoulder = results.poseLandmarks[12];

        const kneeAngle = angle(hip, knee, ankle);
        const backAngle = angle(shoulder, hip, knee);

        if (kneeAngle < 70) setFeedback("Lower your hips slightly and keep knees aligned.");
        else if (backAngle < 150) setFeedback("Keep your back straight and chest up.");
        else setFeedback("Great posture. Keep control through movement.");
      }
      ctx.restore();
    });

    if (videoRef.current) {
      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
    };
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-ink">Real-Time Posture Detection</h1>
      <p className="text-slate">Camera feed is analyzed with MediaPipe Pose for instant form correction.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass relative overflow-hidden p-3">
          <video ref={videoRef} className="hidden" />
          <canvas ref={canvasRef} className="w-full rounded-xl" />
        </div>
        <div className="glass p-5">
          <h2 className="text-lg font-semibold text-ink">Live Feedback</h2>
          <p className="mt-3 rounded-xl bg-coral/10 p-4 text-coral">{feedback}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate">
            <li>Keep full body visible in frame.</li>
            <li>Use side-angle view for squat and deadlift form checks.</li>
            <li>Practice slow reps for better angle detection.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
