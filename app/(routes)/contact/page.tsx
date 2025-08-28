export default function Contact(){
  return (
    <form className="card p-6 space-y-4 max-w-xl">
      <h1 className="text-xl font-semibold">Contact</h1>
      <input placeholder="Email" className="px-4 py-3 rounded-xl bg-white/10" />
      <textarea placeholder="Message" className="px-4 py-3 rounded-xl bg-white/10 min-h-40" />
      <button className="btn btn-primary w-fit">Send</button>
    </form>
  )
}