"use server";

import { cookies } from "next/headers";

export async function getToken() {
  console.log("User fetching startedd");
  const cookieStore = await cookies();
  const userToken = cookieStore.get("token");
  console.log(userToken);

  if (!userToken) {
    console.log("No user cookie found");
    return null;
  }

  try {
    const token = userToken?.value;
    console.log("Token fetched successfully", token);
    return token;
  } catch (error) {
    console.error("Error parsing user cookie:", error);
    return null;
  }
}

export async function setToken(key: string, value: string) {
  console.log("User Token saved");
  const cookieStore = await cookies();
  const userToken = cookieStore.set(key, value);
  console.log(userToken);

  return true;
}

const logOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};
export { logOut };
