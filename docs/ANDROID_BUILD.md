# Android Build Guide

This project is an **Expo + React Native** app with a pre-generated native `android/` folder. You can build locally with **Gradle** (`./gradlew`) or in the cloud with **EAS Build**.

| Item | Value |
|------|-------|
| App ID (Play) | `com.appiato.horoscope` |
| App name | Horoscope |
| Current version | `1.9.5` (`versionCode` **95**) |
| Min SDK | 23 |
| Target / compile SDK | 35 |
| JS engine | Hermes (enabled) |
| Store flavors | `play` (Google Play), `amazon` (Amazon Appstore) |

> **Note:** `app.json` lists `com.buzly.horoscope2` as the Android package. The native Android project in `android/app/build.gradle` uses `com.appiato.horoscope`. The Gradle/native config is what ships in builds.

---

## Prerequisites

1. **Node.js** (LTS recommended) and npm
2. **JDK 17** (required for Android Gradle Plugin 8.x)
3. **Android SDK** — easiest via [Android Studio](https://developer.android.com/studio):
   - Android SDK Platform 35
   - Android SDK Build-Tools 34+
   - NDK 26.1.10909125 (listed in `android/build.gradle`)
4. Environment variables (add to `~/.zshrc` or `~/.bash_profile`):

   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"   # macOS default
   export PATH="$PATH:$ANDROID_HOME/emulator"
   export PATH="$PATH:$ANDROID_HOME/platform-tools"
   ```

5. Install JS dependencies from the repo root:

   ```bash
   npm install
   ```

### Node path for Gradle

`android/gradle.properties` sets `NODE_BINARY=/usr/local/bin/node`. If builds fail with “node not found”, point this at your actual Node binary:

```bash
which node
# e.g. /opt/homebrew/bin/node or ~/.nvm/versions/node/v20.x.x/bin/node
```

Update `NODE_BINARY` in `android/gradle.properties` accordingly.

---

## Signing setup (release builds)

Release builds are signed with `android/app/appiato.keystore`. Credentials are **not** committed to git.

1. Copy the example file:

   ```bash
   cp android/keystore.properties.example android/keystore.properties
   ```

2. Edit `android/keystore.properties` with real passwords:

   ```properties
   RELEASE_STORE_FILE=appiato.keystore
   RELEASE_STORE_PASSWORD=<your-store-password>
   RELEASE_KEY_ALIAS=appiato
   RELEASE_KEY_PASSWORD=<your-key-password>
   ```

   The keystore file path is relative to `android/app/` (where `build.gradle` lives).

3. Alternatively, set env vars instead of (or in addition to) the properties file:

   - `RELEASE_STORE_FILE`
   - `RELEASE_STORE_PASSWORD`
   - `RELEASE_KEY_ALIAS`
   - `RELEASE_KEY_PASSWORD`

**Never commit** `keystore.properties`, `*.keystore`, or `*.jks`. They are listed in `.gitignore`.

Verify signing config:

```bash
cd android
./gradlew :app:signingReport
```

---

## Quick reference: Gradle commands

All Gradle commands run from the **`android/`** directory using the wrapper script **`./gradlew`** (not `./gradle`).

```bash
cd android
```

### Development — run on emulator or device

From the **project root**:

```bash
npm run android
# or
npx expo run:android
```

This builds the `playDebug` variant, starts Metro, and installs on a connected device/emulator.

To pick the Amazon flavor for debug:

```bash
npx expo run:android --variant amazonDebug
```

### Debug APK (internal testing, no Play upload)

```bash
./gradlew assemblePlayDebug
```

Output:

```
android/app/build/outputs/apk/play/debug/app-play-debug.apk
```

### Release APK (sideload / direct install)

```bash
./gradlew assemblePlayRelease
```

Output:

```
android/app/build/outputs/apk/play/release/app-play-release.apk
```

Requires valid `keystore.properties` (or env vars) as described above.

### Release AAB — **Google Play Store upload**

Google Play expects an **Android App Bundle** (`.aab`), not an APK:

```bash
./gradlew bundlePlayRelease
```

Output:

```
android/app/build/outputs/bundle/playRelease/app-play-release.aab
```

Upload this `.aab` in [Google Play Console](https://play.google.com/console) under **Release → Production** (or an internal/closed track).

### Amazon Appstore

```bash
./gradlew assembleAmazonRelease
# or
./gradlew bundleAmazonRelease
```

### Clean rebuild

```bash
./gradlew clean
./gradlew bundlePlayRelease
```

---

## Bumping version for a new release

Edit `android/app/build.gradle`:

```groovy
defaultConfig {
    versionCode 95      // increment by 1 for every Play Store upload
    versionName "1.9.5" // user-visible version string
}
```

- **`versionCode`** must strictly increase for each Google Play upload.
- **`versionName`** is the version shown to users (e.g. `1.9.6`).

Also keep Expo OTA/runtime version in sync if you use `expo-updates`:

- `app.json` → `expo.android.runtimeVersion`
- `android/app/src/main/res/values/strings.xml` → `expo_runtime_version`

---

## Google Play Store checklist

1. **Build** the signed bundle:

   ```bash
   cd android
   ./gradlew bundlePlayRelease
   ```

2. **Upload** `app-play-release.aab` to Play Console.

3. **Play App Signing** — if the app uses Google-managed signing, you may have `pepk.jar` and key export files under `android/app/` for enrolling/uploading the upload key. Follow Play Console instructions if rotating keys.

4. **Store listing** — screenshots and tablet assets already live under `android/` (e.g. `tablet_10inch.png`). Reuse or replace as needed.

5. **In-app purchases / ads** — the `play` flavor is required for Google Play Billing (`react-native-iap`) and AdMob (`react-native-google-mobile-ads`).

6. **Privacy & permissions** — review `android/app/src/main/AndroidManifest.xml` before each release (INTERNET, AD_ID, storage permissions, etc.).

---

## EAS Build (cloud alternative)

The project includes `eas.json` for [Expo Application Services](https://docs.expo.dev/build/introduction/).

Install EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Build profiles:

| Profile | Purpose |
|---------|---------|
| `development` | Dev client, internal distribution |
| `preview` | Internal testing |
| `production` | Store-ready Android build |

Production Android build (uses Gradle task `:app:assemblePlayRelease` — produces an **APK**):

```bash
eas build --platform android --profile production
```

For Play Store uploads via EAS, prefer an AAB. You can change `eas.json` to:

```json
"gradleCommand": ":app:bundlePlayRelease"
```

Then run the same `eas build` command and download the `.aab` from the Expo dashboard.

Submit to Play Store after a successful build:

```bash
eas submit --platform android --profile production
```

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `node` not found during Gradle build | Fix `NODE_BINARY` in `android/gradle.properties` |
| Signing failed / empty passwords | Create `android/keystore.properties` from the example |
| SDK/NDK not found | Open Android Studio → SDK Manager; install Platform 35, NDK 26.1 |
| Metro / JS bundle issues | From repo root: `npx expo start --clear`, then rebuild |
| Out of memory during build | Increase `org.gradle.jvmargs` in `android/gradle.properties` |
| Wrong flavor installed | Use `play` for Google Play; `amazon` for Amazon store |

List all build-related Gradle tasks:

```bash
cd android
./gradlew tasks --group=build
```

---

## Command cheat sheet

```bash
# Install deps
npm install

# Run on device (debug)
npm run android

# Debug APK
cd android && ./gradlew assemblePlayDebug

# Release APK (signed)
cd android && ./gradlew assemblePlayRelease

# Release AAB for Google Play (signed)
cd android && ./gradlew bundlePlayRelease

# Cloud build
eas build --platform android --profile production
```
