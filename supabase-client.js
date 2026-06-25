(function createDriveAstralSupabase(globalScope) {
  const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.102.0/dist/umd/supabase.min.js";
  let clientPromise = null;

  function config() {
    return globalScope.DriveAstralRuntimeConfig || {};
  }

  function isEnabled() {
    const current = config();
    return current.authMode === "supabase"
      && Boolean(current.supabaseUrl)
      && Boolean(current.supabasePublishableKey);
  }

  function loadSdk() {
    if (globalScope.supabase && globalScope.supabase.createClient) {
      return Promise.resolve(globalScope.supabase);
    }

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-supabase-sdk="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(globalScope.supabase), { once: true });
        existing.addEventListener("error", () => reject(new Error("SUPABASE_SDK_LOAD_FAILED")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = SDK_URL;
      script.async = true;
      script.dataset.supabaseSdk = "true";
      script.addEventListener("load", () => resolve(globalScope.supabase), { once: true });
      script.addEventListener("error", () => reject(new Error("SUPABASE_SDK_LOAD_FAILED")), { once: true });
      document.head.appendChild(script);
    });
  }

  async function getClient() {
    if (!isEnabled()) {
      return null;
    }
    if (!clientPromise) {
      clientPromise = loadSdk().then((sdk) => sdk.createClient(
        config().supabaseUrl,
        config().supabasePublishableKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        },
      ));
    }
    return clientPromise;
  }

  function activeAccessPlan(accessPlans) {
    const now = Date.now();
    const planWeight = {
      mentor: 30,
      guided: 30,
      premium: 20,
      monthly: 20,
      free: 10,
    };
    return (accessPlans || [])
      .filter((access) => {
        const status = String(access.status || "active").toLowerCase();
        const expiresAt = access.expires_at ? Date.parse(access.expires_at) : null;
        return ["active", "courtesy"].includes(status)
          && (!expiresAt || Number.isNaN(expiresAt) || expiresAt > now);
      })
      .sort((left, right) => (planWeight[right.plan_id] || 0) - (planWeight[left.plan_id] || 0))[0] || null;
  }

  function accountFrom(user, profile, accessPlans = []) {
    if (!user) {
      return null;
    }
    const activeAccess = activeAccessPlan(accessPlans);
    return {
      id: user.id,
      email: user.email || profile?.email || "",
      name: profile?.display_name || user.user_metadata?.display_name || "",
      birth: profile?.birth_date || "",
      primaryAreaId: profile?.primary_area_id || "",
      onboardingComplete: Boolean(profile?.birth_date && profile?.primary_area_id),
      accessMode: "supabase",
      planId: activeAccess?.plan_id || "free",
      accessPlans,
    };
  }

  async function loadCurrentAccessPlans(userId) {
    const client = await getClient();
    if (!client || !userId) {
      return [];
    }
    const { data, error } = await client
      .from("user_access_plans")
      .select("assignment_id,user_id,plan_id,status,starts_at,expires_at,updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) {
      return [];
    }
    return data || [];
  }

  async function getAccount() {
    const client = await getClient();
    if (!client) {
      return null;
    }
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError || !sessionData.session?.user) {
      return null;
    }
    const user = sessionData.session.user;
    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profileError) {
      throw profileError;
    }
    const accessPlans = await loadCurrentAccessPlans(user.id);
    return accountFrom(user, profile, accessPlans);
  }

  async function signUp({ name, email, password, privacyVersion, termsVersion }) {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const acceptedAt = new Date().toISOString();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${globalScope.location.origin}/login`,
        data: {
          display_name: name,
          privacy_version: privacyVersion,
          terms_version: termsVersion,
          consent_accepted_at: acceptedAt,
        },
      },
    });
    if (error) {
      throw error;
    }
    return {
      requiresEmailConfirmation: !data.session,
      account: data.session ? await getAccount() : null,
    };
  }

  async function signIn({ email, password }) {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    return getAccount();
  }

  async function signOut() {
    const client = await getClient();
    if (client) {
      await client.auth.signOut();
    }
  }

  async function resetPassword(email) {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${globalScope.location.origin}/login?recovery=1`,
    });
    if (error) {
      throw error;
    }
  }

  async function updatePassword(password) {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await client.auth.updateUser({ password });
    if (error) {
      throw error;
    }
  }

  async function updateProfile({ name, birth, primaryAreaId }) {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const { error } = await client
      .from("profiles")
      .update({
        display_name: name,
        birth_date: birth || null,
        primary_area_id: primaryAreaId || null,
      })
      .eq("user_id", userData.user.id);
    if (error) {
      throw error;
    }
    return getAccount();
  }

  async function saveReading(entry) {
    const client = await getClient();
    if (!client) {
      return;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const reading = entry.readingSnapshot || {};
    const { error } = await client.from("readings").upsert({
      user_id: userData.user.id,
      idempotency_key: entry.readingId,
      focus_area_id: entry.areaId || "general",
      birth_date: entry.inputSnapshot?.birthDate,
      reading_date: reading?.input?.current_date?.value || entry.date,
      engine_version: reading?.engine?.version || "unknown",
      knowledge_version: entry.contentVersion || "unknown",
      payload: {
        reading,
        historyEntry: entry,
      },
    }, {
      onConflict: "user_id,idempotency_key",
    });
    if (error) {
      throw error;
    }
  }

  async function loadCloudState() {
    const client = await getClient();
    if (!client) {
      return { history: [], timelineEvents: [] };
    }
    const [{ data: readings, error: readingsError }, { data: timeline, error: timelineError }] = await Promise.all([
      client
        .from("readings")
        .select("payload")
        .order("created_at", { ascending: false })
        .limit(8),
      client
        .from("timeline_events")
        .select("*")
        .order("event_date", { ascending: false }),
    ]);
    if (readingsError || timelineError) {
      throw readingsError || timelineError;
    }
    return {
      history: (readings || [])
        .map((item) => item.payload?.historyEntry)
        .filter(Boolean),
      timelineEvents: (timeline || []).map((item) => ({
        eventId: item.event_id,
        schemaVersion: "cosmic-timeline-event-v1",
        createdAt: item.created_at,
        title: item.title,
        eventDate: item.event_date,
        category: item.category,
        note: item.note,
        coordinatesSnapshot: item.coordinates?.coordinatesSnapshot || {},
        relationToPersonalKin: item.coordinates?.relationToPersonalKin || null,
        engineVersion: item.coordinates?.engineVersion || "",
      })),
    };
  }

  async function saveTimelineEvent(event) {
    const client = await getClient();
    if (!client) {
      return;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const { error } = await client.from("timeline_events").upsert({
      event_id: event.eventId,
      user_id: userData.user.id,
      title: event.title,
      event_date: event.eventDate,
      category: event.category,
      note: event.note || "",
      coordinates: {
        coordinatesSnapshot: event.coordinatesSnapshot,
        relationToPersonalKin: event.relationToPersonalKin,
        engineVersion: event.engineVersion,
      },
    });
    if (error) {
      throw error;
    }
  }

  async function saveJourneyProgress(progress) {
    const client = await getClient();
    if (!client || !progress) {
      return;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const { error } = await client.from("journey_progress").upsert({
      user_id: userData.user.id,
      context_key: progress.contextKey,
      start_date: progress.startDate,
      completed_days: progress.completedDays,
    });
    if (error) {
      throw error;
    }
  }

  async function saveProtocolProgress(progress) {
    const client = await getClient();
    if (!client || !progress) {
      return;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const { error } = await client.from("protocol_progress").upsert({
      user_id: userData.user.id,
      practice_date: progress.date,
      completed_moments: progress.completed,
    });
    if (error) {
      throw error;
    }
  }

  async function loadProgress({ contextKey, date }) {
    const client = await getClient();
    if (!client) {
      return { journey: null, protocol: null };
    }
    const [{ data: journey, error: journeyError }, { data: protocol, error: protocolError }] = await Promise.all([
      contextKey
        ? client
          .from("journey_progress")
          .select("*")
          .eq("context_key", contextKey)
          .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      client
        .from("protocol_progress")
        .select("*")
        .eq("practice_date", date)
        .maybeSingle(),
    ]);
    if (journeyError || protocolError) {
      throw journeyError || protocolError;
    }
    return {
      journey: journey
        ? {
          contextKey: journey.context_key,
          startDate: journey.start_date,
          completedDays: journey.completed_days || [],
        }
        : null,
      protocol: protocol
        ? {
          date: protocol.practice_date,
          completed: protocol.completed_moments || [],
        }
        : null,
    };
  }

  async function getAdminRole() {
    const client = await getClient();
    if (!client) {
      return null;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const { data, error } = await client
      .from("admin_roles")
      .select("role,is_active")
      .eq("user_id", userData.user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (error) {
      throw error;
    }
    return data?.role || null;
  }

  async function loadAdminSettings() {
    const client = await getClient();
    if (!client) {
      return {};
    }
    const { data, error } = await client
      .from("app_settings")
      .select("setting_key,setting_value");
    if (error) {
      throw error;
    }
    return (data || []).reduce((settings, item) => {
      settings[item.setting_key] = item.setting_value || {};
      return settings;
    }, {});
  }

  async function saveAdminSettings(settings) {
    const client = await getClient();
    if (!client) {
      return;
    }
    const updates = Object.entries(settings || {}).map(([settingKey, settingValue]) => (
      client
        .from("app_settings")
        .update({ setting_value: settingValue })
        .eq("setting_key", settingKey)
    ));
    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed) {
      throw failed.error;
    }
  }

  async function listAdminUsers() {
    const client = await getClient();
    if (!client) {
      return { profiles: [], accessPlans: [] };
    }
    const [profilesResult, accessResult] = await Promise.all([
      client
        .from("profiles")
        .select("user_id,email,display_name,birth_date,primary_area_id,created_at,updated_at")
        .order("created_at", { ascending: false })
        .limit(100),
      client
        .from("user_access_plans")
        .select("assignment_id,user_id,plan_id,status,starts_at,expires_at,updated_at")
        .order("updated_at", { ascending: false }),
    ]);
    if (profilesResult.error) {
      throw profilesResult.error;
    }
    if (accessResult.error) {
      throw accessResult.error;
    }
    return {
      profiles: profilesResult.data || [],
      accessPlans: accessResult.data || [],
    };
  }

  async function listAdminPlans() {
    const client = await getClient();
    if (!client) {
      return [];
    }
    const { data, error } = await client
      .from("plan_catalog")
      .select("plan_id,display_name,badge,price_label,billing_label,description,cta_text,checkout_url,is_visible,sort_order,features,updated_at")
      .order("sort_order", { ascending: true });
    if (error) {
      throw error;
    }
    return data || [];
  }

  async function saveAdminPlan(plan) {
    const client = await getClient();
    if (!client) {
      return;
    }
    const { error } = await client
      .from("plan_catalog")
      .upsert(plan, { onConflict: "plan_id" });
    if (error) {
      throw error;
    }
  }

  async function assignAdminUserPlan(access) {
    const client = await getClient();
    if (!client) {
      return;
    }
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      throw userError || new Error("AUTH_REQUIRED");
    }
    const payload = {
      ...access,
      created_by: userData.user.id,
      starts_at: access.starts_at || new Date().toISOString(),
    };
    const { error } = await client
      .from("user_access_plans")
      .upsert(payload, { onConflict: "user_id,plan_id" });
    if (error) {
      throw error;
    }
  }

  async function deleteAccount() {
    const client = await getClient();
    if (!client) {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }
    const { error } = await client.functions.invoke("delete-account", {
      body: { confirmation: true },
    });
    if (error) {
      throw error;
    }
    await client.auth.signOut({ scope: "local" });
  }

  globalScope.DriveAstralSupabase = Object.freeze({
    isEnabled,
    getClient,
    getAccount,
    loadCurrentAccessPlans,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    saveReading,
    loadCloudState,
    saveTimelineEvent,
    saveJourneyProgress,
    saveProtocolProgress,
    loadProgress,
    getAdminRole,
    loadAdminSettings,
    saveAdminSettings,
    listAdminUsers,
    listAdminPlans,
    saveAdminPlan,
    assignAdminUserPlan,
    deleteAccount,
  });
})(window);
