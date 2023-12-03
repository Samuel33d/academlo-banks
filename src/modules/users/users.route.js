import express from 'express';
import { getHistory , login, signUp } from './users.controller.js';

export const router = express.Router();

router.post('/signup', signUp)
router.post('/login', login)

router.get('/:id/history', getHistory)