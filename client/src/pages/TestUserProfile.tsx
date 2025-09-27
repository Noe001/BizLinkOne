import { UserProfileDropdown } from "@/components/UserProfileDropdown";

export default function TestUserProfile() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">User Profile Dropdown Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Normal Size</h2>
        <div className="w-80 border p-4 rounded-lg">
          <UserProfileDropdown collapsed={false} />
        </div>
        
        <h2 className="text-lg font-semibold">Collapsed Size</h2>
        <div className="w-16 border p-4 rounded-lg">
          <UserProfileDropdown collapsed={true} />
        </div>
      </div>
    </div>
  );
}
