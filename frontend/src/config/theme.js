const lightTheme = {
  // Primary brand color - matches your logo
  primary: "#FF5A36",      // Orange-red (logo)

  // Secondary color - dark for sidebar/backgrounds
  secondary: "#232323",    // Dark for sidebar/text

  // Accent color - for highlights and CTAs
  accent: "#FFD700",       // Gold/yellow for highlights

  // Background colors
  background: "#FFF6F2",   // Light orange background for pages
  cardBackground: "#FFFFFF", // White background for cards
  text: "#232323",         // Dark text
  textSecondary: "#666666", // Secondary text color

  // Additional colors for the admin interface
  admin: {
    background: "#FFF6F2", // Light orange background
    cardBackground: "#FFFFFF",
    text: "#232323",
    textLight: "#888888",
    border: "#FFE0D1",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#FF5A36"
  }
};

const darkTheme = {
  // Primary brand color - matches your logo
  primary: "#FF7A56",      // Lighter orange-red for better visibility in dark mode

  // Secondary color - light for text in dark mode
  secondary: "#E0E0E0",    // Light gray for text

  // Accent color - for highlights and CTAs
  accent: "#FFD700",       // Gold/yellow for highlights

  // Background colors
  background: "#121212",   // Dark background for pages
  cardBackground: "#1E1E1E", // Slightly lighter dark for cards
  text: "#FFFFFF",         // White text
  textSecondary: "#B0B0B0", // Secondary text color

  // Additional colors for the admin interface
  admin: {
    background: "#121212", // Dark background
    cardBackground: "#1E1E1E",
    text: "#FFFFFF",
    textLight: "#B0B0B0",
    border: "#2D2D2D",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#FF7A56"
  }
};

export { lightTheme, darkTheme };