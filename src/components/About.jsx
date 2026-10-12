const targets = ['Web applications', 'SaaS platforms', 'REST APIs', 'Android applications'];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about-grid">
        <div>
          <h2 id="about-title" className="section-title">
            About me, a software testing engineer
          </h2>
          <div className="prose">
            <p>
              I&rsquo;m a QA engineer who tests software to find problems before users do. My work covers web
              applications, SaaS platforms, REST APIs and Android applications, from checking a single form to following
              a business workflow across several modules.
            </p>
            <p>
              I like understanding why something fails, not only that it fails. When I find a defect I work out how to
              reproduce it reliably, then record the steps, the expected result and the actual result so a developer can
              act on it straight away. After the fix, I retest it and run regression checks around it.
            </p>
            <p>
              I combine manual and functional testing with automation in Selenium WebDriver, Java, TestNG and Maven. I use
              Postman for API validation, Apache JMeter for performance testing and Burp Suite for basic security testing.
              I work closely with developers, and I try to keep bug reports short, specific and easy to verify.
            </p>
          </div>
        </div>
        <aside className="about-aside" aria-labelledby="about-tests">
          <h3 id="about-tests" className="aside-title">
            What I test
          </h3>
          <ul className="plain-list">
            {targets.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
