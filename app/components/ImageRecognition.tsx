import React, { useState, useRef, useCallback } from "react";
import { Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Image from "next/image";

export const ImageRecognition = ({
	onRecognize,
}: { onRecognize: (item: any) => void }) => {
	const [cameraActive, setCameraActive] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const startCamera = useCallback(async () => {
		const videoElement = videoRef.current;
		if (!videoElement) {
			console.error(
				"Video element is not available when trying to start the camera.",
			);
			return;
		}

		try {
			console.log("Attempting to access the front-facing camera...");
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: "environment" } }, // Prefer back-facing camera
			});

			videoElement.srcObject = stream;
			videoElement.onloadedmetadata = () => {
				console.log("Video metadata loaded, setting camera active state...");
				setCameraActive(true);
			};
		} catch (err) {
			if ((err as Error).name === "OverconstrainedError") {
				console.warn(
					"Front-facing camera not found or cannot be accessed. Falling back to the default camera.",
				);
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
					});
					videoElement.srcObject = stream;
					videoElement.onloadedmetadata = () => {
						console.log(
							"Fallback video metadata loaded, setting camera active state...",
						);
						setCameraActive(true);
					};
				} catch (fallbackError) {
					console.error("Error accessing fallback camera: ", fallbackError);
					setSnackbarMessage("Error accessing any camera");
					setSnackbarOpen(true);
				}
			} else {
				console.error("Error accessing camera: ", err);
				setSnackbarMessage("Error accessing camera");
				setSnackbarOpen(true);
			}
		}
	}, []);

	const captureImage = () => {
		if (videoRef.current && canvasRef.current) {
			const context = canvasRef.current.getContext("2d");
			if (context) {
				context.drawImage(
					videoRef.current,
					0,
					0,
					canvasRef.current.width,
					canvasRef.current.height,
				);
				const dataUrl = canvasRef.current.toDataURL("image/png");
				setPreviewSrc(dataUrl);
				processImage(dataUrl);
				setCameraActive(false);
				stopCamera();
			}
		}
	};

	const processImage = async (imageData: string) => {
		try {
			const response = await fetch("/api/recognize", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image: imageData }),
			});
			if (response.ok) {
				const data = await response.json();
				onRecognize({
					name: data.name,
					description: data.description,
					category: data.category,
					quantity: 1,
				});
				setSnackbarMessage("Item recognized successfully");
				setSnackbarOpen(true);
				setCameraActive(false);
				stopCamera();
			} else {
				console.error("Error recognizing image:", response.statusText);
				setSnackbarMessage("Error recognizing image");
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("Error processing image:", error);
			setSnackbarMessage("Error processing image");
			setSnackbarOpen(true);
		}
	};

	const stopCamera = useCallback(() => {
		const videoElement = videoRef.current;
		if (videoElement && videoElement.srcObject) {
			const stream = videoElement.srcObject as MediaStream;
			const tracks = stream.getTracks();
			tracks.forEach((track) => track.stop());
			videoElement.srcObject = null;
		}
		setCameraActive(false);
		setPreviewSrc(null);
	}, []);

	return (
		<div>
			<div>
				<video
					ref={videoRef}
					autoPlay
					style={{
						width: "100%",
						maxHeight: "400px",
						display: cameraActive ? "block" : "none",
						objectFit: "contain",
					}}
				/>
				<canvas
					ref={canvasRef}
					style={{ display: "none" }}
					width={640}
					height={480}
				/>
			</div>
			<div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
				<Button
					variant="contained"
					color="primary"
					onClick={cameraActive ? captureImage : startCamera}
					className="w-full"
				>
					{cameraActive ? "Capture Image" : "Activate Camera"}
				</Button>
				{cameraActive && (
					<Button
						variant="contained"
						color="secondary"
						onClick={stopCamera}
						className="w-full"
					>
						Stop Camera
					</Button>
				)}
			</div>

			{/* {previewSrc && (
				<div style={{ marginTop: "20px" }}>
					<h3>Captured Image Preview:</h3>
					<div
						style={{
							position: "relative",
							width: "100%",
							maxWidth: "640px",
							height: "auto",
						}}
					>
						<Image
							src={previewSrc}
							alt="Captured Preview"
							layout="responsive"
							width={480}
							height={480}
						/>
					</div>
				</div>
			)} */}

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={() => setSnackbarOpen(false)}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={() => setSnackbarOpen(false)}
					severity="success"
				>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</div>
	);
};
