import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# Config (via env vars)
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("FLASK_DEBUG", "false").lower() in ("1", "true", "yes")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(5 * 1024 * 1024)))  # bytes
MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() in ("1", "true", "yes")
MOCK_GENDER = os.getenv("MOCK_GENDER", "female")

# Logging
logging.basicConfig(level=logging.DEBUG if DEBUG else logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

# Limit CORS to configured origins
CORS(app, resources={r"/classify-gender": {"origins": CORS_ORIGINS}})

@app.route("/healthz", methods=["GET"])
def healthz():
    return jsonify({"status": "ok"}), 200

@app.route("/classify-gender", methods=["POST"])
def classify_gender():
    if not request.is_json:
        return jsonify({"error": "expected application/json"}), 400

    data = request.get_json()
    image_b64 = data.get("image")
    if not image_b64 or not isinstance(image_b64, str):
        return jsonify({"error": "missing or invalid 'image' field (base64 string expected)"}), 400

    # Basic payload size check (base64 string length)
    if len(image_b64) > app.config["MAX_CONTENT_LENGTH"]:
        return jsonify({"error": "payload too large"}), 413

    try:
        # ---- MOCK AI LOGIC ----
        # Demo-only: returns MOCK_GENDER if MOCK_MODE enabled.
        # IMPORTANT: do not store images unless you have consent & secure storage.
        if MOCK_MODE:
            return jsonify({"gender": MOCK_GENDER, "mock": True}), 200

        # If not in mock mode, indicate unimplemented behavior
        return jsonify({"error": "not implemented"}), 501

    except Exception:
        logger.exception("Unexpected error in /classify-gender")
        return jsonify({"error": "internal server error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)