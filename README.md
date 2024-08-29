
# InvenAI: Inventory Management System

![Logo](https://inventory-manager-deveric.vercel.app/_next/image?url=%2Flogo.png&w=256&q=75)

## Overview

InvenAI is a modern inventory management system built with Next.js 14 and React, integrating Google OAuth 2.0 for authentication. The application leverages `next-auth` for secure user authentication, and Material-UI (MUI) for a responsive and user-friendly interface. The system provides real-time inventory management features, including CRUD operations, category-based item grouping, and insightful visualizations.

## Features

- **Authentication**: Google OAuth 2.0 integration using `next-auth`.
- **Real-Time Data**: Interactive dashboard with real-time inventory data visualization.
- **CRUD Operations**: Create, Read, Update, and Delete items with ease.
- **Responsive Design**: Fully responsive UI built with Material-UI.
- **Sidebar Navigation**: A collapsible sidebar for easy navigation across the app.
- **Chatbot Integration**: AI-powered chatbot to assist users with inventory management tasks.
- **Session Management**: Secure session handling with support for token expiration and renewal.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn
- Google Developer Console account for OAuth 2.0 setup

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/invenai.git
    cd invenai
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Environment Variables**:

   Create a `.env.local` file in the root of your project and add the following:

    ```bash
    NEXTAUTH_SECRET=your-nextauth-secret
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

   Your app should now be running on [http://localhost:3000](http://localhost:3000).

## Usage

### Authentication

- Users can log in via Google OAuth 2.0.
- Protected routes (`/dashboard`, `/inventory`) are accessible only to authenticated users.

### Dashboard

- The dashboard provides a summary of total items, categories, and quantity.
- Visualize inventory data using bar and pie charts, categorized by item type.
- Click on an item to view detailed information in a modal.

### Sidebar Navigation

- Use the menu icon to toggle the sidebar, which provides navigation links to Home, Inventory, Dashboard, and Logout.

### Chatbot

- A floating AI-powered chatbot is available for user assistance, providing help with tasks like querying items, generating summaries, and more.

## Deployment

### Vercel

To deploy on Vercel:

1. Push your project to GitHub or any other Git provider.
2. Import your repository to Vercel.
3. Set up environment variables on Vercel, matching those in your `.env.local`.
4. Deploy!

### Middleware Configuration

Ensure that your `middleware.ts` is correctly configured to handle session authentication for protected routes.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your changes.

### Branching

- `main`: Production-ready code.
- `develop`: Development branch with the latest features and fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please contact Eric Gitangu at [Eric Gitangu - Deveric](https://developer.ericgitangu.com).