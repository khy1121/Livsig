package com.example.sigliv;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.view.LayoutInflater;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import java.util.Arrays;

public class CameraPreviewFragment extends Fragment {

    private TextureView textureView;
    private CameraDevice cameraDevice;
    private Handler handler;
    private FrameListener listener;
    private CameraCaptureSession captureSession;

    public CameraPreviewFragment(FrameListener listener) {
        this.listener = listener;
    }

    @Override
    public View onCreateView(LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_camera, container, false);
        textureView = view.findViewById(R.id.texture_view);

        HandlerThread thread = new HandlerThread("CameraThread");
        thread.start();
        handler = new Handler(thread.getLooper());

        textureView.setSurfaceTextureListener(surfaceListener);

        return view;
    }
    
    private final TextureView.SurfaceTextureListener surfaceListener =
            new TextureView.SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int w, int h) {
            openCamera();
            startFrameCapture();
        }

        @Override public void onSurfaceTextureSizeChanged(SurfaceTexture s, int w, int h) {}
        @Override public boolean onSurfaceTextureDestroyed(SurfaceTexture s) { 
            closeCamera();
            return true; 
        }
        @Override public void onSurfaceTextureUpdated(SurfaceTexture s) {}
    };

    private void openCamera() {
        CameraManager manager = (CameraManager) getActivity()
                .getSystemService(Context.CAMERA_SERVICE);

        try {
            String cameraId = manager.getCameraIdList()[0];
            manager.openCamera(cameraId, new CameraDevice.StateCallback() {
                @Override
                public void onOpened(@NonNull CameraDevice camera) {
                    cameraDevice = camera;
                    createCameraPreviewSession();
                }
                
                @Override 
                public void onDisconnected(@NonNull CameraDevice camera) {
                    camera.close();
                    cameraDevice = null;
                }
                
                @Override 
                public void onError(@NonNull CameraDevice camera, int error) {
                    camera.close();
                    cameraDevice = null;
                }
            }, handler);
        } catch (SecurityException | CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void createCameraPreviewSession() {
        try {
            SurfaceTexture texture = textureView.getSurfaceTexture();
            texture.setDefaultBufferSize(1920, 1080);
            Surface surface = new Surface(texture);

            final CaptureRequest.Builder builder = 
                cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            builder.addTarget(surface);

            cameraDevice.createCaptureSession(Arrays.asList(surface),
                new CameraCaptureSession.StateCallback() {
                    @Override
                    public void onConfigured(@NonNull CameraCaptureSession session) {
                        if (cameraDevice == null) return;
                        captureSession = session;
                        try {
                            session.setRepeatingRequest(builder.build(), null, handler);
                        } catch (CameraAccessException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onConfigureFailed(@NonNull CameraCaptureSession session) {
                    }
                }, handler);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void startFrameCapture() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (textureView.isAvailable() && listener != null) {
                    Bitmap bmp = textureView.getBitmap();
                    if (bmp != null) {
                        listener.onFrame(bmp);
                    }
                }
                handler.postDelayed(this, 1000);
            }
        }, 1000);
    }

    private void closeCamera() {
        if (captureSession != null) {
            captureSession.close();
            captureSession = null;
        }
        if (cameraDevice != null) {
            cameraDevice.close();
            cameraDevice = null;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        closeCamera();
    }
}
