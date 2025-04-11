export default function Dashboard() {
  const apps = [
    {
      name: "E-Layanan Desa",
      description: "Layanan administratif digital untuk warga desa.",
      logo: "🧾",
      integrated: true,
    },
    {
      name: "SIPD",
      description: "Sistem Informasi Pemerintah Daerah.",
      logo: "🏛️",
      integrated: true,
    },
    {
      name: "e-Planning",
      description: "Perencanaan pembangunan berbasis digital.",
      logo: "📊",
      integrated: false,
    },
    {
      name: "e-Budgeting",
      description: "Manajemen anggaran dengan transparansi tinggi.",
      logo: "💰",
      integrated: true,
    },
    {
      name: "Lapor.in",
      description: "Platform aduan masyarakat terpadu.",
      logo: "📢",
      integrated: false,
    },
    {
      name: "SIKAP",
      description: "Sistem Kinerja Aparatur Pemerintah.",
      logo: "👮",
      integrated: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {apps.map((app, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="text-3xl">{app.logo}</div>
            <div>
              <h4 className="text-md font-semibold leading-none">{app.name}</h4>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                app.integrated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
              }`}
            >
              {app.integrated ? "Terintegrasi" : "Belum terhubung"}
            </span>
            <a
              className={`text-sm font-medium underline ${
                app.integrated ? "text-blue-600" : "cursor-not-allowed text-muted-foreground"
              }`}
              href={app.integrated ? "/masuk" : "#"}
            >
              Masuk
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
