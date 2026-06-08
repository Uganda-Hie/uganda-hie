export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Patient {id}</h1>
      <p className="mt-2 text-muted-foreground">Clinical view coming soon.</p>
    </main>
  )
}
