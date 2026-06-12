export default function InquiryTable() {

  const data = [
    { name: "xyz", email: "xyz@gmail.com", course: "AI" },
    { name: "abc", email: "abc@gmail.com", course: "Software Developer" }
  ]

  return (

    <table className="w-full bg-white rounded-xl shadow">

      <thead className="border-b">

        <tr>
          <th className="p-4 text-left">Name</th>
          <th>Email</th>
          <th>Course</th>
        </tr>

      </thead>

      <tbody>

        {data.map((row, i) => (

          <tr key={i} className="border-b">

            <td className="p-4">{row.name}</td>
            <td>{row.email}</td>
            <td>{row.course}</td>

          </tr>

        ))}

      </tbody>

    </table>
  )
}