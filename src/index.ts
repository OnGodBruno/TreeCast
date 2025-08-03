// src/index.ts
import { WebServer } from './WebServer.js';

console.log('🌳 Starting TreeCast Web Server...');

const server = new WebServer(3000);
server.start();
