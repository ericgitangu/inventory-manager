import { useState } from "react";

interface ImageRecognitionProps {
	onRecognize: (item: any) => void;
}

export const ImageRecognition = ({ onRecognize }: ImageRecognitionProps) => {
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (event.target.files && event.target.files[0]) {
			setImage(event.target.files[0]);
			setLoading(true);

			const formData = new FormData();
			formData.append("file", event.target.files[0]);

			try {
				const response = await fetch("/api/recognize", {
					method: "POST",
					body: formData,
				});
				const data = await response.json();
				onRecognize(data);
			} catch (error) {
				console.error("Error recognizing image:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div>
			<input type="file" accept="image/*" onChange={handleImageChange} />
			{image && loading && <p>Image uploaded, processing...</p>}
		</div>
	);
};
