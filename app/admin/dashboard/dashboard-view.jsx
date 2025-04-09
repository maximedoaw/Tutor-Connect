import StatsCards from './stats-cards';
import RecentActivity from './recent-activity';
import StatisticsPanel from './statistics-panel';
import PendingComments from './pending-comments';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default function DashboardView({ stats, comments, loading, handleApproveComment, handleRejectComment, setActiveTab }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
      <Link href={"/"}>
        <MoveLeft className='mr-3'/>      
      </Link>
      Tableau de bord</h2>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentActivity />
        <StatisticsPanel stats={stats} />
      </div>
      
      <PendingComments 
        comments={comments} 
        loading={loading} 
        handleApproveComment={handleApproveComment} 
        handleRejectComment={handleRejectComment}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
