(function configureDriveAstral(globalScope) {
  globalScope.DriveAstralRuntimeConfig = Object.freeze({
    environment: "production",
    release: "REPLACE_WITH_RELEASE_ID",
    authMode: "supabase",
    supabaseUrl: "https://PROJECT_REF.supabase.co",
    supabasePublishableKey: "sb_publishable_REPLACE_ME",
    billingMode: "external-checkout",
    paymentProvider: "hotmart",
    checkoutUrls: {
      monthly: "https://pay.hotmart.com/REPLACE_ME_OR_KIWIFY_URL",
      guided: "https://pay.hotmart.com/REPLACE_ME_OR_KIWIFY_URL",
    },
    analyticsMode: "privacy-safe",
  });
})(window);
