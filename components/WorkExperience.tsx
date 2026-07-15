import Link from "next/link";

export default function WorkExperience() {
  const jobs = [
    {
      company: "Personio",
      description: [
        "Identified and systematized product-qualified leads, architected cross-sell motions and targeted sales automation, and built operational bridges to sales for consistent pipeline generation and compounding expansion revenue.",
        "Drove $20K cost optimization for product analytics while leveraging vendor expertise to establish the data-driven foundation, accelerate new product launch timing, and compress time-to-first-revenue.",
      ],
    },
    {
      company: "Deepnote",
      description: [
        "Drove 5x PLG revenue growth by identifying and optimizing the freemium-to-paid conversion loop and expanding land-and-expand motions.",
        "Architected integrated go-to-market infrastructure (experimentation, attribution modeling, feature flagging, customer messaging, billing, and onboarding) that became the foundation for sustainable, compounding growth.",
        "Built targeted sales automation for high-intent users, multiplying revenue impact through personalized outreach and feedback loops.",
      ],
    },
    {
      company: "Hireproof",
      description: [
        "Scaled from $0 to $12K MRR by establishing product-market fit, architecting go-to-market systems, personally driving early revenue through direct sales, and building revenue streams across three core products. Successfully exited in 2022 while pioneering community trust through transparent public engagement.",
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {jobs.map((job, index) => (
        <div
          key={job.company}
          style={{
            paddingBottom: "48px",
          }}
        >
          <div
            style={{
              fontFamily: "'PP Pangaia', sans-serif",
              fontSize: "36px",
              fontWeight: "400",
              marginBottom: "24px",
              color: "#000",
            }}
          >
            {job.company}
          </div>
          <div
            style={{
              fontFamily: '"Geist", "Geist Placeholder", sans-serif',
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#666",
            }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {job.description.map((point, idx) => (
                <li key={idx} style={{ marginBottom: idx < job.description.length - 1 ? "12px" : undefined }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
