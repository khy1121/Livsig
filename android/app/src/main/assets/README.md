# TensorFlow Lite Model Files

This directory should contain your TensorFlow Lite model files:

## Required Files

1. **model.tflite** - Your trained TensorFlow Lite model
   - Input: 224x224x3 RGB image (float32, normalized 0-1)
   - Output: Probability array for each class

2. **labels.txt** - Text file with class labels
   - One label per line
   - Order must match model output indices
   - Example:
     ```
     cat
     dog
     bird
     ```

## How to Add Your Model

1. Place your `model.tflite` file in this directory
2. Place your `labels.txt` file in this directory
3. Build and run the app

## Testing Without a Model

If you don't have a model yet, you can:
- Use a pre-trained MobileNet model from TensorFlow Hub
- Train your own model using TensorFlow/Keras
- Download sample models from: https://www.tensorflow.org/lite/models

## Model Requirements

- Input shape: [1, 224, 224, 3]
- Input type: float32
- Preprocessing: RGB values normalized to [0, 1]
- Output: Probability distribution over classes
