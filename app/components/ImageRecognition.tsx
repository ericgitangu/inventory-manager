import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Image from "next/image";

export const ImageRecognition = ({ onRecognize }: { onRecognize: (item: any) => void }) => {
	const [cameraActive, setCameraActive] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const startCamera = useCallback(async () => {
		try {
			// Request the back camera by specifying the facingMode
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { exact: "environment" }, // 'environment' requests the back camera
				},
			});
			const videoElement = videoRef.current;
			if (videoElement) {
				videoElement.srcObject = stream;
				videoElement.onloadedmetadata = () => {
					videoElement.play();
					setCameraActive(true);
				};
			}
			setCameraActive(true);
		} catch (err) {
			console.error("Error accessing camera: ", err);
			setSnackbarMessage("Error accessing camera");
			setSnackbarOpen(true);
		}
	}, []);

	const captureImage = () => {
		if (videoRef.current && canvasRef.current) {
			const context = canvasRef.current.getContext("2d");
			if (context) {
				// Draw the current video frame to the canvas
				context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
				// Convert the canvas content to a data URL
				const dataUrl = canvasRef.current.toDataURL("image/png");
				setPreviewSrc(dataUrl); // Set the preview image source
				processImage(dataUrl);
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
		setPreviewSrc(null); // Clear the preview when the camera is stopped
	}, []);

	// useEffect to handle camera activation when the video stream starts
	useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.onloadedmetadata = () => {
				setCameraActive(true);
			};
		}
		// No dependencies here since videoRef.current is mutable and won't trigger re-renders
	}, []);

	// Clean up the camera stream when the component unmounts
	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, [stopCamera]);

	return (
		<div>
			{cameraActive ? (
				<div>
					<video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "400px" }} />
					<canvas ref={canvasRef} style={{ display: "none" }} width={640} height={480} />
					<Button variant="contained" color="primary" onClick={captureImage}>
						Capture Image
					</Button>
					<Button variant="contained" color="secondary" onClick={stopCamera}>
						Stop Camera
					</Button>
					{/* Show the captured image preview */}
					{previewSrc && (
						<div style={{ marginTop: "20px" }}>
							<h3>Captured Image Preview:</h3>
							<div style={{ position: "relative", width: "100%", maxWidth: "640px", height: "auto" }}>
								<Image
									src={previewSrc}
									alt="Captured Preview"
									layout="responsive"
									width={640}
									height={480}
								/>
							</div>
						</div>
					)}
				</div>
			) : (
				<Button
					variant="contained"
					color="primary"
					onClick={startCamera}
					className="w-full"
				>
					Activate Camera
				</Button>
			)}

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
