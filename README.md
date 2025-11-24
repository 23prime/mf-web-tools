# mf-web-tools

A Chrome Extension that provides MoneyForward Web tools.

## For development

This project uses [Taskfile](https://taskfile.dev/) for task management.

You can see all available tasks with this command:

```sh
task list
```

### Load Extension in Chrome

1. Build the extension:

    ```sh
    pnpm build
    ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" (toggle in top-right corner)

4. Click "Load unpacked"

5. Select the `dist/` directory from this project

### Tips

#### Updating Extension Icons

To update the extension icons, you need to create three sizes (16x16, 48x48, 128x128) from your source image:

1. Place your source icon image (recommended: 1024x1024 or larger square image) in `tmp/` directory

2. Resize to required sizes using ImageMagick:

    ```sh
    magick tmp/your-icon.png -resize 16x16 public/icon-16.png
    magick tmp/your-icon.png -resize 48x48 public/icon-48.png
    magick tmp/your-icon.png -resize 128x128 public/icon-128.png
    ```

3. The icons will be automatically included in the next build

## Release

To create a new release:

1. Create and push a version tag:

    ```sh
    git tag v1.0.0
    git push origin v1.0.0
    ```

2. GitHub Actions will automatically:
    - Run all checks (Prettier, ESLint, TypeScript, Tests)
    - Build the extension
    - Create a zip file (`mf-web-tools-v1.0.0.zip`)
    - Create a GitHub Release with the zip file attached

3. Download the zip file from the [Releases](../../releases) page

The release will only be created if all checks pass.
