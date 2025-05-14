# Terms Analyzer

A Chrome extension and FastAPI backend to automatically detect, extract, and analyze terms and conditions (and similar legal documents) on any website using AI. The extension notifies users when such documents are found, offers to analyze them, and presents a clear, structured summary.

---

## Screenshot

![Terms Analyzer Screenshot](assets/TermsAnalyzer.png)

---

## Features
- **Automatic Detection:** Scans web pages for terms and conditions in multiple languages (EN, DE, FR, ES, IT).
- **User Notification:** Notifies users when terms are detected and offers to analyze them.
- **AI-Powered Analysis:** Sends detected content to an AI backend (Mistral) for detailed analysis.
- **Beautiful Results:** Presents analysis in a readable, structured format in the extension popup.
- **Secure:** API key is stored locally; future versions will support user login.
- **Extensible:** Easily add more languages, detection rules, or analysis models.

---

## Architecture
- **Frontend:** Chrome Extension (JavaScript, HTML, CSS)
  - Content script: Detects terms and conditions on web pages.
  - Background script: Handles notifications, backend communication, and state.
  - Popup: Displays results and manages user input (API key, login, etc.).
- **Backend:** FastAPI (Python)
  - Receives analysis requests from the extension.
  - Communicates with Mistral AI API.
  - (Planned) Handles user authentication and session management.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/terms-analyzer.git
cd terms-analyzer
```

### 2. Backend Setup
```bash
cd terms-analyzer-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

- Create a `.env` file in `terms-analyzer-backend`:
  ```env
  MISTRAL_API_KEY=your_mistral_api_key_here
  ```
- Start the FastAPI server:
  ```bash
  uvicorn app.main:app --reload
  ```
- The backend will run at `http://localhost:8000`

### 3. Frontend (Chrome Extension) Setup
- Go to `chrome://extensions/` in Chrome.
- Enable **Developer mode**.
- Click **Load unpacked** and select the `terms-analyzer` directory.
- Make sure you have `icon48.png` in the directory (or use the provided SVG to generate one).

---

## Usage
1. **Start the backend** (`uvicorn app.main:app --reload`).
2. **Load the extension** in Chrome.
3. **Browse any website**. If terms and conditions are detected, you'll get a notification.
4. **Click "Analyze"** in the notification. The extension will analyze the terms using AI.
5. **When analysis is complete**, click "Open Extension" in the notification, then click the extension icon to see the results.
6. **(First use)**: Enter your Mistral API key in the popup and save it.

---

## Roadmap
- [ ] Replace API key with user login (email/password authentication)
- [ ] Support for PDF and image-based terms extraction (OCR)
- [ ] Improved result formatting (Markdown/HTML rendering)
- [ ] More languages and smarter detection
- [ ] Deployable backend (Docker, cloud, etc.)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 