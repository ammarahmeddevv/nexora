import { Wordmark } from "./wordmark";

const COLUMNS = [
  {
    head: "Product",
    links: ["How it works", "Pricing", "Changelog", "Status"],
  },
  {
    head: "Developers",
    links: ["Documentation", "SDK reference", "Examples", "CLI"],
  },
  {
    head: "Company",
    links: ["About", "Careers", "Security", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="hairline-top bg-canvas">
      <div className="container-x py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">
              Durable background workflows for developers. Write functions, not
              queue plumbing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.head}>
                <h3 className="text-[13px] font-medium text-ink">{col.head}</h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[14px] text-ink-dim transition-colors hover:text-ink"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            Nexora is a fictional company. This site is a design and front-end
            engineering concept by{" "}
            <a
              href="https://github.com/ammarahmeddevv"
              className="text-ink-dim underline decoration-line underline-offset-4 hover:text-ink"
            >
              Ammar Ahmed
            </a>
            .
          </p>
          <p>Built with Next.js, Three.js and GSAP.</p>
        </div>
      </div>
    </footer>
  );
}
