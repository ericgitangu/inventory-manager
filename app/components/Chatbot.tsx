import React, { useState } from "react";
import {
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Box,
	Typography,
	CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const Chatbot = ({ items }: { items: any[] }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [conversation, setConversation] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
	};

	const handleSend = async () => {
		if (!message.trim()) return;

		// Add the user's message to the conversation
		const userMessage = { sender: "user", text: message };
		setConversation((prev) => [...prev, userMessage]);
		setMessage("");

		// Send the message to the API and get the response
		setLoading(true);
		try {
			const response = await fetch("/api/chatbot", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});

			// Check if the response status is OK (status code 200)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Ensure the reply exists in the response data
			if (!data.reply) {
				throw new Error("Malformed response: 'reply' field is missing.");
			}

			const botMessage = { sender: "bot", text: data.reply };
			setConversation((prev) => [...prev, botMessage]);
		} catch (error) {
			console.error("Error sending message:", error);

			// Log detailed error information
			console.error("Error details:", {
				message: (error as Error).message,
				stack: (error as Error).stack,
			});

			const errorMessage = {
				sender: "bot",
				text: "Sorry, something went wrong. Please try again later.",
			};
			setConversation((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				color="primary"
				onClick={handleOpen}
				style={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
			>
				<ChatIcon />
			</IconButton>
			<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>
					AI Chatbot
					<IconButton
						aria-label="close"
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<Box
						sx={{
							height: 300,
							overflowY: "auto",
							display: "flex",
							flexDirection: "column-reverse",
						}}
					>
						{conversation.map((msg, index) => (
							<Typography
								key={index}
								align={msg.sender === "user" ? "right" : "left"}
								sx={{
									backgroundColor:
										msg.sender === "user" ? "primary.light" : "secondary.light",
									color:
										msg.sender === "user"
											? "primary.contrastText"
											: "secondary.contrastText",
									padding: 1,
									borderRadius: 2,
									marginY: 1,
								}}
							>
								{msg.text}
							</Typography>
						))}
					</Box>
					<Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
						<TextField
							label="Type your message..."
							variant="outlined"
							fullWidth
							value={message}
							onChange={handleMessageChange}
							disabled={loading}
						/>
						<Button
							color="primary"
							variant="contained"
							onClick={handleSend}
							sx={{ marginLeft: 2 }}
							endIcon={<SendIcon />}
							disabled={loading}
						>
							Send
						</Button>
					</Box>
					{loading && (
						<Box
							sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
						>
							<CircularProgress size={24} />
						</Box>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Chatbot;
