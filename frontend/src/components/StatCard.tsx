interface Props {
  label: string
  value: number | string
  emoji: string
}

export default function StatCard({ label, value, emoji }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl
                    px-5 py-4 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-gray-500 text-sm mt-0.5">{label}</div>
    </div>
  )
}