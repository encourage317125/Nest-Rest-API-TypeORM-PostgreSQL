
const constants = {

    // BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || 10,
    JWT_KEY: process.env.JWT_KEY || "CHANGEIT!!",
    // JWT_TTL_DAYS: process.env.JWT_TTL_DAYS || 1,

    // Constants for email.
    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || "mail.denovolab.com",
    EMAIL_SMTP_PORT: process.env.EMAIL_SMTP_PORT || 25,
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || "noreply@denovolab.com",
    EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD || "LKDJFFH!!!hrm",

    OPENTACT_API: process.env.OPENTACT_API || "https://api.stage.opentact.org/rest",
    OPENTACT_SIP_DOMAIN: process.env.OPENTACT_SIP_DOMAIN || "freesim.sip.opentact.org",
    OPENTACT_USER: process.env.OPENTACT_USER || "leon229@yandex.ru",
    OPENTACT_PASSWORD: process.env.OPENTACT_PASSWORD || "123",
    OPENTACT_SIP_APP_UUID: process.env.OPENTACT_SIP_APP_UUID || "08b731d5-ab4a-4e01-b4b1-d961df6984e0",

    OPENTACT_WSS: process.env.OPENTACT_WSS || "wss://api.opentact.org",

    FREESMS_URL: process.env.FREESMS_URL || "",
    FREESMS_DOMAIN: process.env.FREESMS_DOMAIN || "",

    //PAYMENTS
    PAYMENT_SUCCESS_URL: process.env.PAYMENT_SUCCESS_URL || 'http://148.251.91.143:8083/u/b/numbers/create/finish',
    PAYMENT_CANCEL_URL: process.env.PAYMENT_CANCEL_URL || 'http://148.251.91.143:8083/u/b/numbers/create/finish',
    //STRIPE
    STRIPE_SANDBOX: process.env.STRIPE_SANDBOX || false,
    STRIPE_SECRET:
        process.env.STRIPE_SECRET || "sk_test_51HsOzPB7TfyNN01C5U28mPM2LH81f2sLqXHqYaQEPAS0znwpRmpLnadGfTL67qSA0QjtoeMY9djNRDUDRz815HjF00qXb9Oeme",
    STRIPE_WEBHOOK_SECRET:
        process.env.STRIPE_WEBHOOK_SECRET ||
        "whsec_u7fSz7LSYFYtckjRrGAIerPsPEI1zKBv",
    //PAYPAL
    PAYPAL_SANDBOX: process.env.PAYPAL_SANDBOX || false,
    PAYPAL_API: process.env.PAYPAL_SANDBOX
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com",
    PAYPAL_CLIENT:
        process.env.PAYPAL_CLIENT ||
        "AUJoKVGO3q1WA1tGgAKRdY6qx0qQNIQ6vl6D3k7y64T4qh5WozIQ7V3dl3iusw5BwXYg_T5FzLCRguP8",
    PAYPAL_SECRET:
        process.env.PAYPAL_SECRET ||
        "EOw8LNwDhM7esrQ3nHfzKc7xiWnJc83Eawln4YLfUgivfx1LGzu9Mj0F5wlarilXDqdK9Q5aHVo-VGjJ",

    //FILES
    PATH_TO_IMAGE_FOLDER: process.env.NODE_ENV === "development" ? 
        process.env.DEV_PATH_TO_IMAGE_FOLDER || "assets/dev/profile" :
        process.env.PROD_PATH_TO_IMAGE_FOLDER || "assets/prod/profile",

    PATH_TO_AUDIO_FOLDER: process.env.NODE_ENV === "development" ? 
        process.env.DEV_PATH_TO_AUDIO_FOLDER || "assets/dev/recordings" :
        process.env.PROD_PATH_TO_AUDIO_FOLDER || "assets/prod/recordings",

    PATH_TO_TEMP_XML: process.env.PATH_TO_TEMP_XML || "assets/call_flow",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '958672035290-989653jlmq0lo3lnrfvfi62umr7ql3t7.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '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',
    GOOGLE_REDIRECT_AUTH_URL : process.env.GOOGLE_REDIRECT_AUTH_URL || 'https://myaccount.google.com',

    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID || '1517981001919896',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'f053cd9e19e1bf9d8cc33d94bbd07e1c'
};

export default constants