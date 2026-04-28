// Portfolio data — Anirudh Reddy Gotike
const PORTFOLIO = {
  name: "anirudh_gotike",
  fullName: "Anirudh Reddy Gotike",
  role: "Senior Software Engineer · Full-Stack & Cloud",
  location: "Brampton, ON · Greater Toronto Area",
  email: "anirudhreddy2920@gmail.com",
  phone: "+1 519-903-8840",
  github: "anirudhgotike",
  linkedin: "anirudhreddygotike",

  about: {
    raw: `# whoami

Senior Software Engineer at **Sun Life** with 3+ years of progressive experience building full-stack applications and microservices for the financial services industry.

I specialize in **Java**, **Python** and **Node.js** backends, **React** frontends, and **Kafka**-based real-time data pipelines, with deep DevOps fluency across **Kubernetes**, **Docker** and CI/CD tooling.

## what I care about

- **clean, scalable solutions** — code that ships and stays shipped
- **real-time systems** — Kafka pipelines and event-driven architecture
- **the AI × software intersection** — currently digging into generative AI on \`OCI\`
- **solving complex problems** through curiosity, not heroics

## currently

- Senior Software Engineer @ Sun Life (Waterloo, ON)
- Oracle-certified \`Generative AI\` Professional
- M.S. Computer Science, University of Windsor`
  },

  experience: [
    {
      hash: "a3f9c21",
      date: "2024-06 — present",
      author: "anirudh.gotike",
      role: "Senior Software Engineer",
      company: "Sun Life",
      message: "full-stack microservices · real-time data",
      diff: [
        "+ design, develop and maintain REST APIs and microservices in Java, Python and Node.js",
        "+ build reusable front-end components in React for internal platforms",
        "+ integrate systems via Apache Kafka for real-time data streaming",
        "+ implement CI/CD pipelines and DevOps best practices end-to-end",
        "+ deploy and manage applications on Kubernetes with Docker containers"
      ]
    },
    {
      hash: "7c1ab40",
      date: "2023-05 — 2024-06",
      author: "anirudh.gotike",
      role: "Software Engineer",
      company: "Sun Life",
      message: "Java microservices + DevOps maturity",
      diff: [
        "+ designed, developed, tested and debugged Java REST APIs and microservices",
        "+ enhanced DevOps using Jenkins, Artifactory, Bitbucket, Gradle, Continuous Delivery Director and Ansible",
        "+ deployed applications via Kubernetes for scalability and resource management",
        "+ drove process improvements that increased team efficiency"
      ]
    },
    {
      hash: "2e88b13",
      date: "2023-01 — 2023-04",
      author: "anirudh.gotike",
      role: "Associate Software Engineer",
      company: "Sun Life",
      message: "first finance role · stability + quality",
      diff: [
        "+ maintained system stability and reliability across services",
        "+ debugged and resolved software issues across the stack",
        "+ executed unit testing to validate code quality",
        "+ ramped quickly into a regulated financial-services environment"
      ]
    },
    {
      hash: "01a4f08",
      date: "2022-01 — 2023-04",
      author: "anirudh.gotike",
      role: "M.S. Computer Science",
      company: "University of Windsor",
      message: "graduate studies · CS foundations",
      diff: [
        "+ Master of Science in Computer Science",
        "+ deepened systems, distributed computing and software engineering fundamentals",
        "+ B.Tech Computer Science, CVR College of Engineering, Hyderabad (2016–2020)"
      ]
    }
  ],

  projects: [
    {
      filename: "kafka-stream-svc",
      lang: "java",
      description: "Real-time data streaming microservice",
      problem: "// downstream consumers need fills + events\n// at sub-second latency, with replay and DLQs.",
      outcome: "@KafkaListener(topics = \"trades.v1\")\npublic void onTrade(TradeEvent e) {\n  // validate · enrich · fan-out\n  publisher.emit(toCanonical(e));\n}",
      tech: ["java", "kafka", "spring-boot"],
      stars: "internal",
      status: "prod"
    },
    {
      filename: "rest-api-gateway",
      lang: "java",
      description: "Java REST API + microservices suite",
      problem: "// fragmented services, inconsistent contracts.\n// one gateway, one auth model, observable.",
      outcome: "@RestController\n@RequestMapping(\"/api/v1\")\npublic class PolicyController {\n  // OpenAPI · OAuth2 · rate-limited\n  // p99 < 120ms\n}",
      tech: ["java", "spring", "openapi"],
      stars: "internal",
      status: "prod"
    },
    {
      filename: "react-platform-ui",
      lang: "typescript",
      description: "Reusable React component library",
      problem: "// every team rebuilt the same form widgets.\n// ship a library, not 14 forks.",
      outcome: "export const DataTable = <T,>(p: Props<T>) => {\n  // virtualized · accessible · themed\n  return <Table {...p} />;\n};",
      tech: ["react", "typescript", "node"],
      stars: "internal",
      status: "active"
    },
    {
      filename: "ci-cd-pipeline",
      lang: "yaml",
      description: "Jenkins → Kubernetes delivery pipeline",
      problem: "// manual deploys took hours.\n// flaky envs, no rollback story.",
      outcome: "stages:\n  - build:    gradle assemble\n  - scan:     artifactory + sast\n  - deploy:   helm upgrade --atomic\n  - verify:   smoke + canary 5%",
      tech: ["jenkins", "kubernetes", "ansible"],
      stars: "internal",
      status: "stable"
    },
    {
      filename: "py-data-toolkit",
      lang: "python",
      description: "Python utilities for ETL + reporting",
      problem: "# operational reports lived in 9 notebooks.\n# consolidate into a reusable toolkit.",
      outcome: "def pipeline(src: str) -> Report:\n    # extract · clean · validate · publish\n    return Report.build(load(src))",
      tech: ["python", "pandas", "airflow"],
      stars: "internal",
      status: "active"
    },
    {
      filename: "oci-genai-lab",
      lang: "python",
      description: "Generative AI experiments on OCI",
      problem: "# certified, but theory ≠ practice.\n# prototype real RAG + agents on OCI.",
      outcome: "client = oci.generative_ai.Client(cfg)\nresp  = client.chat(prompt, model=\"cohere\")\n# embeddings · retrieval · guardrails",
      tech: ["python", "oci", "genai"],
      stars: "personal",
      status: "active"
    }
  ],

  stack: {
    languages: [
      { name: "java", version: "^17", note: "primary" },
      { name: "python", version: "^3.12", note: "data + ai" },
      { name: "node.js", version: "^20", note: "services" },
      { name: "typescript", version: "^5.x", note: "react apps" }
    ],
    frontend: [
      { name: "react", version: "^18", note: "component libs" },
      { name: "rest-apis", version: "openapi-3", note: "" },
      { name: "microservices", version: "n-tier", note: "" }
    ],
    streaming: [
      { name: "apache-kafka", version: "^3.x", note: "real-time" },
      { name: "event-driven", version: "cqrs", note: "" }
    ],
    devops: [
      { name: "kubernetes", version: "^1.29", note: "orchestration" },
      { name: "docker", version: "^25", note: "" },
      { name: "jenkins", version: "^2.x", note: "ci/cd" },
      { name: "ansible", version: "^9", note: "" },
      { name: "gradle", version: "^8", note: "" },
      { name: "artifactory", version: "jfrog", note: "" },
      { name: "bitbucket", version: "scm", note: "" },
      { name: "cdd", version: "broadcom", note: "continuous delivery director" }
    ],
    cloud: [
      { name: "oracle-cloud", version: "oci-2024", note: "certified" },
      { name: "generative-ai", version: "oci-genai", note: "professional" }
    ]
  },

  certs: [
    { name: "OCI Generative AI Professional", issuer: "Oracle", expiry: "2024 cert", glyph: "◆" },
    { name: "M.S. Computer Science", issuer: "University of Windsor", expiry: "2023", glyph: "M" },
    { name: "B.Tech Computer Science", issuer: "CVR College of Engineering", expiry: "2020", glyph: "B" },
    { name: "CPR / AED Certified", issuer: "Red Cross", expiry: "active", glyph: "+" },
    { name: "First Aid", issuer: "Red Cross", expiry: "active", glyph: "✚" }
  ]
};

window.PORTFOLIO = PORTFOLIO;
