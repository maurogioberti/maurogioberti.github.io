import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground text-center p-6">
      <h1 className="text-4xl font-bold text-vs-primary mb-4">
        🛠️ 404 - 👾 Ohhh man, where did I get here?! 🌀
      </h1>
      <p className="text-lg">
        🤖 Hi Human 👽, it seems you&apos;ve wandered into a <strong>null pointer exception</strong>... <br />
        This route doesn&apos;t exist 🥲, but don&apos;t worry, your call stack is safe with Mauro Gioberti, trust me, I have no proofs! 🧑‍💻 <br />
        In the meantime, we will try to handle the redirection...
      </p>
      <pre className="bg-vs-background-light p-4 rounded-lg text-sm text-left">
        {`// The page you requested was not found.\ntry {\n  navigateHome();\n} catch (Error) {\n const wtfIsHappening = "I have no idea what to do 😢!" \n console.log(wtfIsHappening);\n}`}
      </pre>
      <p className="text-lg">
        <strong>Oh no, it failed!</strong> Well, while you&apos;re here, why not <strong>refactor</strong> your life? Or try your luck by pressing one of these buttons (just like rebooting your code) 👇
      </p>
      <pre className="bg-vs-background-light p-4 rounded-lg text-sm text-left">
        {`// TODO: Fix this broken route 🙃\nfunction handle404() {\n  return <Redirect to="/" />;\n}`}
      </pre>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link className="text-vs-primary hover:underline text-lg" href="/">
          🚀 Press the blue button and try going to the stratosphere 🔵
        </Link>
        <Link className="text-vs-primary hover:underline text-lg" href="/">
          🏠 Press the red button to reset the URL 🔴
        </Link>
        <Link className="text-vs-primary hover:underline text-lg" href="/">
          🌱 Trust the green button and follow your heart 💚
        </Link>
        <Link className="text-vs-primary hover:underline text-lg" href="/">
          📚 Click the yellow button to read the forbidden docs 🟡
        </Link>
        <Link className="text-vs-primary hover:underline text-lg" href="/">
          🔧 Press the purple button to refactor reality 🟣
        </Link>
      </div>
    </div>
  );
}