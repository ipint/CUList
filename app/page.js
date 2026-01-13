async function getUnions() {
  const apiUrl = process.env.UCCF_API_URL;
  if (!apiUrl) {
    throw new Error("UCCF_API_URL is not configured");
  }
  const res = await fetch(apiUrl, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Christian Unions");
  }
  return res.json();
}

function normalizeUnions(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function googleMapsLink(geocode) {
  if (!geocode || typeof geocode !== "string") return "";
  const query = geocode.replace(/\s+/g, "");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function normalizeInstitutionName(name) {
  if (!name || typeof name !== "string") return name;
  const match = name.match(/^(.+),\s*University of$/i);
  if (match) {
    return `University of ${match[1]}`;
  }
  return name;
}

const iconMap = {
  website: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.5 8.25V6.5c0-.9.6-1.4 1.5-1.4h1.5V2.5h-2.4c-2.6 0-4.1 1.6-4.1 4.1v1.65H8v2.7h2v8.55h3.5V10.95h2.6l.5-2.7h-3.1z"
        fill="currentColor"
      />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4.5h3.7l3.1 4.5 3.8-4.5H19l-5.3 6.1L19 19.5h-3.7l-3.6-5-4.2 5H5.2l5.9-6.8L5 4.5z"
        fill="currentColor"
      />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  )
};

export default async function HomePage() {
  let unions = [];
  let errorMessage = "";

  try {
    const data = await getUnions();
    unions = normalizeUnions(data);
  } catch (error) {
    errorMessage = "Unable to load unions right now. Please refresh later.";
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">UCCF Data Explorer</p>
          <h1>The Christian Unions</h1>
          <p className="lede">
            Discover Christian Unions across universities and colleges. The list below is
            pulled live from the UCCF data API.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-title">Total Unions</p>
          <p className="card-value">{unions.length || "—"}</p>
        </div>
      </section>

      <section className="list-section">
        <div className="list-header">
          <h2>Directory</h2>
          <span className="list-count">{unions.length} entries</span>
        </div>

        {errorMessage ? (
          <div className="empty-state">
            <h3>Data unavailable</h3>
            <p>{errorMessage}</p>
          </div>
        ) : unions.length === 0 ? (
          <div className="empty-state">
            <h3>No unions found</h3>
            <p>Try again later or check the API response.</p>
          </div>
        ) : (
          <div className="grid">
            {unions.map((union, index) => {
              const name = union.name || union.title || "Unnamed Union";
              const university = union.university || union.institution || union.college;
              const region = union.region || union.area || union.city;
              const website = union.website || union.url || union.link;

              return (
                <article
                  key={union.id || `${name}-${index}`}
                  className="card"
                  style={{ "--i": index }}
                >
                  <div className="card-header">
                    <h3>
                      {name}
                    </h3>
                    {region && <span className="pill">{region}</span>}
                  </div>
                  {university && <p className="card-detail">{university}</p>}

                  <details className="card-details">
                    <summary className="card-summary">More info</summary>
                    <div className="card-extra">
                      {(union.full_name || union.campus || union.abbreviation) && (
                        <div className="detail-list">
                          {union.full_name && (
                            <p className="detail-item">
                              {union.full_name} {union.abbreviation ? ` (${union.abbreviation})` : ""}
                            </p>
                          )}
                          {union.campus && (
                            <p className="detail-item">
                              <span>Campus</span>
                              {union.campus}
                            </p>
                          )}
                          
                        </div>
                      )}
                      {union.description && (
                        <p className="card-description">{union.description}</p>
                      )}
                      {(website ||
                        union.facebook ||
                        union.twitter ||
                        union.instagram) && (
                        <div className="detail-links">
                          {website && (
                            <a
                              className="detail-link"
                              href={website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="icon">{iconMap.website}</span>
                              
                            </a>
                          )}
                          {union.facebook && (
                            <a
                              className="detail-link"
                              href={union.facebook}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="icon">{iconMap.facebook}</span>
                              
                            </a>
                          )}
                          {union.twitter && (
                            <a
                              className="detail-link"
                              href={union.twitter}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="icon">{iconMap.twitter}</span>
                              
                            </a>
                          )}
                          {union.instagram && (
                            <a
                              className="detail-link"
                              href={union.instagram}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="icon">{iconMap.instagram}</span>
                              
                            </a>
                          )}
                        </div>
                      )}

                      {Array.isArray(union.institutions) && union.institutions.length > 0 && (
                        <div className="institution-list">
                          {union.institutions.map((institution) => {
                            const mapLink = googleMapsLink(institution.geocode);
                            return (
                              <div
                                key={institution.id || `${institution.name}-inst`}
                                className="institution"
                              >
                                <p className="institution-name">
                                  {normalizeInstitutionName(institution.name)}
                                </p>
                                <p className="institution-meta">
                                  {institution.postcode || "Postcode unavailable"}
                                  {institution.region?.name
                                    ? ` · ${institution.region.name}`
                                    : ""}
                                </p>
                                {mapLink && (
                                  <a
                                    className="map-link"
                                    href={mapLink}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    View on Google Maps
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
