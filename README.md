# Student Management System (ReactJS)

## Requirements
- Node.js 18 or newer
- npm

## Run the project
1. Extract the ZIP file.
2. Open the extracted `student-management-system` folder in VS Code.
3. Open a terminal in that folder.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Features
- Administrator dashboard with student statistics
- Register students with validation and duplicate-email checking
- Display and search student records
- View full student details
- Delete students with a confirmation dialog
- Keyboard shortcuts: Ctrl+K (search), Ctrl+N (register), Escape (close dialog)
- Nested click handling using `event.stopPropagation()`
- Prevent default form submission using `event.preventDefault()`
- Student data is saved in browser localStorage

## Git Bash commands
```bash
cd student-management-system
npm install
npm run dev
```

This is a frontend practical/demo project. It uses browser localStorage, not a secure server database or real authentication.
