import Stripe from 'stripe';
import { envVar } from './env';

const stripe = new Stripe(envVar.STRIPE.STRIPE_SECRET_KEY as string, {
    // apiVersion: '2025-05-28.basil',
    apiVersion: '2026-01-28.clover',
});

export default stripe;