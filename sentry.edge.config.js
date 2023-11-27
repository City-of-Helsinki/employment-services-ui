import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_SAMPLE_RATE = process.env.SENTRY_SAMPLE_RATE || 0.2;

Sentry.init({
    dsn: SENTRY_DSN || "https://b6bba61d2fa24dffb535c9049f6e94c0@sentry.test.hel.ninja/102",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_SAMPLE_RATE,
});