import { createBrowserRouter } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { DashboardLayout } from '../pages/DashboardLayout';
import { Overview } from '../pages/Overview';
import { SendPayment } from '../pages/SendPayment';
import { MeshSimulator } from '../pages/MeshSimulator';
import { Ledger } from '../pages/Ledger';
import { About } from '../pages/About';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/overview',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'send-payment', element: <SendPayment /> },
      { path: 'mesh-simulator', element: <MeshSimulator /> },
      { path: 'ledger', element: <Ledger /> },
      { path: 'about', element: <About /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
