import { headers } from "next/headers";
import type { UserJSON } from "@clerk/nextjs/api";
import { Webhook } from "svix";

import { db, eq } from "@vivat/db";
import { users } from "@vivat/db/schema/users";

const webhookSecret: string = process.env.WEBHOOK_SECRET ?? "";

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId);
    console.log("svixIdTimeStamp", svixIdTimeStamp);
    console.log("svixSignature", svixSignature);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (_) {
    console.log("error");
    return new Response("Error occured", {
      status: 400,
    });
  }
  const { id } = evt.data;
  // Handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return new Response("Error locating user", {
        status: 400,
      });
    }

    eventType === "user.created"
      ? await db.insert(users).values({
          id,
          email: emailObject.email_address,
          name: `${evt.data.first_name} ${evt.data.last_name ?? ""}`,
          imageUrl: evt.data.image_url,
        })
      : await db
          .update(users)
          .set({
            email: emailObject.email_address,
            name: `${evt.data.first_name} ${evt.data.last_name ?? ""}`,
            imageUrl: evt.data.image_url,
          })
          .where(eq(users.id, id));
  }
  if (eventType === "user.deleted") {
    await db.delete(users).where(eq(users.id, id));
  }
  console.log(`User ${id} was ${eventType}`);
  return new Response("", {
    status: 201,
  });
}

interface Event {
  data: UserJSON;
  object: "event";
  type: EventType;
}

type EventType = "user.created" | "user.updated" | "user.deleted";
