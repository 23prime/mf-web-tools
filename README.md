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
