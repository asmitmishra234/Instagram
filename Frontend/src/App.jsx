import AppRoutes from "./Routes";
import AuthProvider from "./auth/ContextApi";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;