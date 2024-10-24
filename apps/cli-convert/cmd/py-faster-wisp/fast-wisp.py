import argparse
import os

from faster_whisper import WhisperModel

os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

# Define the parser
parser = argparse.ArgumentParser(description='Short sample app')
# Declare an argument (`--algo`), saying that the
# corresponding value should be stored in the `algo`
# field, and using a default value if the argument
# isn't given
parser.add_argument('--audio', action="store", dest='audio', default='')
parser.add_argument('--model', action="store", dest='model', default='large-v3')
# Now, parse the command line arguments and store the
# values in the `args` variable
args = parser.parse_args()
print(args.audio)

model_size = args.model

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")

segments, info = model.transcribe(args.audio, beam_size=5)

print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

for segment in segments:
    print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
