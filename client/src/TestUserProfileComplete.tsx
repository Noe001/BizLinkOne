import React from 'react';
import { UserProfileDropdown } from './components/UserProfileDropdown';
import { ThemeProvider } from './components/ThemeProvider';

// Simple test component to verify UserProfileDropdown works
function TestUserProfileComplete() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="p-8 min-h-screen bg-background">
        <h1 className="text-2xl font-bold mb-6">User Profile Dropdown Test</h1>
        
        <div className="border rounded-lg p-4 w-80">
          <p className="text-sm text-muted-foreground mb-4">
            Testing the UserProfileDropdown component:
          </p>
          
          <div className="flex justify-end">
            <UserProfileDropdown />
          </div>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>✓ Component should render with avatar and dropdown menu</p>
          <p>✓ Clicking should show settings menu with navigation options</p>
          <p>✓ Links should include Settings, Profile, Preferences, and Logout</p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default TestUserProfileComplete;
