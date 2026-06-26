import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Aave Governance — Goodbye</title>
        <meta
          name="description"
          content="This interface is not actively maintained anymore."
        />
      </Head>

      <main className="goodbye">
        <div className="goodbye__inner">
          <img
            className="goodbye__image"
            src="/goodbye.jpg"
            alt="Goodbye illustration from BGD Labs"
          />

          <h1 className="goodbye__title">
            This interface is not actively maintained anymore
          </h1>

          <span className="btn btn--primary">
            <span className="btn__inner">
              <span className="btn__shadow-left" />
              <a
                className="btn__element goodbye__cta"
                href="https://app.aave.com/governance/"
              >
                Go to Aave Governance
              </a>
              <span className="btn__shadow-corner" />
              <span className="btn__shadow-bottom" />
            </span>
          </span>
        </div>
      </main>

      <style jsx>{`
        .goodbye {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
        }

        .goodbye__inner {
          width: 100%;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 2rem;
        }

        .goodbye__image {
          width: 100%;
          max-width: 640px;
          height: auto;
          /* The artwork sits on solid white; multiply lets it blend into
             the warm BGD background with no visible image box. */
          mix-blend-mode: multiply;
        }

        .goodbye__title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: clamp(1.375rem, 1rem + 2vw, 2rem);
          line-height: 1.25;
          letter-spacing: -0.01em;
          text-wrap: balance;
          color: var(--foreground);
          margin: 0;
        }

        /* The .btn wrapper defaults to align-self: flex-start; center it.
           Drive the colors through custom properties (which the button's
           internals read via var()) so the dark face and its 3D extrusion
           faces stay coherent. */
        .btn {
          align-self: center;
          --primary: #0c0e18;
          --primary-foreground: #ffffff;
          --block-border: #0c0e18;
          --block-left: #3d4156;
          --block-bottom: #565b73;
        }
      `}</style>

      <style jsx global>{`
        .goodbye__cta {
          height: 2.75rem;
          padding: 0 1.5rem;
          font-size: 0.9375rem;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
