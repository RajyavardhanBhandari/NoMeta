import { Nav } from '../../components/ui/Nav';
import { DashboardExperience } from '../../components/dashboard/DashboardExperience';

export default function Dashboard() {
  return <><Nav/><main className="nm-page"><div className="nm-container"><div className="nm-page__head"><span className="nm-eyebrow">Your NoMeta</span><h1>Keep your cleaning allowance in view.</h1><p>See today's free allowance, paid credits and privacy-first activity from one place.</p></div><DashboardExperience/></div></main></>;
}
