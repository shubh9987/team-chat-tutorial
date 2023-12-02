import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";


export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }
  try {

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
}catch (error) {
  console.error("Error in initialProfile:", error);
  // Handle the error appropriately, e.g., redirect to an error page.
}
};