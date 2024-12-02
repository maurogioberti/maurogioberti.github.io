import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vs-background text-vs-foreground text-center p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-vs-primary mb-6">
        🛠️ 404 - 👾 Ohhh man, where did I get here?! 🌀
      </h1>
      <p className="text-base sm:text-lg mb-4">
        🤖 Hi Human 👽, it seems you&apos;ve wandered into a{" "}
        <strong>null pointer exception</strong>... <br />
        This route doesn&apos;t exist 🥲, but don&apos;t worry, your call stack
        is safe with Mauro Gioberti, trust me, I have no proofs! 🧑‍💻 <br />
        In the meantime, we will try to handle the redirection...
      </p>
      <pre className="bg-vs-background-light p-4 rounded-lg text-sm text-left mb-4 max-w-full overflow-auto">
        {`// The page you requested was not found.\ntry {\n  navigateHome();\n} catch (Error) {\n const wtfIsHappening = "NO Clue 😢!" \n console.log(wtfIsHappening);\n}`}
      </pre>
      <p className="text-base sm:text-lg mb-4">
        <strong>Oh no, it failed!</strong> While you&apos;re here, why not{" "}
        <strong>refactor</strong> your life? Or try your luck by pressing one of
        these buttons 👇
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link className="px-4 py-2 text-base sm:text-lg bg-blue-500 text-white rounded-md hover:bg-blue-600" href="/">
          🚀 To Stratosphere 🔵
        </Link>
        <Link className="px-4 py-2 text-base sm:text-lg bg-red-500 text-white rounded-md hover:bg-red-600" href="/">
          🏠 Full Reset Here 🔴
        </Link>
        <Link className="px-4 py-2 text-base sm:text-lg bg-green-500 text-white rounded-md hover:bg-green-600" href="/">
          🌱 Follow Your Heart 💚
        </Link>
        <Link className="px-4 py-2 text-base sm:text-lg bg-yellow-500 text-white rounded-md hover:bg-yellow-600" href="/">
          📚 Check Forbidden Docs 🟡
        </Link>
        <Link className="px-4 py-2 text-base sm:text-lg bg-purple-500 text-white rounded-md hover:bg-purple-600" href="/">
          🔧 Refactor Reality 🟣
        </Link>
      </div>
    </div>
  );
}
