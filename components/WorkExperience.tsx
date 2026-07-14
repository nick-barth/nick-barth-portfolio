export default function WorkExperience() {
  const jobs = [
    {
      company: "Personio",
      description: [
        "Established the foundation for product analytics operations, implementing cost-optimization strategies that reduced vendor expenses by approximately $20K annually.",
        "Drew on previous vendor expertise to streamline the introduction of a new product into our lineup.",
      ],
    },
    {
      company: "Deepnote",
      description: [
        "Grew PLG revenue 5x, expanded land & expand motion, and ideated solutions to tap into freemium users.",
        "Pitched, architected, and implemented experimentation/feature flagging, performance marketing, onboarding, billing, landing pages, content marketing, and attribution modeling.",
        "Created sales automation for high intent/high velocity users.",
      ],
    },
    {
      company: "Hireproof",
      description: [
        "Built an MVP, acquired funding, and built out the entirety of the product—three apps and a marketing website. Managed growth, marketing, press, and fundraising. Scaled from 0 to 12k MRR. Successfully exited in 2022, all while livestreaming publicly on Twitch.",
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
