import { redirect } from "next/navigation";

export default function TraineeProfileRedirect({ params }: { params: { id: string } }) {
  // We unified the trainee profile into a shared Public Profile view for all roles.
  redirect(`/profile/${params.id}`);
}
