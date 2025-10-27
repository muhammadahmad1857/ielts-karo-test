import { useState } from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { ApiResponse } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LogoutButton({
  logout,
}: {
  logout: () => Promise<ApiResponse<void>>;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true); // start loader
      const response = await logout();
      if (response.success) {
        toast.success("Logged out successfully");
        router.push("/auth"); // redirect to login page
      } else {
        // Handle logout error, e.g., show error message
        toast.error(response.error || "Unknown error when logging out");
      }

      // optional: redirect or show message
    } catch (err: any) {
      console.error("Logout failed", err);
      toast.error(err?.response?.error || "Unknown error when logging out");
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
      onClick={() => handleLogout()}
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
