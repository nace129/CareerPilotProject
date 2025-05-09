from google.cloud import speech
from google.api_core.exceptions import PermissionDenied

# Initialize once
_speech_client = speech.SpeechClient()

def transcribe_audio_bytes(audio_bytes: bytes, sample_rate: int = 44100) -> str:
    try:
        """
        Send raw audio bytes to Google Speech-to-Text and return the transcript.
        Assumes LINEAR16 PCM; adjust config if you use another codec.
        """
        audio = speech.RecognitionAudio(content=audio_bytes)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=sample_rate,
            language_code="en-US",
            enable_automatic_punctuation=True,
        )
        response = _speech_client.recognize(config=config, audio=audio)
        # Concatenate all results
        return " ".join(result.alternatives[0].transcript for result in response.results)
    except PermissionDenied as e:
        # ServiceDisabled / API not enabled
        raise RuntimeError(
          "Cloud Speech-to-Text is not enabled on your GCP project. "
          "Please enable speech.googleapis.com in the Cloud Console."
        )   
