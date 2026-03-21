import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground text-center p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-vs-primary mb-6">
        404 - Page Not Found
      </h1>
      <p className="text-base sm:text-lg mb-4">
        It seems you&apos;ve wandered into a{" "}
        <strong>null pointer exception</strong>... <br />
        This route doesn&apos;t exist, but don&apos;t worry, your call stack
        is safe. <br />
        In the meantime, we will try to handle the redirection...
      </p>
      <pre className="bg-vs-background-secondary p-4 rounded-lg text-sm text-left mb-4 max-w-full overflow-auto border border-vs-border">
        {`// The page you requested was not found.\ntry {\n  navigateHome();\n} catch (Error) {\n  const message = "Let's go back!";\n  console.log(message);\n}`}
      </pre>
      <p className="text-base sm:text-lg mb-4">
        While you&apos;re here, why not head back?
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link className="btn-primary text-center" href="/">
          Go Home
        </Link>
        <Link className="btn-secondary text-center" href="/pages/blog">
          Read the Blog
        </Link>
      </div>
    </div>
  );
}
