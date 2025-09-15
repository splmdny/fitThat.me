
# FitThat.Me - AI-Powered Virtual Try-On

<p align="center">
  <img src="https://storage.googleapis.com/aistudio-marketplace-enterprise-assets/assets/ad0f701c-7998-4c3e-8302-3f86e5720d2d/logo.png" alt="FitThat.Me Logo" width="200"/>
</p>

<h3 align="center">Fit your own style on-the-go.</h3>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/google/aistudio-template-fitthat-me?color=amber">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white">
  <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white">
</p>

---

**FitThat.Me** is a cutting-edge virtual dressing room that lets you try on clothes from anywhere. Just upload your photo, add images of clothing items, and let our powerful AI stylist show you how you'd look in your new outfit.

## ✨ Key Features

*   **AI-Powered Virtual Try-On:** See clothes fitted to your body realistically.
*   **Full Body & Headshot Support:** Don't have a full-body picture? Upload a headshot, and our AI will generate a consistent, realistic body for you.
*   **Multi-Item Outfits:** Combine multiple clothing items (e.g., a jacket, a shirt, and pants) into a single, cohesive look.
*   **AI Base Model:** Automatically creates a clean "base model" of you in neutral athletic wear, ensuring a perfect canvas for any outfit.
*   **Elegant & Intuitive UI:** A sophisticated, user-friendly interface that makes the virtual fitting process a breeze.
*   **Helpful Onboarding:** A simple "How It Works" tutorial guides new users through the process.

## 🚀 How It Works

1.  **📸 Upload Your Photo:** Start with a clear, full-body photo or a headshot. Select the correct image type. Our AI will prepare your virtual model.
2.  **👚 Add Clothing Items:** Upload images of clothes you want to try. For each one, provide a simple description (e.g., "blue denim jacket").
3.  **✨ Fit The Look:** Click the "Fit The Look" button and watch the AI create your new style in the results panel!

## 🛠️ Technology Stack

*   **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **AI Model:** [Google Gemini API](https://ai.google.dev/)
    *   `gemini-2.5-flash-image-preview` for image editing and composition.
    *   `imagen-4.0-generate-001` for placeholder image generation.

## ⚙️ Local Development Setup

To run this project on your local machine, follow these steps:

1.  **Prerequisites:**
    *   Node.js (v18 or higher)
    *   An API key for the Google Gemini API. You can get one from [Google AI Studio](https://aistudio.google.com/).

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/google/aistudio-template-fitthat-me.git
    cd aistudio-template-fitthat-me
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Set Up Environment Variables:**
    Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```
.
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── ImageUploader.tsx
│   │   └── Tutorial.tsx
│   ├── services/        # API calls and external services
│   │   └── geminiService.ts
│   ├── types/           # TypeScript type definitions
│   │   └── types.ts
│   ├── App.tsx          # Main application component
│   └── index.tsx        # React entry point
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
└── README.md            # You are here!
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

*   Powered by the incredible capabilities of the [Google Gemini API](https://ai.google.dev/).
*   Icons and design inspiration from various open-source projects.
