package com.example.sigliv;

import android.Manifest;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity implements FrameListener {

    private TextView txtResult;
    private SimpleClassifier classifier;
    private static final int CAMERA_PERMISSION_REQUEST = 100;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        txtResult = findViewById(R.id.txt_result);
        Button btnStart = findViewById(R.id.btn_start);

        try {
            classifier = new SimpleClassifier(this,
                    "model.tflite", "labels.txt");
        } catch (Exception e) {
            txtResult.setText("분류기 로드 실패: " + e.getMessage());
        }
        
        btnStart.setOnClickListener(v -> {
            if (checkCameraPermission()) {
                startCamera();
            } else {
                requestCameraPermission();
            }
        });
    }

    private boolean checkCameraPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                == PackageManager.PERMISSION_GRANTED;
    }

    private void requestCameraPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.CAMERA},
                CAMERA_PERMISSION_REQUEST);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startCamera();
            } else {
                txtResult.setText("카메라 권한이 필요합니다");
            }
        }
    }

    private void startCamera() {
        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragment_container,
                        new CameraPreviewFragment(MainActivity.this))
                .commit();
    }

    @Override
    public void onFrame(Bitmap bitmap) {
        if (classifier != null) {
            String result = classifier.classify(bitmap);
            runOnUiThread(() -> txtResult.setText("예측 결과: " + result));
        }
    }
}
