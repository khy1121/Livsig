package com.example.sigliv;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import com.example.sigliv.utils.FileUtil;
import org.tensorflow.lite.Interpreter;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.List;

public class SimpleClassifier {

    private Interpreter interpreter;
    private List<String> labels;
    private int inputSize = 224;

    public SimpleClassifier(Context ctx, String model, String labelFile)
            throws IOException {

        interpreter = new Interpreter(loadModel(ctx, model));
        labels = FileUtil.loadLabels(ctx, labelFile);
    }

    private MappedByteBuffer loadModel(Context ctx, String modelName)
            throws IOException {

        AssetFileDescriptor fd = ctx.getAssets().openFd(modelName);
        FileInputStream is = new FileInputStream(fd.getFileDescriptor());
        FileChannel channel = is.getChannel();
        return channel.map(FileChannel.MapMode.READ_ONLY,
                fd.getStartOffset(), fd.getDeclaredLength());
    }

    public String classify(Bitmap bitmap) {
        Bitmap resized = Bitmap.createScaledBitmap(bitmap,
                inputSize, inputSize, false);

        ByteBuffer buffer = ByteBuffer.allocateDirect(
                4 * inputSize * inputSize * 3);
        buffer.order(ByteOrder.nativeOrder());

        int[] pixels = new int[inputSize * inputSize];
        resized.getPixels(pixels, 0, inputSize,
                0, 0, inputSize, inputSize);

        for (int p : pixels) {
            buffer.putFloat(((p >> 16) & 0xFF) / 255f);
            buffer.putFloat(((p >> 8) & 0xFF) / 255f);
            buffer.putFloat((p & 0xFF) / 255f);
        }

        float[][] result = new float[1][labels.size()];
        interpreter.run(buffer, result);

        int maxIdx = 0;
        for (int i = 1; i < labels.size(); i++)
            if (result[0][i] > result[0][maxIdx]) maxIdx = i;

        return labels.get(maxIdx) + " (" +
                String.format("%.2f", result[0][maxIdx]) + ")";
    }
}
