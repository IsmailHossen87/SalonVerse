#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moduleName = process.argv[2];
if (!moduleName) {
    console.log('❌ Module name missing');
    console.log('👉 Usage: npm run make:module <moduleName>');
    process.exit(1);
}
// Define the base path for modules
const basePath = path_1.default.join(process.cwd(), 'src/app/modules');
// Check if the module already exists (e.g., "user", "car", "auth")
const modulePath = path_1.default.join(basePath, moduleName);
// If module already exists, display an error and exit
if (fs_1.default.existsSync(modulePath)) {
    console.log(`⚠️ Module "${moduleName}" already exists.`);
    process.exit(1);
}
// If the module doesn't exist, proceed to create the module
fs_1.default.mkdirSync(modulePath, { recursive: true });
const files = [
    'interface',
    'controller',
    'service',
    'model',
    'validation',
    'router',
];
// Create necessary files for the new module
files.forEach((file) => {
    const filePath = path_1.default.join(modulePath, `${moduleName}.${file}.ts`);
    fs_1.default.writeFileSync(filePath, `// ${moduleName}.${file}.ts\n`);
});
console.log(`✅ Module "${moduleName}" created successfully.`);
