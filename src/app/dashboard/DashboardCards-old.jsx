import { Briefcase, FolderKanban, Image, Mail, Users } from "lucide-react"
// This page created on 02.27.2026
// Design on 03.08.2026
export default function DashboardCards() {

  const cards = [
    { title: "Users", count: 8, icon: Users },
    { title: "Enquires", count: 24, icon: Mail },
    { title: "Projects", count: 12, icon: FolderKanban },
    { title: "Clients", count: 12, icon: Briefcase }
  ]

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {cards.map((card, i) => {

        const Icon = card.icon

        return (

          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow flex items-center justify-between"
          >

            <div>

              <p className="text-gray-500">
                {card.title}
              </p>

              <h3 className="text-2xl font-bold">
                {card.count}
              </h3>

            </div>

            <Icon className="text-purple-500" />

          </div>

        )
      })}

    </div>
  )
}