import SideNav from './sideNav';
import TopBar from './topBar';

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
