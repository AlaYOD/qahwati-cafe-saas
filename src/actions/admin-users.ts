"use server";

import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma-singleton";
import { serializePrisma } from "@/lib/serialize";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getAllUsersWithEmail() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: authData, error } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    if (error) throw error;

    const profiles = await prisma.profiles.findMany({
      orderBy: { created_at: "desc" },
    });

    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const users = authData.users.map((authUser) => {
      const profile = profileMap.get(authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || "",
        full_name: profile?.full_name || "",
        role: profile?.role || "staff",
        avatar_url: profile?.avatar_url || null,
        created_at: profile?.created_at || authUser.created_at,
        last_sign_in: authUser.last_sign_in_at || null,
        email_confirmed: !!authUser.email_confirmed_at,
        has_profile: !!profile,
      };
    });

    // Sort: users with profiles first, then by created_at desc
    users.sort((a, b) => {
      if (a.has_profile && !b.has_profile) return -1;
      if (!a.has_profile && b.has_profile) return 1;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });

    return { success: true, users: serializePrisma(users) };
  } catch (error: any) {
    return { success: false, error: error.message, users: [] };
  }
}

export async function createFullUser(data: {
  email: string;
  password: string;
  full_name: string;
  role: string;
}) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      throw authError || new Error("Failed to create auth user");
    }

    await prisma.profiles.create({
      data: {
        id: authData.user.id,
        full_name: data.full_name,
        role: data.role,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(
  id: string,
  data: { full_name?: string; role?: string }
) {
  try {
    await prisma.profiles.upsert({
      where: { id },
      update: { ...data },
      create: { id, full_name: data.full_name || "", role: data.role || "staff" },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserPassword(id: string, newPassword: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: newPassword,
    });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserEmail(id: string, newEmail: string) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.admin.updateUserById(id, {
      email: newEmail,
    });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFullUser(id: string) {
  try {
    const supabase = getSupabaseAdmin();

    // Delete profile first to avoid FK constraint issues
    try {
      await prisma.profiles.delete({ where: { id } });
    } catch {
      // Profile may not exist
    }

    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
