import { Notification } from "@/types";
import { mockPlans } from "./plans";
import { mockUsers } from "./users";

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    user_id: "current-user", // we will assume current user is logged in
    type: "boost",
    plan_id: "plan-1",
    sender_id: "user-2",
    content: "a boosté votre bon plan",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
  {
    id: "notif-2",
    user_id: "current-user",
    type: "comment",
    plan_id: "plan-1",
    sender_id: "user-3",
    content: "a commenté votre bon plan : 'Super adresse !'",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "notif-3",
    user_id: "current-user",
    type: "system",
    content: "Bienvenue sur Planoka ! Complétez votre profil pour découvrir les meilleurs bons plans.",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "notif-4",
    user_id: "current-user",
    type: "boost",
    plan_id: "plan-2",
    sender_id: "user-4",
    content: "a boosté votre bon plan",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
];

export function getNotificationsWithDetails(): Notification[] {
  return mockNotifications.map((notif) => {
    const sender = notif.sender_id ? mockUsers.find((u) => u.id === notif.sender_id) : undefined;
    const plan = notif.plan_id ? mockPlans.find((p) => p.id === notif.plan_id) : undefined;
    return { ...notif, sender, plan };
  });
}
