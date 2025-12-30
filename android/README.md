# Android TFLite Camera Classifier

실시간 카메라 프리뷰와 TensorFlow Lite를 사용한 이미지 분류 Android 애플리케이션입니다.

## 프로젝트 구조

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/sigliv/
│   │   │   ├── MainActivity.java              # 메인 액티비티
│   │   │   ├── CameraPreviewFragment.java     # Camera2 API 프리뷰
│   │   │   ├── SimpleClassifier.java          # TFLite 분류기
│   │   │   ├── FrameListener.java             # 프레임 콜백 인터페이스
│   │   │   └── utils/FileUtil.java            # 레이블 로딩 유틸리티
│   │   ├── res/layout/
│   │   │   ├── activity_main.xml              # 메인 레이아웃
│   │   │   └── fragment_camera.xml            # 카메라 프리뷰 레이아웃
│   │   ├── assets/
│   │   │   ├── model.tflite                   # ⚠️ 추가 필요
│   │   │   └── labels.txt                     # ⚠️ 추가 필요
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## 필수 요구사항

### 1. TFLite 모델 파일 추가

다음 파일들을 `app/src/main/assets/` 디렉토리에 추가해야 합니다:

#### model.tflite
- 입력: 224×224×3 RGB 이미지 (float32, 0-1 정규화)
- 출력: 각 클래스에 대한 확률 배열

#### labels.txt
- 한 줄에 하나의 레이블
- 모델 출력 인덱스와 순서가 일치해야 함
- 예시:
  ```
  cat
  dog
  bird
  ```

### 2. Android 개발 환경

- **Android Studio**: Arctic Fox 이상
- **Minimum SDK**: 21 (Android 5.0 Lollipop)
- **Target SDK**: 34 (Android 14)
- **Java**: 8 이상

## 빌드 및 실행

### 1. Gradle Wrapper 다운로드

```bash
cd android
```

Windows에서:
```powershell
# Gradle wrapper jar 파일이 필요합니다
# Android Studio에서 프로젝트를 열면 자동으로 다운로드됩니다
```

### 2. Android Studio에서 열기

1. Android Studio 실행
2. "Open an Existing Project" 선택
3. `c:\SigLiv\android` 디렉토리 선택
4. Gradle 동기화 대기

### 3. 모델 파일 추가

`app/src/main/assets/` 디렉토리에 다음 파일 추가:
- `model.tflite`
- `labels.txt`

### 4. 빌드 및 실행

- Android 기기를 USB로 연결하거나 에뮬레이터 실행
- Run 버튼 클릭 (Shift+F10)

## 주요 기능

### 📷 실시간 카메라 프리뷰
- Camera2 API 사용
- TextureView로 실시간 프리뷰 표시
- 백그라운드 스레드에서 카메라 작업 처리

### 🤖 TensorFlow Lite 추론
- 1초마다 프레임 캡처
- 224×224 크기로 자동 리사이즈
- RGB → float32 정규화 (0-1)
- 실시간 분류 결과 표시

### 🔐 권한 관리
- 런타임 카메라 권한 요청
- Android 6.0+ 호환

## 사용 방법

1. 앱 실행
2. "분류 시작" 버튼 클릭
3. 카메라 권한 허용
4. 카메라 프리뷰 시작
5. 1초마다 자동으로 분류 결과 업데이트

## 기술 스택

- **언어**: Java 8
- **UI**: Android XML Layouts
- **카메라**: Camera2 API
- **ML**: TensorFlow Lite 2.14.0
- **빌드 시스템**: Gradle 8.2

## 트러블슈팅

### 카메라가 열리지 않음
- 설정 → 앱 → SigLiv → 권한에서 카메라 권한 확인

### 분류 실패
- `model.tflite`와 `labels.txt`가 assets 폴더에 있는지 확인
- 모델 입력 형식이 224×224×3 float32인지 확인

### 앱 크래시
- Logcat에서 TFLite 또는 Camera2 예외 확인
- minSdk 21 이상 기기에서 실행 중인지 확인

## 다음 단계

1. ✅ Android 프로젝트 구조 생성 완료
2. ⏳ TFLite 모델 파일 추가 (`model.tflite`, `labels.txt`)
3. ⏳ Android Studio에서 프로젝트 열기
4. ⏳ Gradle 동기화 및 빌드
5. ⏳ 실제 기기 또는 에뮬레이터에서 테스트

## 라이선스

이 프로젝트는 교육 목적으로 작성되었습니다.
