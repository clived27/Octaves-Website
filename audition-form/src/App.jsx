import AuditionForm from './AuditionForm';
import AdminDashboard from './AdminDashboard';

const isAdmin = window.location.pathname === '/admin';

function App() {
  return isAdmin ? <AdminDashboard /> : <AuditionForm />;
}

export default App;
