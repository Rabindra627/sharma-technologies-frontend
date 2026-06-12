import DashboardCards from "@/app/dashboard/DashboardCards"
import AnalyticsPage from "@/app/dashboard/AnalyticsPage"

export default function Dashboard() {

  return (

    <div>
      <h1 className="text-2xl font-bold mb-2">
        Dashboard
      </h1>
      <p className="text-gray-500 mb-2">
        Manage Users, Inquiries, Projects and Clients.
      </p> 
      {/* Below added Dashboard cards view on 03.08.2026  */}
      <DashboardCards />
      <AnalyticsPage/>
    </div>
  )
}