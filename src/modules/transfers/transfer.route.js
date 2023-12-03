import express from 'express';
import { processTransfer } from './transfer.controller.js';

export const router = express.Router();

router.post('/', processTransfer);
