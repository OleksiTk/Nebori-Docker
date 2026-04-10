import { redirect } from "next/navigation";

export default function CreateGroupPage() {
  redirect("/studio?createGroup=1");
}
